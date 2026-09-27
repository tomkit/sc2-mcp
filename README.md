# sc2-mcp — StarCraft II AI Coach for Claude and other MCP clients

An [MCP](https://modelcontextprotocol.io) server for [StarCraft2.ai](https://www.starcraft2.ai). From Claude Code, Claude Desktop, Cursor or any other MCP client you can:

- **Ask StarCraft II questions.** Answers come from the same knowledge base the AI Coach cites: Liquipedia unit data, current patch notes, strategy articles and pro-game insights.
- **Upload a replay** from a file on your computer or from a download link.
- **Get an AI Coach report** on a game: strengths, mistakes, key moments and what to work on.
- **Ask follow-up questions** about a game ("why did I lose that fight at 8:30?").

You need a StarCraft2.ai account. The tools use your account's **minerals**, at the same prices as the website:

| What | Cost |
|---|---|
| Knowledge search, uploads, reading an existing report | free |
| AI Coach report on a replay | 1 mineral (free if the replay already has one) |
| Follow-up questions on a replay | first 3 free, then 1 mineral per 20 |

A tool never spends minerals unless it's called with `confirm_spend: true`, and the tool descriptions tell the assistant to ask you first. If your client supports MCP elicitation, the server also asks you directly before spending, so nothing the assistant reads in a replay or a report can approve a purchase for you. Buy minerals at [starcraft2.ai/en/billing](https://www.starcraft2.ai/en/billing).

## Install

### Claude Code (plugin)

```
/plugin marketplace add tomkit/sc2-mcp
/plugin install sc2-coach@starcraft2-ai
```

The plugin adds the MCP server and a skill that tells Claude how to use it. Then ask something like *"analyze my latest SC2 replay"* and Claude will sign you in.

### Claude Code (server only)

```
git clone https://github.com/tomkit/sc2-mcp ~/sc2-mcp
claude mcp add sc2 -- node ~/sc2-mcp/dist/index.js
```

### Claude Desktop, Cursor and other clients

Clone the repo, then add this to the client's MCP config (for Claude Desktop, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "sc2": {
      "command": "node",
      "args": ["/absolute/path/to/sc2-mcp/dist/index.js"]
    }
  }
}
```

It needs Node.js 18.17 or newer on your `PATH`, including for the Claude Code plugin (Claude Code's native installer doesn't bring Node with it). `dist/index.js` is a self-contained bundle, so there is nothing to `npm install`.

## Signing in

Every tool except `login` needs you signed in. The `login` tool opens StarCraft2.ai in your browser. Sign in there if you aren't already, check the request, and click **Allow**. That's the OAuth 2.1 authorization-code flow with PKCE and a loopback redirect to `127.0.0.1` ([RFC 8252](https://www.rfc-editor.org/rfc/rfc8252)). The server never sees your password.

The resulting token is saved to `~/.config/sc2-mcp/credentials.json` (`%APPDATA%\sc2-mcp` on Windows) with owner-only permissions. It lasts 180 days. `logout` revokes it, and so does **Disconnect** on [starcraft2.ai/auth/mcp](https://www.starcraft2.ai/auth/mcp), which lists every connected device.

The browser has to run on the same machine as the server, because the sign-in comes back to `127.0.0.1`. For a remote box (SSH, a devcontainer, a cloud VM), sign in once on a machine with a browser, copy `access_token` out of its `credentials.json`, and set it as `SC2_API_TOKEN` in the remote server's environment. That variable takes precedence over the saved token, which follows the MCP spec's advice for stdio servers to take credentials from the environment. Treat the token like a password: it can spend your minerals.

## Tools

| Tool | What it does |
|---|---|
| `login` / `logout` | Browser sign-in; revoke and forget the token |
| `get_account` | Mineral balance, claimed SC2 profile, prices |
| `search_sc2_knowledge` | Passages from the SC2 knowledge base for general questions |
| `upload_replay` | Upload a `.SC2Replay` (or Brood War `.rep`) by `path` or `url` |
| `list_my_replays` | Your uploads, newest first |
| `get_analysis` | A replay's details and its AI Coach report, if one exists |
| `analyze_replay` | Run the AI Coach (1 mineral, needs `confirm_spend`) |
| `ask_about_replay` | Ask the coach a follow-up question about a coached replay |
| `unlock_more_questions` | 20 more follow-up questions on a replay (1 mineral, needs `confirm_spend`) |

A coach run takes 3–7 minutes. `analyze_replay` waits up to `wait_seconds` (default 50) and sends MCP progress notifications while it waits. If the run isn't done by then it returns and the run carries on; `get_analysis` picks up the report. Runs that fail on the site's side are refunded automatically.

## Configuration

| Variable | Default | |
|---|---|---|
| `SC2_API_TOKEN` | – | Use this token instead of the browser sign-in |
| `SC2_API_BASE` | `https://www.starcraft2.ai` | Site origin (for local development) |
| `SC2_MCP_CREDENTIALS` | `~/.config/sc2-mcp/credentials.json` | Where the token is saved |
| `SC2_MCP_NO_BROWSER` | – | `1` to print the sign-in URL instead of opening a browser |

## Development

```
npm install
npm run build   # typecheck + bundle to dist/index.js (commit the bundle)
npm test        # protocol and credit-gating tests against a mock site
npm run inspect # MCP Inspector
```

The end-to-end test (real browser sign-in, upload, a paid coach run and follow-ups against a local build of the site) lives in the site's repository.

## License

MIT
