import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/** Per-request context for the hosted connector; see src/api.ts. */
export interface HostedContext {
  transport: (
    path: string,
    init: { method: string; body?: BodyInit; headers: Record<string, string>; signal?: AbortSignal },
  ) => Promise<Response>;
  keepAlive: (work: Promise<unknown>) => void;
  principal: string;
}

export declare function createServer(opts?: { hosted?: boolean }): McpServer;
export declare function runHosted<T>(ctx: HostedContext, fn: () => T): T;
