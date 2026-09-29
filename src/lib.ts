/**
 * The tools as a library, for StarCraft2.ai's hosted connector
 * (https://www.starcraft2.ai/api/mcp): `createServer({ hosted: true })`
 * builds the same server the stdio entry runs, minus login/logout and
 * local-file uploads; `runHosted` supplies each request's context (the
 * in-process API transport, keep-alive for long runs, and the caller).
 */
export { createServer } from "./server.js";
export { runHosted, type HostedContext } from "./api.js";
