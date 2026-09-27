---
name: sc2-coach
description: Use when the user asks a StarCraft II question, wants a replay analyzed or coached, or asks about one of their SC2 games — uploading a .SC2Replay, running the StarCraft2.ai AI Coach, or asking follow-up questions about a game.
---

# StarCraft II coaching with StarCraft2.ai

The `sc2` MCP server connects to the user's StarCraft2.ai account.

## Sign-in
Every tool except `login` needs the user signed in. If a tool says they aren't, call `login`. It opens the browser on this computer and also returns a `verification_uri` and a `user_code` for signing in from another device. If the user isn't at this computer (they're on their phone, or you reach them through chat), send them the address and the code exactly as given, as two separate pieces: "Go to <verification_uri> and enter <user_code>." Never combine them into one link. Then call `login` again once they say they've approved.

## Minerals (paid credits) — always ask first
- AI Coach report on a replay: **1 mineral**. A replay that already has a report is free to read.
- Follow-up questions: **3 free per replay**, then **1 mineral per 20 more**.
- Knowledge search, uploads and reading reports: free.

Before calling `analyze_replay` or `unlock_more_questions` with `confirm_spend: true`, tell the user the price and their balance (`get_account`) and wait for a clear yes. Never set `confirm_spend` on your own. If the balance is too low, give them the billing link from the tool result.

## Typical flows
- **General question** ("what counters mass Void Rays?"): `search_sc2_knowledge`, then answer from the passages and cite their URLs. Don't invent unit numbers the passages don't give.
- **"Analyze my last game" / "that game on <map>"**: call `list_my_replays` first. It lists games the user played (via their claimed SC2 profile), coached, asked about or uploaded, newest first, with their result. If the game has a report, `get_analysis` re-reads it for free. If it's listed without a report, offer `analyze_replay` (1 mineral). Only when the game isn't listed, find the replay file. Default folders:
  - Windows: `Documents\StarCraft II\Accounts\<id>\<id>\Replays\Multiplayer`
  - macOS: `~/Library/Application Support/Blizzard/StarCraft II/Accounts/<id>/<id>/Replays/Multiplayer`
  Pick the newest `.SC2Replay`, `upload_replay` it, then `get_analysis`. If there's no report, offer `analyze_replay` (1 mineral).
- **Finding a particular game** ("my losses on Rainfall last month", "my PvZ games since June", "that game against Bob"): `search_replays`. It searches the user's own games by default; convert relative dates to `from`/`to` (YYYY-MM or YYYY-MM-DD) and "PvZ" to `race: Protoss, opponent_race: Zerg`. Set `player` to someone else's name to search their public games.
- **Follow-ups on an older game**: `search_replays` with `has_report: true` (or `list_my_replays` with `filter: "coached"`), then `ask_about_replay` with that replay id.
- **Long runs**: a coach run takes 3–7 minutes. If `analyze_replay` returns "still analyzing", call `get_analysis` with the same replay to wait for it. Don't start it again.
- **Follow-ups**: `ask_about_replay` with the user's question in their words. When questions run out, offer `unlock_more_questions`.
