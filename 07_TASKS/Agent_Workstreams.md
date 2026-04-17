# Agent Workstreams

## Purpose
Enforce role assignment, scope, file ownership, review, and status for Codex workstreams.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

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
| DB | Supabase MVP migration apply path verification | `supabase/migrations/0001_mvp_spine.sql`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `05_TECH/Env_Variables.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend | Completed 2026-04-16: live MVP spine verifier passed; CLI auth/link remains unavailable for future migrations |
| DB | Supabase MVP spine live verification script | `scripts/verify-supabase-mvp-spine.mjs`, `package.json`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `05_TECH/Env_Variables.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend | Completed 2026-04-16 |
| Architect | Level 3 Telegram identity and onboarding connection orchestration | `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md`, `src/app/api/auth/telegram/route.ts`, `src/app/api/onboarding/route.ts`, `src/lib/supabase/server.ts`, `src/lib/telegram/profile-identity.ts`, `src/lib/telegram/profile-identity-core.ts`, `src/features/onboarding/components/OnboardingFlow.tsx`, `src/features/telegram/hooks/useTelegramWebApp.ts`, `src/shared/types/*`, `src/config/app.ts` | QA, DB, Backend, Telegram | Completed 2026-04-16 |
| Architect | Level 3 DB gate recovery and six-agent readiness orchestration | `scripts/verify-supabase-mvp-spine.mjs`, `supabase/README.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Bugs.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | DB, Backend, Telegram, QA | Completed 2026-04-16: verifier hardened; implementation still blocked by DB gate |
| Architect | Level 3 profile-aware Home and daily quest seed | `src/app/api/home/route.ts`, `src/lib/quests/daily-quest-seed.ts`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md`, affected tech/system docs | QA, DB, Backend, Telegram, Design | Completed 2026-04-16 |
| Architect | Level 3 quest completion and XP event path | `src/app/api/quests/complete/route.ts`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, `03_SYSTEMS/Quest_System.md`, `03_SYSTEMS/XP_System.md`, `05_TECH/Security.md`, `05_TECH/Telegram_Integration.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md` | QA, DB, Backend, Telegram, Design | Completed 2026-04-16 |
| Backend | Daily quest streak update and live Home streak display | `src/app/api/quests/complete/route.ts`, `src/app/api/home/route.ts`, `src/lib/streaks/*`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, `03_SYSTEMS/Streak_System.md`, `03_SYSTEMS/Quest_System.md`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md` | QA, DB, Telegram, Frontend | Completed 2026-04-16 |
| QA | Route-level QA coverage for onboarding, Home, quest completion, and streak contracts | `src/app/api/**/*.test.ts`, `src/test/*`, `vitest.config.ts`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `10_LOGS/Session_Log.md` | Backend, DB, Telegram | Completed 2026-04-16 |
| Architect | Level 3 weekly check-in read/write path and Home entry | `src/app/api/weekly-checkin/route.ts`, `src/app/api/weekly-checkin/route.test.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/features/weekly-checkin/components/WeeklyCheckInCard.tsx`, `src/lib/weekly-checkins/*`, `src/shared/types/game.ts`, `03_SYSTEMS/Weekly_Review_System.md`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `10_LOGS/Session_Log.md` | QA, DB, Backend, Telegram, Design | Completed 2026-04-16 |
| DB | Water logging migration and contract preparation | `supabase/migrations/0002_water_logging.sql`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `04_DATA/Data_Model_Overview.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend, Telegram | Completed 2026-04-16: migration and contract prepared; live apply remains blocked on Dashboard SQL or Supabase CLI auth/link |
| Architect | Level 3 water logging route and Home quick-log | `src/app/api/water-logs/route.ts`, `src/app/api/water-logs/route.test.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/features/water/components/WaterQuickLogCard.tsx`, `src/shared/types/game.ts`, `src/shared/types/database.ts`, `scripts/verify-supabase-water-logging.mjs`, `package.json`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `05_TECH/Supabase_Setup.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, DB, Backend, Telegram, Design | Completed 2026-04-17 |
| DB | Workout logging migration and verifier preparation | `supabase/migrations/0003_workout_logging.sql`, `scripts/verify-supabase-workout-logging.mjs`, `package.json`, `supabase/README.md`, `04_DATA/Database_Schema.md`, `04_DATA/Data_Model_Overview.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend, Telegram | Completed 2026-04-17: migration/verifier prepared and live `workout_logs` verification passes |
| Architect | Level 3 workout logging route and Home quick-log | `src/app/api/workout-logs/route.ts`, `src/app/api/workout-logs/route.test.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/features/workout/components/WorkoutQuickLogCard.tsx`, `src/shared/types/game.ts`, `src/shared/types/database.ts`, `04_DATA/Data_Model_Overview.md`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `05_TECH/Supabase_Setup.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, DB, Backend, Telegram, Product/Analyst, Design | Completed 2026-04-17: implemented workout route, Home quick-log, tests, and memory updates; verification passed |
| Architect | Level 3 water/workout quest-to-log matching rules | `src/lib/quests/log-quest-sync.ts`, `src/app/api/water-logs/route.ts`, `src/app/api/water-logs/route.test.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/workout-logs/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, `03_SYSTEMS/Quest_System.md`, `03_SYSTEMS/XP_System.md`, `05_TECH/Security.md`, `05_TECH/Telegram_Integration.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend, DB, Telegram, Product/Analyst, Design | Completed 2026-04-17: hydration quest sync implemented; workout remains manual; verification passed |
| DB | Sleep/recovery logging migration and verifier preparation | `supabase/migrations/0004_sleep_logging.sql`, `scripts/verify-supabase-sleep-logging.mjs`, `package.json`, `src/shared/types/database.ts`, `04_DATA/Data_Model_Overview.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `03_SYSTEMS/XP_System.md`, `03_SYSTEMS/Quest_System.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, Backend, Telegram, Product/Analyst, Design | Completed 2026-04-17: migration/verifier prepared; live `sleep_logs` verifier returns 404 until SQL apply |
| Architect | Level 3 sleep logging route and Home quick-log | `src/app/api/sleep-logs/route.ts`, `src/app/api/sleep-logs/route.test.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/features/sleep/components/SleepQuickLogCard.tsx`, `src/shared/types/game.ts`, `04_DATA/Data_Model_Overview.md`, `04_DATA/Database_Schema.md`, `05_TECH/Architecture.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Security.md`, `05_TECH/Supabase_Setup.md`, `03_SYSTEMS/XP_System.md`, `03_SYSTEMS/Quest_System.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, DB, Backend, Telegram, Product/Analyst, Design | Completed 2026-04-17: implemented sleep route, Home quick-log, tests, and memory updates; verification passed |
| DB | Meal/nutrition logging migration and verifier preparation | `supabase/migrations/0005_meal_logging.sql`, `scripts/verify-supabase-meal-logging.mjs`, `package.json`, `src/shared/types/database.ts`, `04_DATA/Data_Model_Overview.md`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `05_TECH/Security.md`, `03_SYSTEMS/XP_System.md`, `03_SYSTEMS/Quest_System.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, Backend, Telegram, Product/Analyst, Design | Completed 2026-04-17: migration/verifier prepared; live `meal_logs` verifier returns 404 until SQL apply |
| Backend | Level 3 strict payload allowlists for existing log routes | `src/app/api/water-logs/route.ts`, `src/app/api/water-logs/route.test.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/workout-logs/route.test.ts`, `src/app/api/sleep-logs/route.ts`, `src/app/api/sleep-logs/route.test.ts`, `05_TECH/Security.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Architecture.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `07_TASKS/Bugs.md`, `10_LOGS/Session_Log.md` | QA, Telegram, Security | Completed 2026-04-17: water/workout/sleep reject unknown fields before auth or persistence; tests passed |
| Architect | Level 3 meal logging route and Home nutrition quick-log | `src/app/api/meal-logs/route.ts`, `src/app/api/meal-logs/route.test.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/features/meal/components/MealQuickLogCard.tsx`, `src/shared/types/game.ts`, `05_TECH/Security.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Architecture.md`, `04_DATA/Database_Schema.md`, `04_DATA/Data_Model_Overview.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `07_TASKS/Bugs.md`, `10_LOGS/Session_Log.md`, `supabase/README.md` | QA, DB, Backend, Telegram, Product/Analyst, Design | Completed 2026-04-17: meal route, Home quick-log, tests, docs, and full verification passed |
| Product/Analyst | Level 3 anti-spam scoring and deterministic quest matching spec | `03_SYSTEMS/XP_System.md`, `03_SYSTEMS/Quest_System.md`, `03_SYSTEMS/Rank_System.md`, `03_SYSTEMS/Streak_System.md`, `03_SYSTEMS/Adaptive_Mission_Engine.md`, `04_DATA/Domain_Score_Logic.md`, `04_DATA/Data_Model_Overview.md`, `00_START_HERE/00_Project_Index.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `00_START_HERE/07_File_Roles_and_Status.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | Architect, QA, Backend, Telegram, DB | Completed 2026-04-17: scoring/matching guardrails documented; runtime code intentionally unchanged |
| QA/Telegram | Telegram quick-log smoke tooling | `scripts/smoke-telegram-quick-logs.mjs`, `package.json`, `.env.example`, `src/features/telegram/components/TelegramStatusCard.tsx`, `05_TECH/Telegram_Integration.md`, `05_TECH/Env_Variables.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | Backend, Security | Completed 2026-04-17: smoke script and dev-only initData copy action added; typecheck, tests, build, safe invalid-init smoke, and diff check passed |
| Telegram | Level 3 Telegram WebView initData capture and header smoke flow | `src/features/telegram/components/TelegramStatusCard.tsx`, `src/lib/telegram/request-init-data.ts`, `src/app/api/home/route.ts`, `src/app/api/home/route.test.ts`, `src/app/api/water-logs/route.ts`, `src/app/api/water-logs/route.test.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/workout-logs/route.test.ts`, `src/app/api/sleep-logs/route.ts`, `src/app/api/sleep-logs/route.test.ts`, `src/app/api/meal-logs/route.ts`, `src/app/api/meal-logs/route.test.ts`, `scripts/smoke-telegram-quick-logs.mjs`, `package.json`, `.env.example`, `README.md`, `05_TECH/Telegram_Integration.md`, `05_TECH/Env_Variables.md`, `05_TECH/Security.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Backend, Security | Completed 2026-04-17: dev-only Telegram debug capture, header-based smoke auth, docs, route tests, typecheck, full tests, build, negative smoke, and diff check passed |
| Backend | Level 3 metadata-driven workout quest matcher | `src/lib/quests/daily-quest-seed.ts`, `src/lib/quests/log-quest-sync.ts`, `src/lib/quests/log-quest-sync.test.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/workout-logs/route.test.ts`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, `03_SYSTEMS/Quest_System.md`, `03_SYSTEMS/XP_System.md`, `04_DATA/Domain_Score_Logic.md`, `05_TECH/Security.md`, `05_TECH/Telegram_Integration.md`, `00_START_HERE/04_Current_State.md`, `00_START_HERE/05_Next_Steps.md`, `07_TASKS/Agent_Workstreams.md`, `07_TASKS/Parallel_Workstreams.md`, `07_TASKS/Current_Sprint.md`, `07_TASKS/Decisions_Log.md`, `07_TASKS/Open_Questions.md`, `10_LOGS/Session_Log.md` | QA, Telegram, Security, Product/Analyst | Completed 2026-04-17: metadata-only workout quest sync implemented; targeted tests, full tests, typecheck, build, and diff check passed |

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
