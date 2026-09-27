import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { hostname } from "node:os";
import { apiBase, USER_AGENT } from "./config.js";
import { saveToken } from "./credentials.js";

/**
 * Browser sign-in: OAuth 2.1 authorization code + PKCE (S256) with a
 * loopback redirect, the native-app pattern of RFC 8252. The server binds
 * an ephemeral port on 127.0.0.1, opens StarCraft2.ai's consent page, and
 * exchanges the returned code (single use, 5 minutes) for a bearer token.
 *
 * One flow at a time. It outlives the tool call that started it, so a user
 * who takes a while in the browser just calls a tool again once done.
 */

const FLOW_TTL_MS = 10 * 60 * 1000;

export interface LoginFlow {
  url: string;
  done: Promise<void>;
  settled: boolean;
  error: string | null;
}

let active: LoginFlow | null = null;

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

export function openInBrowser(url: string): boolean {
  if (process.env.SC2_MCP_NO_BROWSER === "1") return false;
  const [cmd, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["rundll32", ["url.dll,FileProtocolHandler", url]]
        : ["xdg-open", [url]];
  try {
    const child = spawn(cmd, args as string[], { stdio: "ignore", detached: true });
    child.on("error", () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}

const PAGE = (title: string, body: string) =>
  `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
  `<body style="font-family:system-ui,sans-serif;background:#0b1020;color:#e6eefc;display:grid;place-items:center;min-height:90vh">` +
  `<div style="max-width:420px;text-align:center"><h1 style="font-size:20px">${title}</h1><p>${body}</p></div></body>`;

export function currentLogin(): LoginFlow | null {
  return active && !active.settled ? active : null;
}

export async function startLogin(): Promise<LoginFlow> {
  const pending = currentLogin();
  if (pending) return pending;

  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const base = apiBase();

  let server: Server;
  let resolveDone!: () => void;
  let rejectDone!: (e: Error) => void;
  const done = new Promise<void>((res, rej) => {
    resolveDone = res;
    rejectDone = rej;
  });
  // Nobody may be awaiting it yet; don't let a rejection go unhandled.
  done.catch(() => {});

  server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }
    const finish = (status: number, title: string, body: string) => {
      res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" }).end(PAGE(title, body));
    };
    if (url.searchParams.get("state") !== state) {
      finish(400, "Sign-in failed", "The response didn't match this sign-in attempt. Start again from your assistant.");
      return;
    }
    const err = url.searchParams.get("error");
    if (err) {
      finish(200, "Sign-in cancelled", "Nothing was connected. You can close this tab.");
      settle(new Error(err === "access_denied" ? "Sign-in was cancelled in the browser." : `Sign-in failed: ${err}`));
      return;
    }
    const code = url.searchParams.get("code");
    if (!code) {
      finish(400, "Sign-in failed", "No authorization code was returned.");
      return;
    }
    try {
      const tokenRes = await fetch(`${base}/api/mcp-auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: redirectUri }),
      });
      const body = (await tokenRes.json().catch(() => ({}))) as {
        access_token?: string;
        expires_in?: number;
        error_description?: string;
      };
      if (!tokenRes.ok || !body.access_token) {
        throw new Error(body.error_description ?? `token endpoint returned ${tokenRes.status}`);
      }
      await saveToken(body.access_token, body.expires_in ?? 180 * 86400);
      finish(200, "Signed in to StarCraft2.ai", "You can close this tab and go back to your assistant.");
      settle(null);
    } catch (e) {
      finish(500, "Sign-in failed", "The code couldn't be exchanged for a token. Start again from your assistant.");
      settle(e instanceof Error ? e : new Error(String(e)));
    }
  });

  await new Promise<void>((res, rej) => {
    server.once("error", rej);
    server.listen(0, "127.0.0.1", () => res());
  });
  const port = (server.address() as AddressInfo).port;
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  const timer = setTimeout(() => settle(new Error("Sign-in timed out after 10 minutes.")), FLOW_TTL_MS);
  timer.unref();

  const authorize = new URL(`${base}/auth/mcp`);
  authorize.search = new URLSearchParams({
    response_type: "code",
    client_name: `SC2 MCP on ${hostname().slice(0, 40)}`,
    redirect_uri: redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  }).toString();

  const flow: LoginFlow = { url: authorize.toString(), done, settled: false, error: null };
  active = flow;

  function settle(error: Error | null) {
    if (flow.settled) return;
    flow.settled = true;
    flow.error = error?.message ?? null;
    clearTimeout(timer);
    // Let the browser receive its page before the socket goes away.
    setTimeout(() => server.close(), 500).unref();
    if (error) rejectDone(error);
    else resolveDone();
  }

  openInBrowser(flow.url);
  return flow;
}
