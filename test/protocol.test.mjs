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
const state = { minerals: 3, analyzeCalls: 0, analysis: null, unauthorized: 0, devicePolls: 0, deviceApproved: false, canSpend: true };

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
    const url = new URL(req.url, "http://x");
    // Device sign-in (RFC 8628): unauthenticated endpoints.
    if (url.pathname === "/api/mcp-auth/device") {
      return json(200, { device_code: "dev-123", user_code: "BCDF-GHJK", verification_uri: `${base}/auth/device`, expires_in: 600, interval: 1 });
    }
    if (url.pathname === "/api/mcp-auth/token") {
      let raw = "";
      req.on("data", (c) => (raw += c));
      req.on("end", () => {
        const p = new URLSearchParams(raw);
        state.devicePolls++;
        if (p.get("grant_type") !== "urn:ietf:params:oauth:grant-type:device_code" || p.get("device_code") !== "dev-123") {
          return json(400, { error: "invalid_grant" });
        }
        if (!state.deviceApproved) return json(400, { error: "authorization_pending" });
        return json(200, { access_token: TOKEN, token_type: "Bearer", expires_in: 3600 });
      });
      return;
    }
    if (req.headers.authorization !== `Bearer ${TOKEN}`) { state.unauthorized++; return json(401, { error: "Not authenticated" }); }
    if (url.pathname === "/api/me") return json(200, { minerals: state.minerals, profileName: null, profileRegion: null, emailVerified: true, tokenCanSpend: state.canSpend });
    if (url.pathname === "/api/mcp/replay" && url.searchParams.get("search") === "1") {
      state.lastListQuery = url.search;
      const other = url.searchParams.get("player") && url.searchParams.get("player") !== "me";
      const all = url.searchParams.get("include") === "all";
      return json(200, {
        profile: { name: "Alice", region: "na" },
        player: other ? { name: url.searchParams.get("player"), region: null, me: false } : { name: "Alice", region: "na", me: true },
        scope: other ? "played" : all ? "all" : "played",
        replays: [
          ...(state.extraNotMine
            ? [{ ...summary(), id: "22222222-2222-3333-4444-555555555555", playedAt: "2026-09-23T10:00:00Z", relations: ["coached"], you: null, player: null }]
            : []),
          { ...summary(), playedAt: "2026-09-20T10:00:00Z", relations: ["played", "coached"], you: { name: "Alice", race: "Protoss", result: "Win" } },
        ],
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
  assert.equal(tools.length, 11);
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

test("login offers a code for another device, and signs in once it's approved there", async () => {
  const fresh = new Client({ name: "device-test", version: "1.0.0" });
  await fresh.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [new URL("../dist/index.js", import.meta.url).pathname],
      env: { ...process.env, SC2_API_BASE: base, SC2_API_TOKEN: "", SC2_MCP_NO_BROWSER: "1", SC2_MCP_CREDENTIALS: join(credDir, "device.json") },
    }),
  );
  try {
    const pending = await fresh.callTool({ name: "login", arguments: { wait_seconds: 0 } });
    assert.equal(pending.structuredContent.status, "pending");
    assert.equal(pending.structuredContent.user_code, "BCDF-GHJK");
    assert.equal(pending.structuredContent.verification_uri, `${base}/auth/device`);
    // The code is never folded into the address.
    assert.ok(!pending.structuredContent.verification_uri.includes("BCDF"));
    // Code first, and a hands-off instruction to the assistant.
    assert.match(pending.content[0].text, /Go to .*\/auth\/device/);
    assert.match(pending.content[0].text, /Enter the code BCDF-GHJK/);
    assert.doesNotMatch(pending.content[0].text, /browser window opened/);
    await new Promise((r) => setTimeout(r, 1500));
    assert.ok(state.devicePolls >= 1, "polls while waiting");
    state.deviceApproved = true;
    const done = await fresh.callTool({ name: "login", arguments: { wait_seconds: 10 } });
    assert.ok(!done.isError, done.content[0].text);
    assert.match(done.content[0].text, /Signed in|Already signed in/);
  } finally {
    await fresh.close();
  }
});

test("list_my_replays shows each game's links, the user's result and the filter", async () => {
  const r = await client.callTool({ name: "list_my_replays", arguments: { filter: "coached", limit: 5 } });
  assert.ok(!r.isError, r.content[0].text);
  const t = r.content[0].text;
  assert.match(t, /games Alice \(NA\) played, coached, asked about or uploaded/, "coached filter widens to games the user looked at");
  assert.match(t, new RegExp(REPLAY));
  assert.match(t, /you played: Alice \(Protoss\), Win/);
  assert.match(state.lastListQuery, /include=all/);
  assert.match(state.lastListQuery, /has_report=1/);
  assert.equal(r.structuredContent.replays[0].relations.length, 2);
});

test("search_replays passes every filter to the site and defaults to the signed-in user", async () => {
  const r = await client.callTool({
    name: "search_replays",
    arguments: { from: "2026-06", to: "2026-06-30", map: "Rainfall", opponent: "Bob", opponent_race: "Zerg", result: "loss", has_report: true, limit: 5 },
  });
  assert.ok(!r.isError, r.content[0].text);
  const q = new URLSearchParams(state.lastListQuery);
  assert.equal(q.get("search"), "1");
  assert.equal(q.get("player"), null, "no player = the signed-in user");
  for (const [k, v] of Object.entries({ from: "2026-06", to: "2026-06-30", map: "Rainfall", opponent: "Bob", opponent_race: "Zerg", result: "loss", has_report: "1", limit: "5" })) {
    assert.equal(q.get(k), v, k);
  }
  assert.match(r.content[0].text, /1 of the games Alice \(NA\) played, matching/);
  assert.match(r.content[0].text, /you played: Alice \(Protoss\), Win/);
  assert.equal(q.get("include"), null, "default is games the user played");

  const other = await client.callTool({ name: "search_replays", arguments: { player: "Serral", opponent_race: "Terran" } });
  assert.equal(new URLSearchParams(state.lastListQuery).get("player"), "Serral");
  assert.match(other.content[0].text, /games Serral played/);
  assert.doesNotMatch(other.content[0].text, /you ran the coach/, "someone else's games aren't tagged as the user's");

  const bad = await client.callTool({ name: "search_replays", arguments: { result: "draw" } });
  assert.ok(bad.isError, "schema rejects unknown result");
});

test("with spending off for this connection, paid tools refuse before asking and point to the website", async () => {
  state.canSpend = false;
  try {
    const r = await client.callTool({ name: "analyze_replay", arguments: { replay: REPLAY, confirm_spend: true } });
    assert.ok(r.isError);
    assert.match(r.content[0].text, /turned off for this connection/);
    assert.match(r.content[0].text, /Do NOT open the link/);
    assert.match(r.content[0].text, /\/auth\/mcp/);
    assert.equal(state.analyzeCalls, 0);
    const acct = await client.callTool({ name: "get_account", arguments: {} });
    assert.match(acct.content[0].text, /Spending from this connection: OFF/);
  } finally {
    state.canSpend = true;
  }
});

test("a game the user only coached is labelled as not theirs", async () => {
  state.extraNotMine = true;
  try {
    const r = await client.callTool({ name: "search_replays", arguments: { include: "all" } });
    assert.match(r.content[0].text, /NOT a game the user played \(you ran the coach\)/);
  } finally {
    state.extraNotMine = false;
  }
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
