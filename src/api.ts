import { AsyncLocalStorage } from "node:async_hooks";
import { apiBase, USER_AGENT } from "./config.js";
import { currentToken } from "./credentials.js";

/**
 * Hosted mode: StarCraft2.ai runs these same tools behind its connector
 * endpoint (https://www.starcraft2.ai/api/mcp) for Claude and ChatGPT. Each
 * request then carries a context: the site answers API calls in-process
 * (already signed in as the connector's user), keeps a started coach run
 * alive after the tool returns, and names the caller so in-memory run maps
 * never mix two users.
 */
export interface HostedContext {
  transport: (path: string, init: { method: string; body?: BodyInit; headers: Record<string, string>; signal?: AbortSignal }) => Promise<Response>;
  keepAlive: (work: Promise<unknown>) => void;
  principal: string;
}
const hostedStore = new AsyncLocalStorage<HostedContext>();

export function runHosted<T>(ctx: HostedContext, fn: () => T): T {
  return hostedStore.run(ctx, fn);
}

export function hosted(): HostedContext | undefined {
  return hostedStore.getStore();
}

/** An HTTP error from the site, carrying its machine-readable `code`. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string | null,
    message: string,
    public body: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export class NotSignedInError extends Error {
  constructor() {
    super("Not signed in to StarCraft2.ai. Call the `login` tool first (it opens a browser to sign in).");
  }
}

export interface RequestOptions {
  method?: string;
  body?: BodyInit;
  headers?: Record<string, string>;
  /** Send the bearer token. Defaults to true; the call fails if there is none. */
  auth?: boolean;
  signal?: AbortSignal;
}

export async function request(path: string, opts: RequestOptions = {}): Promise<Response> {
  const headers: Record<string, string> = { "User-Agent": USER_AGENT, Accept: "application/json", ...opts.headers };
  const ctx = hosted();
  if (ctx) return ctx.transport(path, { method: opts.method ?? "GET", body: opts.body, headers, signal: opts.signal });
  if (opts.auth !== false) {
    const tok = await currentToken();
    if (!tok) throw new NotSignedInError();
    headers.Authorization = `Bearer ${tok.token}`;
  }
  return fetch(`${apiBase()}${path}`, { method: opts.method ?? "GET", body: opts.body, headers, signal: opts.signal });
}

/** Turn a non-2xx response into an ApiError with the site's message. */
export async function errorFrom(res: Response): Promise<ApiError> {
  const text = await res.text().catch(() => "");
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* not JSON (an edge error page, say) */
  }
  const message =
    (typeof body.error === "string" && body.error) ||
    (typeof body.error_description === "string" && body.error_description) ||
    `HTTP ${res.status}${text && text.length < 200 ? `: ${text}` : ""}`;
  const code = typeof body.code === "string" ? body.code : typeof body.error === "string" && /^[a-z_]+$/.test(body.error) ? body.error : null;
  if (res.status === 401) {
    const how = hosted()
      ? "Reconnect StarCraft2.ai from the app's connector settings."
      : "Call `login` to sign in again.";
    return new ApiError(401, code ?? "NOT_AUTHED", `Your StarCraft2.ai sign-in is missing, expired or revoked. ${how}`, body);
  }
  return new ApiError(res.status, code, message, body);
}

export async function getJson<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await request(path, opts);
  if (!res.ok) throw await errorFrom(res);
  return (await res.json()) as T;
}

export async function postJson<T>(path: string, payload: unknown, opts: RequestOptions = {}): Promise<T> {
  const res = await request(path, {
    ...opts,
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
  if (!res.ok) throw await errorFrom(res);
  return (await res.json()) as T;
}

// ---- Site types (the subset this server reads) ----

export interface Me {
  /** Purchased (blue) minerals. */
  minerals: number;
  /** What a spend can use now: blue plus coach-plan (gold) minerals (absent on old sites). */
  spendable?: number;
  subMinerals?: number;
  subPlan?: string | null;
  profileName: string | null;
  profileRegion: string | null;
  emailVerified: boolean;
  /** Whether the owner has let this connection spend minerals (null on old sites). */
  tokenCanSpend?: boolean | null;
}

export interface ReplaySummary {
  id: string;
  slug: string;
  url: string;
  title: string | null;
  map: string | null;
  gameType: string | null;
  category: string | null;
  duration: string | null;
  playedAt: string | null;
  players: Array<{ name: string; race: string | null }>;
  teamResults: string[] | null;
  hasAnalysis: boolean;
  analysisVersion: string | null;
  currentCoachVersion: string;
  /** Made with an older coach MAJOR.MINOR: the site re-runs it for free. */
  analysisOutdated?: boolean;
  analysis?: AiAnalysis | null;
  analysisLanguage?: string | null;
  /** An AI Coach run is going on the site right now (someone started it). */
  coachInProgress?: boolean;
}

export type ReplayRelation = "played" | "coached" | "asked" | "uploaded";

/** A row of list_my_replays: a replay plus how the user is linked to it. */
export interface MyReplay extends ReplaySummary {
  relations: ReplayRelation[];
  /** The user's own slot, when their claimed profile played in it. */
  you: { name: string | null; race: string | null; result: string | null } | null;
  /** The searched player's slot (the user, or the player searched for). */
  player?: { name: string | null; race: string | null; result: string | null } | null;
  /** With a `units` search: how many of each the searched player built. */
  units?: Record<string, number>;
}

/** When a search finds nothing and named someone the site doesn't know. */
export interface SearchHints {
  unknown: Array<{ name: string; similar: string[] }>;
  frequentTeammates: Array<{ name: string; games: number }>;
}

export interface AiAnalysis {
  overallAssessment: string;
  teamAnalyses: Array<{
    teamNumber: number;
    playerNames: string[];
    races: string[];
    strategySummary: string;
    keyStrengths: string[];
    keyMistakes: string[];
    momentAnalyses: Array<{ gameTimeFormatted: string; situation: string; advice: string; category?: string }>;
    improvementPriorities: Array<{ title: string; description: string; priority: number }>;
  }>;
  version?: string;
  generatedAt?: string;
  language?: string;
}

export function getReplay(key: string): Promise<ReplaySummary> {
  return getJson<ReplaySummary>(`/api/mcp/replay?id=${encodeURIComponent(key)}`);
}
