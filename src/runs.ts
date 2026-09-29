import { ApiError, errorFrom, hosted, request, type AiAnalysis } from "./api.js";

/**
 * AI Coach runs started by this process. A run takes 3–7 minutes, longer
 * than many MCP clients wait for one tool call, so `analyze_replay` starts
 * the request here and returns early if needed; the request keeps going in
 * this process and `get_analysis` picks up the result. The site persists
 * the report on the replay either way.
 */

export interface CoachRun {
  replayId: string;
  startedAt: number;
  /** Live reasoning volume from the heartbeat frames — a rough progress signal. */
  reasoningChars: number;
  phase: "thinking" | "writing";
  done: Promise<void>;
  settled: boolean;
  analysis: AiAnalysis | null;
  error: ApiError | Error | null;
}

const runs = new Map<string, CoachRun>();

/** Median chain-of-thought volume of a full run (the site's progress bar uses the same figure). */
export const TYPICAL_REASONING_CHARS = 85_000;

/** Hosted mode shares one process between users: key runs by caller too. */
function key(replayId: string): string {
  return `${hosted()?.principal ?? ""}:${replayId}`;
}

export function getRun(replayId: string): CoachRun | undefined {
  return runs.get(key(replayId));
}

export function progressFraction(run: CoachRun): number {
  if (run.settled) return 1;
  if (run.phase === "writing") return 0.93;
  return Math.min(0.88, (run.reasoningChars / TYPICAL_REASONING_CHARS) * 0.88);
}

export function startRun(replayId: string, body: Record<string, unknown>): CoachRun {
  const existing = runs.get(key(replayId));
  if (existing && !existing.settled) return existing;

  const run: CoachRun = {
    replayId,
    startedAt: Date.now(),
    reasoningChars: 0,
    phase: "thinking",
    done: Promise.resolve(),
    settled: false,
    analysis: null,
    error: null,
  };
  run.done = (async () => {
    try {
      const res = await request("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ ...body, replayId }),
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson, application/json" },
      });
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("ndjson")) {
        // Answered inside the grace period: a plain JSON response with a real status.
        if (!res.ok) throw await errorFrom(res);
        run.analysis = (await res.json()) as AiAnalysis;
        return;
      }
      const final = await readFinalFrame(res, run);
      const status = typeof final.httpStatus === "number" ? final.httpStatus : 200;
      if (status >= 400) {
        throw new ApiError(status, typeof final.code === "string" ? final.code : null, String(final.error ?? "AI Coach run failed"), final);
      }
      run.analysis = final as unknown as AiAnalysis;
    } catch (e) {
      run.error = e instanceof Error ? e : new Error(String(e));
    } finally {
      run.settled = true;
    }
  })();
  runs.set(key(replayId), run);
  // Hosted: the site keeps the function alive until the run is charged and saved.
  hosted()?.keepAlive(run.done);
  return run;
}

/** Read the site's NDJSON keep-alive stream to its `final` frame. */
async function readFinalFrame(res: Response, run: CoachRun): Promise<Record<string, unknown>> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("AI Coach response had no body");
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
      let frame: { t?: string; reasoningChars?: number; phase?: "thinking" | "writing"; body?: Record<string, unknown> };
      try {
        frame = JSON.parse(line);
      } catch {
        continue;
      }
      if (frame.t === "final" && frame.body) final = frame.body;
      else if (frame.t === "hb") {
        if (typeof frame.reasoningChars === "number") run.reasoningChars = Math.max(run.reasoningChars, frame.reasoningChars);
        if (frame.phase) run.phase = frame.phase;
      }
    }
    if (done) break;
  }
  if (!final) throw new Error("The AI Coach stream ended before the report arrived. Check get_analysis in a minute — the run may still have finished on the server.");
  return final;
}

/**
 * Wait for a run for up to `ms`, calling `onTick` every few seconds so the
 * caller can send MCP progress notifications. Resolves true when settled.
 */
export async function waitForRun(run: CoachRun, ms: number, onTick?: (run: CoachRun) => void, signal?: AbortSignal): Promise<boolean> {
  const deadline = Date.now() + ms;
  while (!run.settled && Date.now() < deadline && !signal?.aborted) {
    onTick?.(run);
    await Promise.race([run.done, new Promise((r) => setTimeout(r, Math.min(5_000, Math.max(0, deadline - Date.now()))))]);
  }
  return run.settled;
}
