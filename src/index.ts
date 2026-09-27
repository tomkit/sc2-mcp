import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

// stdout carries the protocol; anything human-readable goes to stderr.
async function main() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  const shutdown = () => {
    void server.close().finally(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[sc2-mcp] fatal:", err);
  process.exit(1);
});
