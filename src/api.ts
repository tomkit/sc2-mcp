import { apiBase, USER_AGENT } from "./config.js";
import { currentToken } from "./credentials.js";

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
    return new ApiError(401, code ?? "NOT_AUTHED", "Your StarCraft2.ai sign-in is missing, expired or revoked. Call `login` to sign in again.", body);
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
  minerals: number;
  profileName: string | null;
  profileRegion: string | null;
  emailVerified: boolean;
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
