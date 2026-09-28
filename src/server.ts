import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  ApiError,
  NotSignedInError,
  errorFrom,
  getJson,
  getReplay,
  postJson,
  request,
  type Me,
  type MyReplay,
  type ReplayRelation,
  type ReplaySummary,
} from "./api.js";
import { apiBase, COACH_LANGUAGES, MAX_REPLAY_BYTES, SERVER_NAME, SERVER_VERSION, USER_AGENT } from "./config.js";
import { currentToken, forgetToken } from "./credentials.js";
import { formatAnalysis, formatReplayHeader } from "./format.js";
import { startLogin } from "./login.js";
import { getRun, progressFraction, startRun, waitForRun, type CoachRun } from "./runs.js";

type Extra = {
  signal: AbortSignal;
  _meta?: { progressToken?: string | number };
  sendNotification: (n: { method: "notifications/progress"; params: { progressToken: string | number; progress: number; total?: number; message?: string } }) => Promise<void>;
};

const COACH_PRICE = 1;
const CONFIRM_DESCRIPTION =
  "Set to true ONLY after the user has explicitly agreed, in this conversation, to spend 1 mineral on this. Never set it on your own initiative.";

/**
 * The spend gate. `confirm_spend` must be true, and when the client supports
 * elicitation (MCP 2025-06-18+) the user is also asked directly, so text the
 * model read from a replay or a report can't approve a spend on its own.
 */
async function confirmSpend(server: McpServer, flag: boolean | undefined, question: string): Promise<"ok" | "needs_flag" | "declined"> {
  if (flag !== true) return "needs_flag";
  if (!server.server.getClientCapabilities()?.elicitation) return "ok";
  try {
    const res = await server.server.elicitInput({
      mode: "form",
      message: question,
      requestedSchema: {
        type: "object",
        properties: { confirm: { type: "boolean", title: "Spend the mineral", description: question } },
        required: ["confirm"],
      },
    });
    return res.action === "accept" && res.content?.confirm === true ? "ok" : "declined";
  } catch {
    return "declined";
  }
}


/** /api/me with `minerals` meaning what can be spent now (blue + plan gold). */
async function getMe(): Promise<Me> {
  const me = await getJson<Me>("/api/me");
  return typeof me.spendable === "number" ? { ...me, minerals: me.spendable } : me;
}

function text(body: string, structured?: Record<string, unknown>): CallToolResult {
  return { content: [{ type: "text", text: body }], ...(structured ? { structuredContent: structured } : {}) };
}

function fail(body: string): CallToolResult {
  return { content: [{ type: "text", text: body }], isError: true };
}

function billingUrl(): string {
  return `${apiBase()}/en/billing`;
}

function spendOffText(): string {
  return (
    `Spending minerals is turned off for this connection, so nothing was charged. Only the user can turn it on, ` +
    `themselves, on their own phone or computer: send them this link — ${apiBase()}/auth/mcp — and tell them to sign ` +
    `in again when asked, then tap "Allow spending" next to this app. Do NOT open the link, sign in, or click ` +
    `anything for them (the site requires a fresh sign-in by the user for exactly this reason). Ask again once they ` +
    `say it's done.`
  );
}

/** Tool errors become readable tool results (isError), never protocol errors. */
function describeError(e: unknown): CallToolResult {
  if (e instanceof NotSignedInError) return fail(e.message);
  if (e instanceof ApiError) {
    if (e.status === 402 && e.code === "NO_BALANCE") {
      return fail(`${e.message}\nThe user can buy minerals at ${billingUrl()}.`);
    }
    if (e.status === 403 && e.code === "SPEND_NOT_ALLOWED") return fail(spendOffText());
    if (e.status === 429) return fail(`${e.message} (rate limited)`);
    return fail(`${e.message}${e.code ? ` [${e.code}]` : ""}`);
  }
  if (e instanceof Error && e.name === "AbortError") return fail("Cancelled.");
  return fail(`Request to StarCraft2.ai failed: ${e instanceof Error ? e.message : String(e)}`);
}

function guarded<A>(fn: (args: A, extra: Extra) => Promise<CallToolResult>) {
  return async (args: A, extra: Extra): Promise<CallToolResult> => {
    try {
      return await fn(args, extra);
    } catch (e) {
      return describeError(e);
    }
  };
}

/** Progress notifications for a long call, when the client asked for them. */
function progressReporter(extra: Extra) {
  const token = extra._meta?.progressToken;
  const started = Date.now();
  return (message: string) => {
    if (token === undefined) return;
    // Elapsed seconds: strictly increasing, as the spec requires.
    const progress = Math.max(1, Math.round((Date.now() - started) / 1000));
    void extra.sendNotification({ method: "notifications/progress", params: { progressToken: token, progress, message } }).catch(() => {});
  };
}

