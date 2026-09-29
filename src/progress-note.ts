import { ApiError, errorFrom, request } from "./api.js";

/** A game the check-in note read (or would read), as /api/profile-coach lists it. */
export interface NoteGame {
  id: string;
  slug: string;
  map: string;
  playerNames: string[];
  playedAt: string | null;
}

/** GET/POST /api/profile-coach, the fields this server reads. */
export interface ProgressNote {
  category: "ranked" | "unranked";
  summaryId: string | null;
  summary: string | null;
  language: string | null;
  generatedAt: string | null;
  /** The games the saved note read, in citation order ([1] is the first). */
  summaryReplays: NoteGame[];
  /** The games a new note would read now. */
  currentReplays: NoteGame[];
  hasNewGames: boolean;
  summaryNeedsRefresh: boolean;
}

export type Category = "ranked" | "unranked";

export interface NoteRun {
  key: string;
  startedAt: number;
  done: Promise<void>;
  settled: boolean;
  note: ProgressNote | null;
  error: Error | null;
  /** The result was handed back to a tool call (so a later call starts fresh). */
  delivered: boolean;
}

const runs = new Map<string, NoteRun>();

export function noteKey(region: string, name: string, category: Category): string {
  return `${region}/${name.toLowerCase()}/${category}`;
}

export function getNoteRun(key: string): NoteRun | undefined {
  return runs.get(key);
}

export function getNote(region: string, name: string, category: Category, signal?: AbortSignal): Promise<ProgressNote> {
  const q = new URLSearchParams({ region, name, category });
  return (async () => {
    const res = await request(`/api/profile-coach?${q}`, { signal });
    if (!res.ok) throw await errorFrom(res);
    return (await res.json()) as ProgressNote;
  })();
}

/**
 * Start (or join) a note generation. POSTs with the keep-alive stream so
 * the 1–2 minute run survives the site's proxy; the result is kept here so
 * a later call can collect it.
 */
export function startNoteRun(args: { region: string; name: string; category: Category; language: string; free: boolean }): NoteRun {
  const key = noteKey(args.region, args.name, args.category);
  const existing = runs.get(key);
  if (existing && !existing.settled) return existing;
  const run: NoteRun = { key, startedAt: Date.now(), done: Promise.resolve(), settled: false, note: null, error: null, delivered: false };
  run.done = (async () => {
    try {
      const res = await request("/api/profile-coach", {
        method: "POST",
        // A free rewrite says so: if newer games turned up since we looked,
        // the site refuses (WOULD_CHARGE) instead of charging unconfirmed.
        body: JSON.stringify({
          region: args.region,
          name: args.name,
          category: args.category,
          language: args.language,
          ...(args.free ? { maxCharge: 0 } : {}),
        }),
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson, application/json" },
      });
      if (!(res.headers.get("content-type") ?? "").includes("ndjson")) {
        if (!res.ok) throw await errorFrom(res);
        run.note = (await res.json()) as ProgressNote;
        return;
      }
      const final = await readFinal(res);
      const status = typeof final.httpStatus === "number" ? final.httpStatus : 200;
      if (status >= 400) {
        throw new ApiError(status, typeof final.code === "string" ? final.code : null, String(final.error ?? "The check-in note failed"), final);
      }
      run.note = final as unknown as ProgressNote;
    } catch (e) {
      run.error = e instanceof Error ? e : new Error(String(e));
    } finally {
      run.settled = true;
    }
  })();
  runs.set(key, run);
  return run;
}

async function readFinal(res: Response): Promise<Record<string, unknown>> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("The response had no body");
  const decoder = new TextDecoder();
  let buf = "";
  let final: Record<string, unknown> | null = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const frame = JSON.parse(line) as { t?: string; body?: Record<string, unknown> };
        if (frame.t === "final" && frame.body) final = frame.body;
      } catch {
        /* a partial or foreign line */
      }
    }
    if (done) break;
  }
  if (!final) throw new Error("The check-in note stream ended without a result");
  return final;
}

/** Wait up to `ms` for a run to settle, ticking `onTick` every 10 s. True if it settled. */
export async function waitForNote(run: NoteRun, ms: number, onTick: (elapsedS: number) => void, signal?: AbortSignal): Promise<boolean> {
  const deadline = Date.now() + ms;
  while (!run.settled) {
    const left = deadline - Date.now();
    if (left <= 0 || signal?.aborted) return run.settled;
    await Promise.race([run.done, new Promise((r) => setTimeout(r, Math.min(10_000, left)))]);
    if (!run.settled) onTick(Math.round((Date.now() - run.startedAt) / 1000));
  }
  return true;
}

/** The note as text, with a key for its [N] citations. */
export function formatNote(note: ProgressNote, base: string, locale = "en"): string {
  const header = `Check-in note, ${note.category} games${note.generatedAt ? ` (written ${note.generatedAt.slice(0, 10)})` : ""}:`;
  const refs = note.summaryReplays
    .map((g, i) => `[${i + 1}] ${g.map}${g.playedAt ? `, ${g.playedAt.slice(0, 10)}` : ""} — ${base}/${locale}/replay/${g.slug}?tab=coach`)
    .join("\n");
  return `${header}\n\n${note.summary ?? ""}\n\nGames cited (a citation like [2@5:15] is game 2 at 5:15):\n${refs}`;
}
