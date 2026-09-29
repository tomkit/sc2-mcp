---
name: sc2-coach
description: Use when the user asks a StarCraft II question, wants a replay analyzed or coached, or asks about one of their SC2 games — uploading a .SC2Replay, running the StarCraft2.ai AI Coach, or asking follow-up questions about a game.
---

# StarCraft II coaching with StarCraft2.ai

The `sc2` MCP server connects to the user's StarCraft2.ai account.

## Sign-in
Every tool except `login` needs the user signed in. If a tool says they aren't, call `login`. It returns a `verification_uri` and a `user_code`. Assume the user is not at this computer: send them the address and the code exactly as given, as two separate pieces ("Go to <verification_uri> and enter <user_code>"), never combined into one link, and never open the page or sign in for them. Pass `open_browser: true` only when they're sitting at this machine. Then call `login` again once they say they've approved.

## Minerals (paid credits) — always ask first
- AI Coach report on a replay: **1 mineral**. A replay that already has a report is free to read.
- Follow-up questions: **3 free per replay**, then **1 mineral per 20 more**.
- Check-in note across recent games (`coach_my_progress`): the saved one is free; a new one is **1 mineral**.
- Knowledge search, uploads and reading reports: free.

Spending is off for a new connection until the user allows it on the website, which needs them to sign in again themselves. If a paid tool says so, send them the link it returns; never open it, sign in, or click anything for them, and don't retry until they say it's done. Before calling `analyze_replay`, `unlock_more_questions` or `coach_my_progress` with `confirm_spend: true`, tell the user the price and their balance (`get_account`) and wait for a clear yes. Never set `confirm_spend` on your own. If the balance is too low, give them the billing link from the tool result.

## Typical flows
- **General question** ("what counters mass Void Rays?"): `search_sc2_knowledge`, then answer from the passages and cite their URLs. Don't invent unit numbers the passages don't give.
- **"Analyze my last game" / "that game on <map>"**: call `list_my_replays` first. It lists games the user played (via their claimed SC2 profile), coached, asked about or uploaded, newest first, with their result. If the game has a report, `get_analysis` re-reads it for free. If it's listed without a report, offer `analyze_replay` (1 mineral). Only when the game isn't listed, find the replay file. Default folders:
  - Windows: `Documents\StarCraft II\Accounts\<id>\<id>\Replays\Multiplayer`
  - macOS: `~/Library/Application Support/Blizzard/StarCraft II/Accounts/<id>/<id>/Replays/Multiplayer`
  Pick the newest `.SC2Replay`, `upload_replay` it, then `get_analysis`. If there's no report, offer `analyze_replay` (1 mineral).
- **Finding a particular game** ("my losses on Rainfall last month", "my PvZ games since June", "that game against Bob"): `search_replays`. It searches the user's own games by default; convert relative dates to `from`/`to` (YYYY-MM or YYYY-MM-DD) and "PvZ" to `race: Protoss, opponent_race: Zerg`. Set `player` to someone else's name to search their public games.
- **Games with certain players or a certain composition** ("games Tom, Sirry and Dan played where Tom went mass Liberators and Vikings", "my games with Bob where I made Carriers"): ONE `search_replays` call with `teammates` (exact in-game names) and `units` (+ `min_units` for "mass", roughly 8+ for air), from the point of view of the player whose units matter (omit `player` when that's the user). It returns how many of each unit they built and each game's link — share those links. Never open games one by one with `get_analysis` to find out what someone built. If a name matches nobody, the result lists who the player plays with most; nicknames often differ from in-game names, so ask the user which one they mean before searching again.
- **Follow-ups on an older game**: `search_replays` with `has_report: true` (or `list_my_replays` with `filter: "coached"`), then `ask_about_replay` with that replay id.
- **Long runs**: a coach run takes 3–7 minutes. If `analyze_replay` returns "still analyzing", call `get_analysis` with the same replay to wait for it. Don't start it again.
- **Follow-ups**: `ask_about_replay` with the user's question in their words. When questions run out, offer `unlock_more_questions`.
- **"Am I improving?" / "what do I keep doing wrong?" / "what should I work on?"**: `coach_my_progress`. It returns the saved check-in note for the user's linked profile — a coach's read across their last 5 coached games in ranked (or unranked) games: whether they fixed what the last note flagged, what's working, the one recurring leak and a target for the next games — free. If it says there are newer coached games, offer a new note (1 mineral; call again with `refresh: true` and `confirm_spend: true` after a yes). With fewer than 2 coached games it says so: offer `analyze_replay` on recent games first. A new note takes 1–2 minutes; if it returns "still writing", call it again the same way without `refresh`. Pass the note's citations through: `[2]` is game 2 in its list, `[2@5:15]` that game at 5:15 — the tool lists each game's link.
