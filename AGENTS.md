# Solo System RPG Agent Instructions

## Context Tools
Prefer lean-ctx MCP tools over native equivalents when they are available:

| Prefer | Over | Why |
| --- | --- | --- |
| `ctx_read(path)` | Read / cat / head / tail | Cached, compressed reads |
| `ctx_shell(command)` | Shell / terminal | Compressed command output |
| `ctx_search(pattern, path)` | Grep / rg / search | Compact search results |
| `ctx_tree(path, depth)` | ls / find / tree | Compact directory maps |
| `ctx_edit(path, old_string, new_string)` | Edit fallback | Search-and-replace without native Read |

If lean-ctx tools are unavailable, use the available local tools and keep reads focused.

## Project Memory
This workspace is the Obsidian vault for Solo System RPG. Treat the vault as the long-term project memory and source of truth. Treat `main.md` as raw historical source material only.

## Required Reading Route
At the beginning of significant project work, read in this order:

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

Significant work includes architecture, auth, trust boundaries, Telegram init data or Bot behavior, schema, onboarding, quest logic, XP/level/rank logic, new core user flows, repo policy, deployment, and runtime structure.

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

Select one primary execution role after the pass. Role perspectives can be simulated in one Codex session unless the user explicitly asks for sub-agents or parallel agent work.

## Role Enforcement
- Architect owns architecture, module boundaries, repo structure, and protocol work.
- Product/Analyst owns MVP fit, user-flow interpretation, scope, and acceptance intent.
- Frontend owns UI routes, components, client features, and UX docs.
- Backend owns API routes, server logic, and non-schema service integration.
- DB owns Supabase migrations, RLS, schema docs, and data ownership.
- Telegram owns Mini App bridge, Bot behavior, init data, notification, and Telegram docs.
- Design owns visual-system direction, mobile interaction constraints, and UX consistency.
- QA owns verification, test plans, bugs, and review checks.

QA review is required before completion for code, schema, auth, env, or user-facing behavior changes. DB, Telegram, Backend, or Architect review is required when their owned boundary is affected.

## Parallel Workstreams
Level 3 work must be split in `07_TASKS/Parallel_Workstreams.md` before implementation. Define objective, scope, owned files, forbidden files, dependencies, reviewer, merge order, and status for each stream.

No two streams may own the same file unless `07_TASKS/Parallel_Workstreams.md` records explicit approval. Parallel streams do not commit independently. One integration owner performs the final merge/review pass, runs verification, updates memory, and creates the final commit only if requested.

## Authority Rules
- `00_START_HERE/02_Non_Negotiables.md` overrides every other project doc.
- `07_TASKS/Decisions_Log.md` overrides older plans when it records a settled decision.
- `00_START_HERE/04_Current_State.md` is the authority for facts about what exists now.
- `00_START_HERE/05_Next_Steps.md` and `07_TASKS/Current_Sprint.md` define immediate work.
- Domain docs in `01_PRODUCT` through `06_BUILD` own their specialized details.
- `main.md` does not override curated vault docs.

## Session Memory Loop
After significant work:

- Update `10_LOGS/Session_Log.md`.
- Update `00_START_HERE/04_Current_State.md` when facts changed.
- Update `00_START_HERE/05_Next_Steps.md` when the plan changed.
- Update `07_TASKS/Decisions_Log.md` when a durable decision was made.
- Update `07_TASKS/Open_Questions.md` when ambiguity remains.
- Update affected module docs when product, architecture, data, UX, or implementation rules changed.
- Update `07_TASKS/Agent_Workstreams.md` with Completed, Blocked, or Review.
- Update `07_TASKS/Parallel_Workstreams.md` when Level 3 streams were used.

Architecture, schema, env, security, auth, repo-policy, deployment, or runtime-structure changes must be recorded in `07_TASKS/Decisions_Log.md`.

## Non-Negotiable Project Truths
- Product is Telegram Mini App first.
- Notifications go through Telegram Bot.
- Backend boundary is Supabase/Postgres unless a later decision changes it.
- UX is mobile-first and fast.
- XP, rank, and stats must be tied to real behavior or outcomes.
- The vault remains the source of truth for future agents.
