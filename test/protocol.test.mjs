// Protocol + credit-gating tests against a mock StarCraft2.ai. Runs the
// built server (dist/index.js) over stdio with the official MCP client.
//   npm run build && npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ElicitRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const TOKEN = "sc2_test_token";
const REPLAY = "11111111-2222-3333-4444-555555555555";
const state = { minerals: 3, analyzeCalls: 0, analysis: null, unauthorized: 0 };

const ANALYSIS = {
  overallAssessment: "A close {Alice|p:Alice} win over {p:Bob}.",
  version: "0.84.2",
  teamAnalyses: [
    {
      teamNumber: 1,
      playerNames: ["Alice"],
      races: ["Protoss"],
      strategySummary: "Blink stalkers.",
      keyStrengths: ["Good {4:10|t:250} blink"],
      keyMistakes: ["Supply blocked"],
      momentAnalyses: [{ gameTimeFormatted: "5:10", situation: "Attack", advice: "Scout first", category: "scouting" }],
      improvementPriorities: [{ title: "Macro", description: "Build probes", priority: 1 }],
    },
  ],
};

function summary() {
  return {
    id: REPLAY, slug: "s", url: "http://x/en/replay/s", title: null, map: "Test LE", gameType: "1v1", category: "Ladder",
    duration: "10:00", playedAt: null, players: [{ name: "Alice", race: "Protoss" }, { name: "Bob", race: "Zerg" }],
    teamResults: ["Win", "Loss"], hasAnalysis: !!state.analysis, analysisVersion: state.analysis?.version ?? null,
    currentCoachVersion: "0.84.2", analysis: state.analysis, analysisLanguage: "en",
  };
}

let api, base, client, credDir;

