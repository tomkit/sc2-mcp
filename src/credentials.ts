import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { apiBase, credentialsPath } from "./config.js";

/**
 * The bearer token, per site origin. SC2_API_TOKEN in the environment wins
 * (MCP's guidance for stdio servers is to take credentials from the
 * environment); otherwise the token saved by the browser sign-in is used.
 */

interface StoredToken {
  access_token: string;
  expires_at: string;
  obtained_at: string;
}

type Store = Record<string, StoredToken>;

async function readStore(): Promise<Store> {
  try {
    const parsed = JSON.parse(await readFile(credentialsPath(), "utf8")) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  const path = credentialsPath();
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  if (Object.keys(store).length === 0) {
    await rm(path, { force: true });
    return;
  }
  await writeFile(path, JSON.stringify(store, null, 2) + "\n", { mode: 0o600 });
  await chmod(path, 0o600).catch(() => {});
}

export type TokenSource = "env" | "stored";

export async function currentToken(): Promise<{ token: string; source: TokenSource } | null> {
  const env = process.env.SC2_API_TOKEN?.trim();
  if (env) return { token: env, source: "env" };
  const stored = (await readStore())[apiBase()];
  if (!stored?.access_token) return null;
  if (new Date(stored.expires_at).getTime() <= Date.now()) return null;
  return { token: stored.access_token, source: "stored" };
}

export async function saveToken(accessToken: string, expiresInSeconds: number): Promise<void> {
  const store = await readStore();
  store[apiBase()] = {
    access_token: accessToken,
    expires_at: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    obtained_at: new Date().toISOString(),
  };
  await writeStore(store);
}

export async function forgetToken(): Promise<void> {
  const store = await readStore();
  delete store[apiBase()];
  await writeStore(store);
}
