import type { AiAnalysis, ReplaySummary } from "./api.js";

// The coach cites with `{Label|target}` markup (target = p:Player, a
// timestamp, a battle id…). The website renders these as links; here the
// label alone reads naturally. Mirrors stripCoachMarkup on the site.
const CITATION_RE = /\{(?:([^|{}]+)\|)?([^{}]+)\}/g;

export function stripMarkup(text: string): string {
  return (text ?? "").replace(CITATION_RE, (_m, label: string | undefined, target: string) => {
    if (label) return label;
    const player = /^p:(.+)$/.exec(target);
    return player ? player[1] : target;
  });
}

export function formatReplayHeader(r: ReplaySummary): string {
  const players = r.players.map((p) => (p.race ? `${p.name} (${p.race})` : p.name)).join(" vs ");
  const lines = [
    `Replay ${r.id}`,
    r.title ? `Title: ${r.title}` : null,
    `Map: ${r.map ?? "unknown"} · ${r.gameType ?? ""}${r.category ? ` · ${r.category}` : ""}${r.duration ? ` · ${r.duration}` : ""}`,
    `Players: ${players || "unknown"}`,
    r.teamResults?.length ? `Team results (in team order): ${r.teamResults.join(", ")}` : null,
    r.playedAt ? `Played: ${r.playedAt}` : null,
    `Web page: ${r.url}`,
    `AI Coach report: ${r.hasAnalysis ? `yes (coach version ${r.analysisVersion ?? "?"}, current ${r.currentCoachVersion})` : "not yet run"}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function formatAnalysis(a: AiAnalysis): string {
  const out: string[] = [];
  out.push("## AI Coach report");
  if (a.version) out.push(`Coach version ${a.version}${a.language ? ` · language ${a.language}` : ""}`);
  out.push("", "### Overview", stripMarkup(a.overallAssessment));
  for (const team of a.teamAnalyses ?? []) {
    const who = team.playerNames.map((n, i) => (team.races[i] ? `${n} (${team.races[i]})` : n)).join(", ");
    out.push("", `### Team ${team.teamNumber}: ${who}`);
    if (team.strategySummary) out.push("", "**Strategy:** " + stripMarkup(team.strategySummary));
    if (team.keyStrengths?.length) {
      out.push("", "**Strengths**");
      for (const s of team.keyStrengths) out.push(`- ${stripMarkup(s)}`);
    }
    if (team.keyMistakes?.length) {
      out.push("", "**Mistakes**");
      for (const s of team.keyMistakes) out.push(`- ${stripMarkup(s)}`);
    }
    if (team.momentAnalyses?.length) {
      out.push("", "**Key moments**");
      for (const m of team.momentAnalyses) {
        out.push(`- ${m.gameTimeFormatted}${m.category ? ` [${m.category}]` : ""}: ${stripMarkup(m.situation)} → ${stripMarkup(m.advice)}`);
      }
    }
    if (team.improvementPriorities?.length) {
      out.push("", "**What to work on**");
      for (const p of [...team.improvementPriorities].sort((x, y) => x.priority - y.priority)) {
        out.push(`${p.priority}. ${stripMarkup(p.title)}: ${stripMarkup(p.description)}`);
      }
    }
  }
  return out.join("\n");
}