function expandPath(p: string): string {
  if (p === "~") return homedir();
  if (p.startsWith("~/") || p.startsWith("~\\")) return resolve(homedir(), p.slice(2));
  return resolve(p);
}

async function loadReplayBytes(args: { path?: string; url?: string }, signal: AbortSignal): Promise<{ bytes: Buffer; filename: string }> {
  if (args.path) {
    const full = expandPath(args.path);
    const info = await stat(full).catch(() => null);
    if (!info?.isFile()) throw new Error(`No replay file at ${full}`);
    if (info.size > MAX_REPLAY_BYTES) throw new Error(`${basename(full)} is larger than the 8 MB upload limit.`);
    return { bytes: await readFile(full), filename: basename(full) };
  }
  const url = new URL(args.url!);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("url must be http(s).");
  const res = await fetch(url, { signal, headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Downloading the replay failed: HTTP ${res.status}`);
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_REPLAY_BYTES) throw new Error("That replay is larger than the 8 MB upload limit.");
  // Read with a byte cap: a response without Content-Length can't balloon memory.
  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = res.body?.getReader();
  if (!reader) throw new Error("The download had no body.");
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_REPLAY_BYTES) {
      await reader.cancel().catch(() => {});
      throw new Error("That replay is larger than the 8 MB upload limit.");
    }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  const name = decodeURIComponent(url.pathname.split("/").pop() || "replay.SC2Replay");
  return { bytes, filename: name };
}

/** multipart/form-data with an explicit Content-Length: the production parser rejects chunked bodies. */
function multipart(field: string, filename: string, bytes: Buffer): { body: Buffer; contentType: string } {
  const boundary = `----sc2mcp${createHash("sha1").update(bytes).digest("hex").slice(0, 24)}`;
  const safeName = filename.replace(/["\r\n]/g, "_");
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="${field}"; filename="${safeName}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return { body: Buffer.concat([head, bytes, tail]), contentType: `multipart/form-data; boundary=${boundary}` };
}

const RELATION_LABEL: Record<ReplayRelation, string> = {
  played: "you played",
  coached: "you ran the coach",
  asked: "you asked about it",
  uploaded: "you uploaded",
};

function replayLine(r: MyReplay, me = true): string {
  const players = r.players.map((p) => `${p.name}${p.race ? ` (${p.race})` : ""}`).join(" vs ");
  const when = (r.playedAt ?? "").slice(0, 10);
  const slot = r.player ?? r.you;
  // Say whose game it is in so many words: a model will otherwise read
  // "your games" as "games you played" (it did, with someone else's game).
  const who = slot
    ? ` · ${me ? "you played" : "player"}: ${slot.name}${slot.race ? ` (${slot.race})` : ""}${slot.result ? `, ${slot.result}` : ""}`
    : me
      ? ` · NOT a game the user played (${r.relations.filter((x) => x !== "played").map((x) => RELATION_LABEL[x]).join(", ") || "linked"})`
      : "";
  const report = r.hasAnalysis ? `report ${r.analysisOutdated ? "(older coach version)" : "ready"}` : "no report";
  return `- ${r.id} · ${when ? `${when} · ` : ""}${r.map ?? "?"} · ${players}${r.duration ? ` · ${r.duration}` : ""}${who} · ${report}`;
}

function runStatusText(run: CoachRun, r: ReplaySummary): string {
  const secs = Math.round((Date.now() - run.startedAt) / 1000);
  const pct = Math.round(progressFraction(run) * 100);
  return (
    `The AI Coach is still analyzing ${r.map ?? "this replay"} (${secs}s elapsed, about ${pct}% — ${run.phase}). ` +
    `Runs usually take 3–7 minutes. Call get_analysis with replay "${r.id}" to wait for the report; ` +
    `no further minerals are needed.`
  );
}

function runResult(run: CoachRun, r: ReplaySummary): CallToolResult {
  if (run.error) {
    const e = run.error;
    if (e instanceof ApiError && e.code === "RUN_IN_PROGRESS") {
      return text(`An AI Coach run for this replay is already in progress on StarCraft2.ai (started elsewhere). Call get_analysis in a minute or two.`);
    }
    const refunded = e instanceof ApiError && e.status >= 500 ? " Failed runs are refunded automatically." : "";
    return { ...describeError(e), content: [{ type: "text", text: `AI Coach run failed: ${e.message}.${refunded}` }] };
  }
  if (!run.analysis) return fail("The AI Coach run ended without a report.");
  return text(`${formatReplayHeader({ ...r, hasAnalysis: true, analysisVersion: run.analysis.version ?? r.analysisVersion })}\n\n${formatAnalysis(run.analysis)}`, {
    replayId: r.id,
    url: r.url,
    analysis: run.analysis as unknown as Record<string, unknown>,
  });
}

// ---- Chat (the site's AI SDK UI-message stream) ----

interface HistoryResponse {
  access: { status: string };
  messages: Array<{ id: string; role: "user" | "assistant"; parts: Array<{ type: "text"; text: string }> }>;
  quotaUsed: number;
  quotaTotal: number;
  unlocksPurchased: number;
}

async function getHistory(replayId: string): Promise<HistoryResponse> {
  const history = await getJson<HistoryResponse>(`/api/coach-chat/history?replayId=${replayId}`);
  // A revoked or expired token still gets a 200 here, as "not_authed".
  if (history.access?.status !== "ok") throw new NotSignedInError();
  return history;
}

async function readChatStream(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Chat response had no body");
  const decoder = new TextDecoder();
  let buf = "";
  let answer = "";
  let streamError: string | null = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data) as { type?: string; delta?: string; errorText?: string };
        if (evt.type === "text-delta" && typeof evt.delta === "string") answer += evt.delta;
        else if (evt.type === "error") streamError = evt.errorText ?? "chat stream error";
      } catch {
        /* partial or non-JSON line */
      }
    }
    if (done) break;
  }
  if (!answer.trim() && streamError) throw new Error(streamError);
  return answer.trim();
}

// ---- Server ----

export function createServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION, title: "StarCraft II AI Coach (StarCraft2.ai)" },
    {
      instructions:
        "Tools for StarCraft2.ai, a StarCraft II replay analyzer with an AI Coach. " +
        "Every tool except `login` and `upload_replay` needs the user to be signed in; if a tool says they aren't, call `login`. " +
        "Minerals are the site's paid credits: running the AI Coach on a replay costs 1 mineral, and follow-up questions " +
        "about a replay are free for the first 3 then 1 mineral per 20 more. Tools that spend minerals refuse unless " +
        "`confirm_spend` is true — ask the user first and only set it after they agree. When the user mentions one of their " +
        "games ('my last game'), call `list_my_replays` first; to narrow by date, map, opponent, race or result ('my losses on " +
        "Rainfall in June') use `search_replays`. Games they played, coached or uploaded before are already there, and an " +
        "existing report is free to re-read. Knowledge search, uploads and " +
        "reading existing reports are free. For general StarCraft II questions, use `search_sc2_knowledge` and answer " +
        "from the passages it returns, citing their URLs.",
    },
  );

  server.registerTool(
    "login",
    {
      title: "Sign in to StarCraft2.ai",
      description:
        "Sign in to the user's StarCraft2.ai account. Required before any other tool. Returns a verification address and a " +
        "short code: send both to the user exactly as given, as two separate pieces, so they can sign in and approve on " +
        "their own phone or computer. Assume the user is NOT at this computer unless you know they are; never open " +
        "the page or sign in for them. Set open_browser only when the user is sitting at this machine (e.g. a " +
        "terminal coding session) and wants a browser window here. Call again after they've approved to continue.",
      inputSchema: {
        wait_seconds: z.number().int().min(0).max(300).optional().describe("How long to wait for the user to approve (default 45)."),
        open_browser: z
          .boolean()
          .optional()
          .describe("Also open the approval page in this computer's browser. Only when the user is at this computer."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    guarded(async ({ wait_seconds, open_browser }: { wait_seconds?: number; open_browser?: boolean }, extra) => {
      const existing = await currentToken();
      if (existing) {
        try {
          const me = await getMe();
          return text(`Already signed in to StarCraft2.ai${existing.source === "env" ? " (token from SC2_API_TOKEN)" : ""}. Mineral balance: ${me.minerals}.`);
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 401)) throw e;
          if (existing.source === "env") return fail("SC2_API_TOKEN is set but the site rejected it. Remove it or replace it with a valid token.");
          await forgetToken();
        }
      }
      const flow = await startLogin(open_browser === true);
      const report = progressReporter(extra);
      const deadline = Date.now() + (wait_seconds ?? 45) * 1000;
      while (!flow.settled && Date.now() < deadline && !extra.signal.aborted) {
        report("Waiting for approval");
        await Promise.race([flow.done.catch(() => {}), new Promise((r) => setTimeout(r, 3000))]);
      }
      if (!flow.settled) {
        const onThisComputer = open_browser
          ? `\n\nIf the user is at this computer, a browser window opened here too; if it didn't, the page is:\n${flow.url}`
          : "";
        const lead = flow.device
          ? `Send the user these two things so they can connect their StarCraft2.ai account from their own phone or computer:\n` +
            `1. Go to ${flow.device.verificationUri}\n2. Enter the code ${flow.device.userCode}\n` +
            `(They sign in there themselves; the code works for 10 minutes. They should only enter it because they asked to connect.)`
          : `Ask the user to open this page on this computer and approve: ${flow.url}`;
        return text(`${lead}${onThisComputer}\n\nOnce they say they've approved, call login again (or any other tool) to continue.`, {
          status: "pending",
          url: flow.url,
          verification_uri: flow.device?.verificationUri ?? null,
          user_code: flow.device?.userCode ?? null,
        });
      }
      if (flow.error) return fail(flow.error);
      const me = await getMe();
      return text(`Signed in to StarCraft2.ai. Mineral balance: ${me.minerals}.`, { status: "signed_in", minerals: me.minerals });
    }),
  );

  server.registerTool(
    "logout",
    {
      title: "Sign out",
      description: "Sign out of StarCraft2.ai on this computer: revokes this device's token and deletes it locally.",
      inputSchema: {},
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    },
    guarded(async () => {
      const tok = await currentToken();
      if (!tok) return text("Not signed in.");
      const revoked = await fetch(`${apiBase()}/api/mcp-auth/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ token: tok.token }),
      }).then((r) => r.ok, () => false);
      const note = revoked ? "" : " The site couldn't be reached to revoke it; disconnect it at " + `${apiBase()}/auth/mcp.`;
      if (tok.source === "env") return text(`${revoked ? "Revoked the token from SC2_API_TOKEN. " : ""}Remove SC2_API_TOKEN from your MCP config.${note}`);
      await forgetToken();
      return text(`Signed out. The token was ${revoked ? "revoked and " : ""}deleted from this computer.${note}`);
    }),
  );

  server.registerTool(
    "get_account",
    {
      title: "Account and mineral balance",
      description: "The signed-in user's mineral balance (StarCraft2.ai credits), claimed SC2 profile, and where to buy more minerals.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guarded(async () => {
      const me = await getMe();
      const profile = me.profileName ? `${me.profileName} (${me.profileRegion ?? "?"})` : "none claimed";
      return text(
        `Minerals: ${me.minerals}\nSC2 profile: ${profile}\n` +
          (me.tokenCanSpend === false
            ? `Spending from this connection: OFF (turn it on at ${apiBase()}/auth/mcp → Connected apps)\n`
            : me.tokenCanSpend === true
              ? "Spending from this connection: allowed\n"
              : "") +
          `Prices: AI Coach report 1 mineral; follow-up questions 3 free per replay, then 1 mineral per 20.\nBuy minerals: ${billingUrl()}`,
        {
          minerals: me.minerals,
          canSpend: me.tokenCanSpend ?? null,
          profileName: me.profileName,
          profileRegion: me.profileRegion,
          billingUrl: billingUrl(),
        },
      );
    }),
  );

  server.registerTool(
    "search_sc2_knowledge",
    {
      title: "Search StarCraft II knowledge",
      description:
        "Search StarCraft2.ai's StarCraft II knowledge base — Liquipedia unit/building/ability data, current patch notes, " +
        "strategy and matchup articles, and pro-game insights — the same sources the AI Coach cites. Use it to answer general " +
        "SC2 questions (unit stats, counters, build orders, patch changes, matchup advice); answer from the passages and cite their URLs. Free.",
      inputSchema: {
        query: z.string().min(2).max(300).describe("What to look up, e.g. 'Disruptor Purification Nova damage and cooldown' or 'PvZ vs ling bane all-in defense'."),
        limit: z.number().int().min(1).max(10).optional().describe("Number of passages (default 5)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guarded(async ({ query, limit }: { query: string; limit?: number }) => {
      const { results } = await postJson<{ results: Array<{ title: string; section: string | null; url: string; content: string; similarity: number }> }>(
        "/api/kb-search",
        { query, limit },
      );
      if (results.length === 0) return text("No passages found. Try a broader or rephrased query.", { results: [] });
      const body = results
        .map((r, i) => `[${i + 1}] ${r.title}${r.section ? ` — ${r.section}` : ""}\n${r.url}\n${r.content}`)
        .join("\n\n");
      return text(body, { results });
    }),
  );

  server.registerTool(
    "upload_replay",
    {
      title: "Upload a replay",
      description:
        "Upload a StarCraft II replay (.SC2Replay) — or a Brood War .rep — to StarCraft2.ai from a local file path or a download URL. " +
        "Works without signing in (the upload is then anonymous); when signed in it is attributed to the user. Returns the " +
        "replay id and page, and when signed in whether an AI Coach report already exists. Free. On Windows the default replay folder is Documents\\StarCraft II\\Accounts\\…\\Replays\\Multiplayer; " +
        "on macOS ~/Library/Application Support/Blizzard/StarCraft II/Accounts/…/Replays/Multiplayer.",
      inputSchema: {
        path: z.string().min(1).optional().describe("Local path to the replay file (~ is expanded)."),
        url: z.string().url().optional().describe("http(s) URL the replay file can be downloaded from."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    guarded(async (args: { path?: string; url?: string }, extra) => {
      if (!!args.path === !!args.url) return fail("Give exactly one of `path` or `url`.");
      const signedIn = !!(await currentToken());
      const { bytes, filename } = await loadReplayBytes(args, extra.signal);
      const isBw = filename.toLowerCase().endsWith(".rep");
      if (!isBw && !(bytes.length >= 64 && bytes.subarray(0, 3).toString("latin1") === "MPQ")) {
        return fail(`${filename} isn't a StarCraft II replay (expected an .SC2Replay file).`);
      }
      const form = multipart("replay", filename, bytes);
      // Uploading needs no account; ?summary=1 asks for a small answer
      // instead of the multi-megabyte parse the website renders.
      const res = await request(isBw ? "/api/parse-bw" : "/api/parse?summary=1", {
        method: "POST",
        body: new Uint8Array(form.body),
        headers: { "Content-Type": form.contentType, "Content-Length": String(form.body.length) },
        signal: extra.signal,
        auth: signedIn,
      });
      if (!res.ok) throw await errorFrom(res);
      const parsed = (await res.json()) as {
        id?: string;
        url?: string;
        map?: string;
        players?: Array<{ name: string | null; race: string | null; result: string | null }>;
        duplicate?: boolean;
      };
      if (!parsed.id) return fail("The site parsed the replay but didn't return an id.");
      if (!signedIn) {
        const who = (parsed.players ?? []).map((p) => `${p.name}${p.race ? ` (${p.race})` : ""}${p.result ? `, ${p.result}` : ""}`).join(" vs ");
        return text(
          `Uploaded ${filename}${parsed.duplicate ? " (it was already on the site)" : ""}.\n` +
            `Replay ${parsed.id}${parsed.map ? ` · ${parsed.map}` : ""}${who ? ` · ${who}` : ""}\nWeb page: ${parsed.url ?? ""}\n\n` +
            `Uploaded anonymously: it isn't linked to an account. To link it, and to use the AI Coach, call login and upload again.`,
          { replayId: parsed.id, url: parsed.url ?? null, anonymous: true },
        );
      }
      // The production parser has no session; attribution is a separate
      // claim that proves possession with the file's SHA-256.
      const fileHash = createHash("sha256").update(bytes).digest("hex");
      await postJson("/api/replays/claim", { id: parsed.id, fileHash }).catch(() => null);
      const summary = await getReplay(parsed.id);
      const next = summary.hasAnalysis
        ? "An AI Coach report already exists — get_analysis returns it for free."
        : "No AI Coach report yet. analyze_replay runs one for 1 mineral (ask the user first).";
      return text(`Uploaded ${filename}.\n${formatReplayHeader(summary)}\n\n${next}`, {
        replayId: summary.id,
        url: summary.url,
        hasAnalysis: summary.hasAnalysis,
      });
    }),
  );

  /** One call to the site's search, formatted; shared by both listing tools. */
  async function runSearch(params: Record<string, string | number | boolean | undefined>, emptyHint: string) {
    const qs = new URLSearchParams({ search: "1" });
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === "" || v === false) continue;
      qs.set(k, v === true ? "1" : String(v));
    }
    const { replays, profile, player, scope } = await getJson<{
      replays: MyReplay[];
      profile: { name: string; region: string } | null;
      player: { name: string; region: string | null; me: boolean } | null;
      scope?: "played" | "all" | "linked";
    }>(`/api/mcp/replay?${qs}`);
    const me = !params.player || String(params.player).toLowerCase() === "me";
    const claimHint =
      me && !profile
        ? "\n\nNo SC2 profile is linked to this account, so games the user played but never coached, asked about or " +
          `uploaded aren't included. They can link it under "Set your profile" in the account menu at ${apiBase()}.`
        : "";
    const filters = Object.entries(params)
      .filter(([k, v]) => v !== undefined && v !== "" && v !== false && k !== "limit" && k !== "player" && k !== "include")
      .map(([k, v]) => (v === true ? k : `${k}=${v}`))
      .join(", ");
    const who = me
      ? scope === "all"
        ? `games ${profile ? `${profile.name} (${profile.region.toUpperCase()}) played, ` : ""}coached, asked about or uploaded`
        : scope === "linked"
          ? "games this account coached, asked about or uploaded (no SC2 profile is linked, so games the user played can't be identified)"
          : `games ${profile ? `${profile.name} (${profile.region.toUpperCase()})` : "the user"} played`
      : `games ${player?.name ?? params.player} played`;
    if (replays.length === 0) {
      return text(`No ${who}${filters ? ` matching ${filters}` : ""}. ${emptyHint}${claimHint}`, { replays: [], profile, player, scope });
    }
    const head = `${replays.length} of the ${who}${filters ? `, matching ${filters}` : ""}, newest first:`;
    return text(`${head}\n${replays.map((r) => replayLine(r, me)).join("\n")}${claimHint}`, {
      replays: replays as unknown as Record<string, unknown>[],
      profile,
      player,
      scope,
    } as Record<string, unknown>);
  }

  server.registerTool(
    "list_my_replays",
    {
      title: "List my games",
      description:
        "The games the signed-in user PLAYED, newest first (matched by their linked SC2 profile), with their race and " +
        "result and whether an AI Coach report exists. CALL THIS FIRST for 'my last game' / 'the game I last played'. " +
        "filter 'coached' instead lists games with a report that the user played OR ran the coach on / asked about — " +
        "those can be other people's games, and each line says so. An existing report is free to re-read with " +
        "get_analysis. To narrow by date, map, opponent, race or result, use search_replays. Free.",
      inputSchema: {
        limit: z.number().int().min(1).max(50).optional().describe("How many (default 10)."),
        filter: z
          .enum(["all", "coached", "played"])
          .optional()
          .describe("Default: games the user played. 'coached': games with an AI Coach report the user played or looked at."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guarded(async ({ limit, filter }: { limit?: number; filter?: "all" | "coached" | "played" }) =>
      runSearch(
        { limit: limit ?? 10, has_report: filter === "coached", include: filter === "coached" ? "all" : undefined },
        filter === "coached" ? "None of them has an AI Coach report yet." : "Upload a replay with upload_replay.",
      ),
    ),
  );

  server.registerTool(
    "search_replays",
    {
      title: "Search games",
      description:
        "Search StarCraft II games on StarCraft2.ai. By default searches the games the SIGNED-IN USER PLAYED (matched by " +
        "their linked SC2 profile) — use it for requests like 'my losses on Rainfall last month', 'my PvZ " +
        "games since June', 'games against <name>', 'my coached games from May'. Set player to someone else's in-game name to " +
        "search their public games instead. Every filter is optional and applied before the limit, so results cover all " +
        "matching games, newest first. Returns replay ids for get_analysis / ask_about_replay. Free.",
      inputSchema: {
        player: z
          .string()
          .max(80)
          .optional()
          .describe("'me' (default) for the signed-in user, or another player's exact in-game name (case-insensitive)."),
        region: z.enum(["na", "eu", "kr", "cn"]).optional().describe("With player: only that player's games on this server."),
        from: z.string().optional().describe("Played on or after: YYYY-MM or YYYY-MM-DD. Convert 'last month' etc. to dates yourself."),
        to: z.string().optional().describe("Played on or before (inclusive): YYYY-MM or YYYY-MM-DD."),
        map: z.string().max(80).optional().describe("Map name or part of it, e.g. 'Rainfall'."),
        opponent: z.string().max(80).optional().describe("Part of an opponent's name (players on the other team)."),
        race: z.enum(["Terran", "Protoss", "Zerg"]).optional().describe("The searched player's race."),
        opponent_race: z.enum(["Terran", "Protoss", "Zerg"]).optional().describe("An opponent's race, e.g. Zerg for 'vs Zerg' / 'PvZ'."),
        result: z.enum(["win", "loss"]).optional().describe("The searched player's result."),
        game_type: z.string().regex(/^\d+v\d+$/).optional().describe("e.g. '1v1', '2v2'."),
        has_report: z.boolean().optional().describe("Only games that already have an AI Coach report (free to re-read)."),
        include: z
          .enum(["played", "all"])
          .optional()
          .describe("'played' (default): games the user played. 'all': also games they only ran the coach on, asked about or uploaded — often other people's games."),
        limit: z.number().int().min(1).max(50).optional().describe("How many (default 10)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guarded(async (args: Record<string, string | number | boolean | undefined>) =>
      runSearch({ ...args, limit: (args.limit as number | undefined) ?? 10 }, "Try fewer filters or a wider date range."),
    ),
  );

  const replayArg = z
    .string()
    .min(1)
    .describe("Replay id, short id, slug, or a StarCraft2.ai replay URL.");

  server.registerTool(
    "get_analysis",
    {
      title: "Get a replay's AI Coach report",
      description:
        "Read a replay's details and its AI Coach report if one exists. If this session started a coach run that is still " +
        "going, waits for it (up to wait_seconds) and returns the report when it lands. Free — never spends minerals.",
      inputSchema: {
        replay: replayArg,
        wait_seconds: z.number().int().min(0).max(600).optional().describe("Max seconds to wait for an in-progress run (default 50)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guarded(async ({ replay, wait_seconds }: { replay: string; wait_seconds?: number }, extra) => {
      const summary = await getReplay(replay);
      const run = getRun(summary.id);
      if (run && !run.analysis && !run.error) {
        const report = progressReporter(extra);
        const settled = await waitForRun(run, (wait_seconds ?? 50) * 1000, (r) => report(`AI Coach ${r.phase}, ~${Math.round(progressFraction(r) * 100)}%`), extra.signal);
        if (!settled) return text(runStatusText(run, summary), { status: "running", replayId: summary.id });
        return runResult(run, summary);
      }
      if (run?.analysis || run?.error) return runResult(run, summary);
      if (!summary.analysis) {
        return text(`${formatReplayHeader(summary)}\n\nNo AI Coach report yet. analyze_replay runs one for ${COACH_PRICE} mineral (ask the user first).`, {
          replayId: summary.id,
          hasAnalysis: false,
        });
      }
      const outdated = summary.analysisOutdated === true;
      return text(
        `${formatReplayHeader(summary)}\n\n${formatAnalysis(summary.analysis)}` +
          (outdated ? `\n\n(Made with an older coach version. analyze_replay with upgrade: true re-runs it on the current version for free.)` : ""),
        { replayId: summary.id, url: summary.url, analysis: summary.analysis as unknown as Record<string, unknown> },
      );
    }),
  );

  server.registerTool(
    "analyze_replay",
    {
      title: "Run the AI Coach on a replay",
      description:
        `Run StarCraft2.ai's AI Coach on an uploaded replay. COSTS ${COACH_PRICE} MINERAL (the site's paid credits) unless the replay ` +
        "already has a report, which is returned free. Refuses to spend unless confirm_spend is true — tell the user the price and " +
        "their balance and get a yes first. A run takes 3–7 minutes: this waits up to wait_seconds, then returns and the run " +
        "continues; call get_analysis to collect it. Failed runs are refunded by the site.",
      inputSchema: {
        replay: replayArg,
        confirm_spend: z.boolean().optional().describe(CONFIRM_DESCRIPTION),
        language: z.enum(COACH_LANGUAGES).optional().describe("Report language (default en)."),
        upgrade: z
          .boolean()
          .optional()
          .describe("Re-run an existing report that was made with an older coach version. Free; only works when the report is outdated."),
        wait_seconds: z.number().int().min(0).max(600).optional().describe("Max seconds to wait before returning (default 50)."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    guarded(
      async (
        { replay, confirm_spend, language, upgrade, wait_seconds }: { replay: string; confirm_spend?: boolean; language?: string; upgrade?: boolean; wait_seconds?: number },
        extra,
      ) => {
        const summary = await getReplay(replay);
        let run = getRun(summary.id);
        if (!run || run.settled) {
          const outdated = summary.analysisOutdated === true;
          if (summary.analysis && !(upgrade && outdated)) {
            return text(
              `This replay already has an AI Coach report — no minerals spent.${language && summary.analysisLanguage && language !== summary.analysisLanguage ? ` (It is in ${summary.analysisLanguage}; a report is made once per replay.)` : ""}\n\n${formatReplayHeader(summary)}\n\n${formatAnalysis(summary.analysis)}` +
                (outdated ? `\n\n(Older coach version; pass upgrade: true to re-run it on the current version for free.)` : ""),
              { replayId: summary.id, spent: 0, analysis: summary.analysis as unknown as Record<string, unknown> },
            );
          }
          if (upgrade && summary.analysis && outdated) {
            run = startRun(summary.id, { language: language ?? summary.analysisLanguage ?? "en", regenerate: true });
          } else {
            const me = await getMe();
            if (me.tokenCanSpend === false) return fail(spendOffText());
            if (me.minerals < COACH_PRICE) {
              return fail(`Running the AI Coach costs ${COACH_PRICE} mineral and the balance is ${me.minerals}. The user can buy minerals at ${billingUrl()}.`);
            }
            const gate = await confirmSpend(
              server,
              confirm_spend,
              `Run the AI Coach on ${summary.map ?? "this replay"} for ${COACH_PRICE} mineral? Your balance is ${me.minerals}.`,
            );
            if (gate === "declined") return text("Not started: the user declined the spend.", { status: "declined" });
            if (gate === "needs_flag") {
              return text(
                `Not started. Running the AI Coach on this replay costs ${COACH_PRICE} mineral; the balance is ${me.minerals}. ` +
                  `Ask the user to confirm, then call analyze_replay again with confirm_spend: true.`,
                { status: "confirmation_required", price: COACH_PRICE, minerals: me.minerals },
              );
            }
            run = startRun(summary.id, { language: language ?? "en" });
          }
        }
        const report = progressReporter(extra);
        const settled = await waitForRun(run, (wait_seconds ?? 50) * 1000, (r) => report(`AI Coach ${r.phase}, ~${Math.round(progressFraction(r) * 100)}%`), extra.signal);
        if (!settled) return text(runStatusText(run, summary), { status: "running", replayId: summary.id });
        return runResult(run, summary);
      },
    ),
  );

  server.registerTool(
    "ask_about_replay",
    {
      title: "Ask the coach about a replay",
      description:
        "Ask StarCraft2.ai's coach a follow-up question about a replay that has an AI Coach report (it can check the replay's " +
        "numbers and the knowledge base). The first 3 questions per replay are free; after that the site needs 1 mineral per 20 " +
        "more, bought with unlock_more_questions (ask the user first). Shows the remaining free/unlocked questions.",
      inputSchema: {
        replay: replayArg,
        question: z.string().min(1).max(2000).describe("The user's question, in their words."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    guarded(async ({ replay, question }: { replay: string; question: string }, extra) => {
      const summary = await getReplay(replay);
      if (!summary.hasAnalysis) {
        return fail(`This replay has no AI Coach report yet, and follow-up questions need one. analyze_replay runs it for ${COACH_PRICE} mineral.`);
      }
      const history = await getHistory(summary.id);
      if (history.quotaUsed >= history.quotaTotal) {
        return text(
          `No questions left on this replay (${history.quotaUsed} of ${history.quotaTotal} used). 1 mineral unlocks 20 more — ` +
            `ask the user, then call unlock_more_questions with confirm_spend: true.`,
          { status: "quota_exhausted", quotaUsed: history.quotaUsed, quotaTotal: history.quotaTotal },
        );
      }
      const report = progressReporter(extra);
      report("Asking the coach");
      const messages = [
        ...history.messages.map((m) => ({ id: m.id, role: m.role, parts: m.parts })),
        { id: `mcp-${Date.now()}`, role: "user", parts: [{ type: "text", text: question }] },
      ];
      const res = await request("/api/coach-chat", {
        method: "POST",
        body: JSON.stringify({ replayId: summary.id, messages }),
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        signal: extra.signal,
      });
      if (!res.ok) throw await errorFrom(res);
      const answer = await readChatStream(res);
      const remaining = Math.max(0, history.quotaTotal - history.quotaUsed - 1);
      return text(`${answer || "(the coach returned an empty answer)"}\n\n— ${remaining} question${remaining === 1 ? "" : "s"} left on this replay.`, {
        answer,
        questionsRemaining: remaining,
      });
    }),
  );

  server.registerTool(
    "unlock_more_questions",
    {
      title: "Buy more follow-up questions",
      description:
        "Spend 1 MINERAL to unlock 20 more follow-up questions on one replay (same price as the website). Refuses unless " +
        "confirm_spend is true — only after the user agreed to spend the mineral.",
      inputSchema: { replay: replayArg, confirm_spend: z.boolean().optional().describe(CONFIRM_DESCRIPTION) },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    guarded(async ({ replay, confirm_spend }: { replay: string; confirm_spend?: boolean }) => {
      const summary = await getReplay(replay);
      if (!summary.hasAnalysis) return fail("This replay has no AI Coach report, so there's nothing to ask about yet.");
      const history = await getHistory(summary.id);
      const left = history.quotaTotal - history.quotaUsed;
      if (left > 0) {
        return text(`Nothing bought: ${left} question${left === 1 ? "" : "s"} still left on this replay. Unlock only once they're used up.`, {
          status: "not_needed",
          questionsRemaining: left,
        });
      }
      const me = await getMe();
      if (me.tokenCanSpend === false) return fail(spendOffText());
      if (me.minerals < 1) return fail(`The balance is 0 minerals. The user can buy minerals at ${billingUrl()}.`);
      const gate = await confirmSpend(server, confirm_spend, `Spend 1 mineral for 20 more questions on ${summary.map ?? "this replay"}? Your balance is ${me.minerals}.`);
      if (gate === "declined") return text("Not purchased: the user declined the spend.", { status: "declined" });
      if (gate === "needs_flag") {
        return text(
          `Not purchased. 20 more questions on this replay cost 1 mineral; the balance is ${me.minerals}. Ask the user, then call again with confirm_spend: true.`,
          { status: "confirmation_required", price: 1, minerals: me.minerals },
        );
      }
      const out = await postJson<{ newBalance: number; unlocked: number }>("/api/coach-chat/unlock", { replayId: summary.id });
      return text(`Unlocked ${out.unlocked} more questions on this replay. Mineral balance: ${out.newBalance}.`, {
        unlocked: out.unlocked,
        minerals: out.newBalance,
      });
    }),
  );

  return server;
}