before(async () => {
  api = createServer((req, res) => {
    const json = (status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
    if (req.headers.authorization !== `Bearer ${TOKEN}`) { state.unauthorized++; return json(401, { error: "Not authenticated" }); }
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/api/me") return json(200, { minerals: state.minerals, profileName: null, profileRegion: null, emailVerified: true });
    if (url.pathname === "/api/mcp/replay" && url.searchParams.get("mine") === "1") {
      state.lastListQuery = url.search;
      return json(200, {
        profile: { name: "Alice", region: "na" },
        replays: [{ ...summary(), playedAt: "2026-09-20T10:00:00Z", relations: ["played", "coached"], you: { name: "Alice", race: "Protoss", result: "Win" } }],
      });
    }
    if (url.pathname === "/api/mcp/replay") return json(200, summary());
    if (url.pathname === "/api/analyze") {
      state.analyzeCalls++;
      state.minerals -= 1;
      res.writeHead(200, { "content-type": "application/x-ndjson" });
      res.write(JSON.stringify({ t: "hb", reasoningChars: 1000, phase: "thinking" }) + "\n");
      setTimeout(() => {
        state.analysis = ANALYSIS;
        res.end(JSON.stringify({ t: "final", body: ANALYSIS }) + "\n");
      }, 1500);
      return;
    }
    json(404, { error: "no route" });
  });
  await new Promise((r) => api.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${api.address().port}`;
  credDir = mkdtempSync(join(tmpdir(), "sc2-mcp-test-"));
  client = new Client({ name: "protocol-test", version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [new URL("../dist/index.js", import.meta.url).pathname],
      env: { ...process.env, SC2_API_BASE: base, SC2_API_TOKEN: TOKEN, SC2_MCP_NO_BROWSER: "1", SC2_MCP_CREDENTIALS: join(credDir, "c.json") },
    }),
  );
});

after(async () => {
  await client?.close();
  api?.close();
  rmSync(credDir, { recursive: true, force: true });
});

const text = (r) => r.content.map((c) => c.text ?? "").join("\n");

test("initialize advertises tools and instructions", () => {
  assert.ok(client.getServerCapabilities().tools);
  assert.match(client.getInstructions(), /confirm_spend/);
  assert.equal(client.getServerVersion().name, "sc2-mcp");
});

test("tools/list: every tool has an object schema and annotations", async () => {
  const { tools } = await client.listTools();
  assert.equal(tools.length, 10);
  for (const t of tools) {
    assert.equal(t.inputSchema.type, "object", t.name);
    assert.ok(t.annotations, t.name);
    assert.ok(t.description.length > 40, t.name);
  }
  const spenders = tools.filter((t) => t.inputSchema.properties?.confirm_spend).map((t) => t.name).sort();
  assert.deepEqual(spenders, ["analyze_replay", "unlock_more_questions"]);
});

test("analyze_replay never spends without confirm_spend", async () => {
  const r = await client.callTool({ name: "analyze_replay", arguments: { replay: REPLAY } });
  assert.equal(r.structuredContent.status, "confirmation_required");
  assert.equal(state.analyzeCalls, 0);
  assert.equal(state.minerals, 3);
  const r2 = await client.callTool({ name: "analyze_replay", arguments: { replay: REPLAY, confirm_spend: false } });
  assert.equal(r2.structuredContent.status, "confirmation_required");
  assert.equal(state.analyzeCalls, 0);
});

test("with elicitation, the user's decline blocks the spend even when confirm_spend is true", async () => {
  const asker = new Client({ name: "elicit-test", version: "1.0.0" }, { capabilities: { elicitation: { form: {} } } });
  let asked = 0;
  asker.setRequestHandler(ElicitRequestSchema, async () => {
    asked++;
    return { action: "decline" };
  });
  await asker.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [new URL("../dist/index.js", import.meta.url).pathname],
      env: { ...process.env, SC2_API_BASE: base, SC2_API_TOKEN: TOKEN, SC2_MCP_NO_BROWSER: "1", SC2_MCP_CREDENTIALS: join(credDir, "c2.json") },
    }),
  );
  try {
    const r = await asker.callTool({ name: "analyze_replay", arguments: { replay: REPLAY, confirm_spend: true } });
    assert.equal(asked, 1);
    assert.equal(r.structuredContent.status, "declined");
    assert.equal(state.analyzeCalls, 0);
    assert.equal(state.minerals, 3);
  } finally {
    await asker.close();
  }
});

test("list_my_replays shows each game's links, the user's result and the filter", async () => {
  const r = await client.callTool({ name: "list_my_replays", arguments: { filter: "coached", limit: 5 } });
  assert.ok(!r.isError, r.content[0].text);
  const t = r.content[0].text;
  assert.match(t, /Games for Alice \(NA\)/);
  assert.match(t, new RegExp(REPLAY));
  assert.match(t, /you: Alice \(Win\)/);
  assert.match(t, /you played, you ran the coach/);
  assert.match(state.lastListQuery, /filter=coached/);
  assert.equal(r.structuredContent.replays[0].relations.length, 2);
});

test("confirmed run streams progress and returns the report", async () => {
  let progress = 0;
  const r = await client.callTool(
    { name: "analyze_replay", arguments: { replay: REPLAY, confirm_spend: true, wait_seconds: 30 } },
    undefined,
    { onprogress: () => progress++ },
  );
  assert.ok(!r.isError, text(r));
  assert.equal(state.analyzeCalls, 1);
  assert.equal(state.minerals, 2);
  assert.match(text(r), /## AI Coach report/);
  assert.match(text(r), /A close Alice win over Bob\./, "citation markup is stripped");
  assert.ok(progress > 0, "progress notifications sent");
});

test("an existing report is returned without another run", async () => {
  const r = await client.callTool({ name: "analyze_replay", arguments: { replay: REPLAY, confirm_spend: true } });
  assert.match(text(r), /already has an AI Coach report/);
  assert.equal(state.analyzeCalls, 1);
  assert.equal(r.structuredContent.spent, 0);
});

test("upload_replay validates input", async () => {
  const both = await client.callTool({ name: "upload_replay", arguments: {} });
  assert.equal(both.isError, true);
  const missing = await client.callTool({ name: "upload_replay", arguments: { path: "/nonexistent/x.SC2Replay" } });
  assert.equal(missing.isError, true);
  assert.match(text(missing), /No replay file/);
});

test("invalid arguments are rejected by schema", async () => {
  const r = await client.callTool({ name: "search_sc2_knowledge", arguments: { query: "x" } });
  assert.equal(r.isError, true);
});
