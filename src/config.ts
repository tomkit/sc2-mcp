import { homedir } from "node:os";
import { join } from "node:path";

export const SERVER_NAME = "sc2-mcp";
export const SERVER_VERSION = "0.8.0";

/** The StarCraft2.ai origin every request goes to. Override for local testing. */
export function apiBase(): string {
  const raw = process.env.SC2_API_BASE?.trim() || "https://www.starcraft2.ai";
  return raw.replace(/\/+$/, "");
}

export const USER_AGENT = `${SERVER_NAME}/${SERVER_VERSION} (+https://github.com/tomkit/sc2-mcp)`;

/** Where the sign-in token is kept between sessions (mode 0600). */
export function credentialsPath(): string {
  if (process.env.SC2_MCP_CREDENTIALS) return process.env.SC2_MCP_CREDENTIALS;
  const base =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === "win32" ? process.env.APPDATA || join(homedir(), "AppData", "Roaming") : join(homedir(), ".config"));
  return join(base, "sc2-mcp", "credentials.json");
}

/** Mirrors the site's upload guard (src/lib/replay/upload-guard.ts). */
export const MAX_REPLAY_BYTES = 8 * 1024 * 1024;

export const COACH_LANGUAGES = ["en", "ko", "zh", "fr", "es"] as const;
