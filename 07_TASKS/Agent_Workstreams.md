# Agent Workstreams

## Purpose
Enforce role assignment, scope, file ownership, review, and status for Codex workstreams.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-16

## Related Files
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[Parallel_Workstreams]]
- [[Current_Sprint]]
- [[Decisions_Log]]
- [[Open_Questions]]
- [[../08_PROMPTS/Session_Brief_Template]]
- [[../08_PROMPTS/Orchestrator_Agent_Prompt]]

## Content
Rule:

- No significant project work starts without an active workstream row.
- Every workstream must have one primary role and at least one reviewer role.
- Significant Level 2 and Level 3 work must start with a lightweight mini-team pass before the primary role executes.
- Role perspectives may be simulated inside one Codex session unless the user explicitly asks for sub-agents or parallel agent work.
- Owned files are the allowed write scope. Anything outside that scope requires updating the workstream row first.
- A workstream is not complete until the post-task memory checklist is done.

Allowed roles:

- Architect
- Product/Analyst
- Frontend
- Backend
- DB
- QA
- Telegram
- Design

Role permissions:

| Role | Allowed Primary Scope | Must Not Own Alone | Required Reviewer |
| --- | --- | --- | --- |
| Architect | `00_START_HERE`, `05_TECH/Architecture.md`, `06_BUILD`, module boundaries, repo structure decisions | schema details, secret handling, production auth/security | QA, DB for schema-impacting architecture, Telegram for Telegram-impacting architecture |
| Product/Analyst | MVP fit, user-flow interpretation, scope boundaries, acceptance intent, product docs | implementation details, schema details, auth/security mechanics | Architect or owning implementation role |
| Frontend | `src/app`, `src/components`, UI portions of `src/features`, `02_UX_UI` | auth trust, DB schema, secrets, notification dispatch | QA; Telegram if Mini App bridge changes |
| Backend | API routes, server-side app code, backend logic, non-schema Supabase client/server adapters | migrations, RLS policy design, client UI | QA; DB for data persistence changes; Telegram for bot/init-data changes |
| DB | `supabase`, `04_DATA`, schema, migrations, RLS, indexes, data ownership | UI, BotFather configuration, notification copy | QA; Backend for API/data contract impact |
| Telegram | `src/features/telegram`, `src/lib/telegram`, `05_TECH/Telegram_Integration.md`, Telegram auth/bot behavior | DB schema, broad UI shell, unrelated backend logic | QA; Backend for server validation/dispatch |
| Design | `02_UX_UI`, visual direction, interaction constraints, mobile-first flow review | product logic, schema, auth/security, backend behavior | Frontend or Product/Analyst; QA for user-facing acceptance |
| QA | `07_TASKS/Bugs.md`, test plans, verification notes, acceptance checks | product/architecture decisions without owner role | Architect or owning implementation role |

Active workstreams:

| Role | Scope | Owned Files | Reviewer | Status |
| --- | --- | --- | --- | --- |
| Architect | Strict graph-memory enforcement system | `00_START_HERE/06_Graph_Memory_Protocol.md`, `00_START_HERE/07_File_Roles_and_Status.md`, `AGENTS.md`, `CLAUDE.md`, `08_PROMPTS/Session_Brief_Template.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md` | QA | Completed 2026-04-15 |
| Architect | Mini-team and parallel workstream workflow upgrade | `00_START_HERE/00_Project_Index.md`, `00_START_HERE/06_Graph_Memory_Protocol.md`, `00_START_HERE/07_File_Roles_and_Status.md`, `AGENTS.md`, `CLAUDE.md`, `08_PROMPTS/Codex_Master_Instruction.md`, `08_PROMPTS/Session_Brief_Template.md`, `08_PROMPTS/Orchestrator_Agent_Prompt.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `10_LOGS/Session_Log.md` | QA | Completed 2026-04-15 |
| Architect | Supabase and Telegram trust-boundary foundation pass | `src/lib/telegram/server.ts`, `src/app/api/auth/telegram/route.ts`, `src/shared/types/telegram.ts`, `src/shared/types/database.ts`, `src/config/env.ts`, `supabase/migrations/0001_mvp_spine.sql`, `supabase/README.md`, `04_DATA/Data_Model_Overview.md`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `05_TECH/Env_Variables.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md` | QA, DB, Telegram | Completed 2026-04-15 |
| QA | Telegram init-data validation test coverage | `package.json`, `package-lock.json`, `vitest.config.ts`, `src/lib/telegram/server.ts`, `src/lib/telegram/validate-init-data.ts`, `src/lib/telegram/validate-init-data.test.ts`, `05_TECH/Architecture.md`, `07_TASKS/Decisions_Log.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `10_LOGS/Session_Log.md` | Telegram, Backend | Completed 2026-04-15 |
| DB | Supabase MVP migration apply path verification | `supabase/migrations/0001_mvp_spine.sql`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `05_TECH/Env_Variables.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend | Blocked 2026-04-15: CLI auth/link or Dashboard SQL apply required |
| DB | Supabase MVP spine live verification script | `scripts/verify-supabase-mvp-spine.mjs`, `package.json`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `05_TECH/Env_Variables.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend | Completed 2026-04-16 |
| Architect | Level 3 Telegram identity and onboarding connection orchestration | `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md` | QA, DB, Backend, Telegram | Blocked 2026-04-16: DB gate failed; all eight MVP tables still return 404 |

Workstream template:

| Role | Scope | Owned Files | Reviewer | Status |
| --- | --- | --- | --- | --- |
| TBD | One sentence task boundary | Exact files or folders | Required reviewer role | Planned / Active / Blocked / Review / Completed |

Pre-task checklist:

- Reading order confirmed:
  - `AGENTS.md`
  - `CLAUDE.md` when relevant
  - `00_START_HERE/00_Project_Index.md`
  - `00_START_HERE/01_Product_Blueprint.md`
  - `00_START_HERE/02_Non_Negotiables.md`
  - `00_START_HERE/03_Roadmap.md`
  - `00_START_HERE/04_Current_State.md`
  - `00_START_HERE/05_Next_Steps.md`
  - `00_START_HERE/06_Graph_Memory_Protocol.md`
  - `00_START_HERE/07_File_Roles_and_Status.md`
  - relevant module docs
- Active task confirmed from `05_Next_Steps.md`, `Current_Sprint.md`, user request, or explicit user override.
- Task level classified as Level 0, Level 1, Level 2, or Level 3.
- Mini-team pass completed for Level 2 and Level 3 work.
- `07_TASKS/Parallel_Workstreams.md` prepared for Level 3 work.
- Primary role selected from allowed roles.
- Reviewer role or roles selected.
- Scope boundaries stated.
- Files allowed to change listed.
- Files that must not change listed.
- Required post-task docs identified before editing.

Post-task checklist:

- Verification commands run or reason recorded.
- `10_LOGS/Session_Log.md` updated.
- `00_START_HERE/04_Current_State.md` updated when facts changed.
- `00_START_HERE/05_Next_Steps.md` updated when next work changed.
- `07_TASKS/Decisions_Log.md` updated when architecture, schema, env, security, or repo policy changed.
- `07_TASKS/Open_Questions.md` updated when ambiguity remains.
- Affected module docs updated.
- `07_TASKS/Parallel_Workstreams.md` updated when Level 3 workstreams were used.
- Workstream row status changed to Completed, Blocked, or Review.
