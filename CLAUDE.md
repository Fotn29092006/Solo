# Solo System RPG Claude Instructions

## Context Tools
Prefer lean-ctx MCP tools when available:

| Prefer | Over | Why |
| --- | --- | --- |
| `ctx_read(path)` | Read / cat / head / tail | Cached, compressed reads |
| `ctx_shell(command)` | Shell / terminal | Compressed command output |
| `ctx_search(pattern, path)` | Grep / rg / search | Compact search results |
| `ctx_tree(path, depth)` | ls / find / tree | Compact directory maps |
| `ctx_edit(path, old_string, new_string)` | Edit fallback | Search-and-replace without native Read |

If lean-ctx tools are unavailable, use available local tools and keep output compact.

## Project Memory
This workspace is the Obsidian vault for Solo System RPG. Treat the vault as the long-term project memory and source of truth. Treat `main.md` as raw historical source material only.

## Required Reading Route
Before significant project work, read:

1. `00_START_HERE/00_Project_Index.md`
2. `00_START_HERE/01_Product_Blueprint.md`
3. `00_START_HERE/02_Non_Negotiables.md`
4. `00_START_HERE/03_Roadmap.md`
5. `00_START_HERE/04_Current_State.md`
6. `00_START_HERE/05_Next_Steps.md`
7. `00_START_HERE/06_Graph_Memory_Protocol.md`
8. `00_START_HERE/07_File_Roles_and_Status.md`
9. Relevant module docs linked from the index, task, or changed files.

Use `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, and `07_TASKS/Current_Sprint.md` when planning, resolving ambiguity, or changing direction.

## Session Memory Loop
After significant work, update:

- `10_LOGS/Session_Log.md`
- `00_START_HERE/04_Current_State.md` when facts changed
- `00_START_HERE/05_Next_Steps.md` when the plan changed
- `07_TASKS/Decisions_Log.md` when a durable decision was made
- `07_TASKS/Open_Questions.md` when ambiguity remains
- Relevant module docs when product, architecture, data, UX, or implementation rules changed

## Project Truths
- Solo System RPG is Telegram Mini App first.
- Notifications go through Telegram Bot.
- Supabase/Postgres is the current backend direction.
- The system is not a generic fitness tracker.
- XP, rank, and stats must be earned through real behavior or outcomes.
