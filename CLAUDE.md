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
9. `07_TASKS/Agent_Workstreams.md`
10. `07_TASKS/Parallel_Workstreams.md` for Level 3 work.
11. Relevant module docs linked from the index, task, or changed files.

Use `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, and `07_TASKS/Current_Sprint.md` when planning, resolving ambiguity, or changing direction.

## Pre-Task Gate
Before code, schema, env, vault, security, architecture, or repo-policy work, state:

1. Reading order completed.
2. Active task source.
3. Task level: Level 0, Level 1, Level 2, or Level 3.
4. Mini-team pass for Level 2 and Level 3 work.
5. Primary role: Architect, Product/Analyst, Frontend, Backend, DB, QA, Telegram, or Design.
6. Reviewer role or roles.
7. Scope boundaries.
8. Files allowed to change.
9. Files that must not change.
10. Required post-task memory updates.

Record or update the workstream in `07_TASKS/Agent_Workstreams.md`. Do not edit outside the owned files unless the workstream is updated first.

## Task Levels
- Level 0: tiny local or non-project action. No full gate; log only if useful.
- Level 1: non-significant project change. Abbreviated gate, one role, optional reviewer, update touched docs if needed.
- Level 2: significant single-stream work. Full gate, mini-team pass, one primary role, required reviewer, post-task memory loop.
- Level 3: large or cross-domain work. Full gate, mini-team pass, `07_TASKS/Parallel_Workstreams.md`, merge-control pass, integration review, post-task memory loop.

## Mini-Team Mode
For Level 2 and Level 3 work, run a lightweight mini-team pass before execution. Each relevant role gives 1-3 bullets maximum:

- Architect: architecture, boundaries, repo/workflow impact.
- Product/Analyst: MVP fit, scope, acceptance intent.
- Frontend: client/UI surface and ownership risks.
- Backend: server/API/auth boundary implications.
- DB: schema, RLS, migration, and data ownership implications.
- QA: acceptance checks, regression risks, verification plan.
- Telegram: Mini App, Bot, init-data, notification implications.
- Design: UX consistency, mobile-first constraints, visual-system risks.

Select one primary execution role after the pass. Role perspectives can be simulated in one session unless the user explicitly asks for sub-agents or parallel agent work.

## Parallel Workstreams
Level 3 work must be split in `07_TASKS/Parallel_Workstreams.md` before implementation. No overlapping ownership is allowed without explicit approval. Parallel streams do not commit independently; one integration owner performs final merge review, verification, memory updates, and commit readiness.

## Session Memory Loop
After significant work, update:

- `10_LOGS/Session_Log.md`
- `00_START_HERE/04_Current_State.md` when facts changed
- `00_START_HERE/05_Next_Steps.md` when the plan changed
- `07_TASKS/Decisions_Log.md` when a durable decision was made
- `07_TASKS/Open_Questions.md` when ambiguity remains
- Relevant module docs when product, architecture, data, UX, or implementation rules changed
- `07_TASKS/Agent_Workstreams.md` with Completed, Blocked, or Review
- `07_TASKS/Parallel_Workstreams.md` when Level 3 streams were used

Architecture, schema, env, security, auth, repo-policy, deployment, or runtime-structure changes must be recorded in `07_TASKS/Decisions_Log.md`.

## Project Truths
- Solo System RPG is Telegram Mini App first.
- Notifications go through Telegram Bot.
- Supabase/Postgres is the current backend direction.
- The system is not a generic fitness tracker.
- XP, rank, and stats must be earned through real behavior or outcomes.
