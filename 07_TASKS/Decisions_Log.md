# Decisions Log

## Purpose
Record important decisions and why they were made.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Open_Questions]]
- [[../00_START_HERE/04_Current_State]]
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[Canonical_Naming]]
- [[Agent_Workstreams]]
- [[Parallel_Workstreams]]

## Content
2026-04-15:

- Workspace root is treated as the Obsidian vault root.
- `main.md` remains the raw historical blueprint.
- `00_START_HERE` files are the session startup route.
- A local Codex plugin named `solo-system-rpg` was created for project-specific working rules.
- Figma/design skills were installed because this project requires strong UI/design work.
- Notion, Linear, Sora, and novelty skills were not installed because the project source of truth is Obsidian and no requirement currently depends on those tools.
- The repository should track Obsidian vault Markdown, `main.md`, root agent guidance files, stable Obsidian settings, `.agents/plugins/marketplace.json`, and the local Solo System RPG Codex plugin.
- The repository should ignore secrets, environment files, dependency folders, build outputs, caches, logs, local editor/OS state, Obsidian workspace/plugin runtime state, Supabase local runtime state, and agent runtime state.
- Text files should be normalized to LF through `.gitattributes` to reduce cross-platform and multi-agent line-ending churn.
- The empty root `null` file is treated as local scratch/junk and should not be tracked.
- The Obsidian vault is the project's graph-memory source of truth, with [[../00_START_HERE/00_Project_Index]] as the entry point.
- [[../00_START_HERE/06_Graph_Memory_Protocol]] defines the session reading route, authority rules, and post-session update loop.
- [[../00_START_HERE/07_File_Roles_and_Status]] defines authoritative, operational, reference, prompt, and raw-source files.
- [[Canonical_Naming]] defines naming rules for future docs, concepts, and graph links.
- Root instruction files and local project plugin skills should mirror the same graph-memory reading route.
- Runtime foundation uses a single repository root, not a nested app package, so the app and Obsidian vault stay together.
- Next.js App Router lives in `src/app`; feature code lives under `src/features`; shared UI lives under `src/components`; platform clients live under `src/lib`; config lives under `src/config`; shared types live under `src/shared/types`.
- The first runtime pass uses minimal custom UI and Tailwind CSS, with visual polish intentionally deferred.
- Telegram Mini App integration starts with client-side WebApp detection, safe area handling, init, and user data reading only.
- Full Telegram Bot behavior and server-side Telegram init data validation are deferred to the next pass.
- Supabase setup starts with a browser client, a server health route, tracked `.env.example`, and one MVP spine migration.
- The first Supabase migration is intentionally limited to `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- Supabase health checks use `auth/v1/settings` with the anon key because the REST table surface depends on schema/table state.
- Decision: Future significant tasks must pass a strict pre-task gate with reading confirmation, active task, primary role, reviewer role, scope boundaries, allowed files, forbidden files, and required post-task docs.
- Reason: Previous work showed that role prompts and graph-memory rules were conceptual unless enforced before edits and checked after edits.
- Scope: [[../00_START_HERE/06_Graph_Memory_Protocol]], [[../07_TASKS/Agent_Workstreams]], root instruction files, and session brief template.
- Role: Architect.
- Reviewer: QA.
- Follow-up: Use [[Agent_Workstreams]] before the next implementation task.
- Decision: Future significant Codex sessions must use task-level classification, a lightweight mini-team pass, and merge-controlled parallel workstreams for Level 3 tasks.
- Reason: The project needs real execution architecture for multi-role work without letting parallel changes conflict or weaken the Obsidian vault as source of truth.
- Scope: [[../00_START_HERE/06_Graph_Memory_Protocol]], [[Agent_Workstreams]], [[Parallel_Workstreams]], [[../08_PROMPTS/Session_Brief_Template]], [[../08_PROMPTS/Orchestrator_Agent_Prompt]], `AGENTS.md`, and `CLAUDE.md`.
- Role: Architect.
- Reviewer: QA.
- Follow-up: Use Level 2 or Level 3 classification before the next Supabase or Telegram trust-boundary implementation task.
- Decision: MVP identity binding uses server-validated Telegram init data mapped to an internal `profiles.id`; `profiles.telegram_user_id` is the unique external identity binding.
- Reason: Telegram Mini App init data does not create a Supabase Auth session by itself, so `auth.uid()` cannot safely own MVP profile rows yet.
- Scope: `supabase/migrations/0001_mvp_spine.sql`, [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Telegram_Integration]], [[../05_TECH/Security]], and [[../05_TECH/Architecture]].
- Role: Architect.
- Reviewer: DB, Telegram, QA.
- Follow-up: Apply the migration only after confirming the development target is clean, then implement profile lookup/create through the validated Telegram server route.
- Decision: Direct client access to user-owned Supabase tables remains deferred until a Supabase Auth/JWT and RLS policy strategy exists.
- Reason: Client-side RLS policies based on `auth.uid()` would fail for Telegram-only users and could push the app toward trusting client-supplied ownership fields.
- Scope: `supabase/migrations/0001_mvp_spine.sql`, [[../05_TECH/Security]], [[../05_TECH/Supabase_Setup]], and [[../04_DATA/Database_Schema]].
- Role: Architect.
- Reviewer: DB, Backend, QA.
- Follow-up: Keep MVP data writes on server routes that derive `profile_id` from validated Telegram identity.
- Decision: Use Vitest for TypeScript unit tests in the Next.js runtime.
- Reason: Telegram init-data validation is a security boundary and needs repeatable tests before profile creation or write routes depend on it.
- Scope: `package.json`, `vitest.config.ts`, `src/lib/telegram/validate-init-data.test.ts`, and [[../05_TECH/Architecture]].
- Role: QA.
- Reviewer: Telegram, Backend.
- Follow-up: Keep auth/trust-boundary code covered before wiring persistence.
- Decision: Supabase schema changes must use reviewed migration SQL through Supabase Dashboard SQL editor or an authenticated Supabase CLI workflow, not service-role API-key workarounds.
- Reason: DDL must stay controlled, reviewable, and separate from runtime API credentials.
- Scope: [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], [[../04_DATA/Database_Schema]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend.
- Follow-up: Apply `supabase/migrations/0001_mvp_spine.sql` only after Dashboard SQL access or Supabase CLI auth/linking is available.

2026-04-16:

- Decision: Level 3 profile/onboarding implementation streams remain blocked until `npm run verify:supabase:mvp` passes.
- Reason: The accepted plan requires the DB gate first, and the live project still returns HTTP 404 for all eight MVP tables.
- Scope: [[Parallel_Workstreams]], [[Agent_Workstreams]], [[../00_START_HERE/05_Next_Steps]], and profile/onboarding implementation work.
- Role: Architect.
- Reviewer: DB, Backend, QA.
- Follow-up: Apply the MVP migration through Supabase Dashboard SQL Editor, rerun the verifier, then start the downstream streams.
- Update 2026-04-16: DB gate passed and downstream profile/onboarding streams started.
- Decision: Temporary internal MVP onboarding keys are allowed for the next persistence pass.
- Reason: Goal/path persistence needs stable internal values before final public naming is decided.
- Scope: future onboarding route and onboarding UI work.
- Role: Product/Analyst.
- Reviewer: Architect, Backend, QA.
- Follow-up: Use `fat_loss`, `muscle_gain`, `recomposition`, `discipline`, `learning` for `goalType`; use `warrior`, `discipline`, `scholar`, `polyglot`, `rebuild`, `aesthetic`, `balance` for `pathKey`.
- Decision: Proceed with server-only profile and onboarding writes after the Supabase MVP spine verifier passed.
- Reason: All eight MVP tables are now reachable in the live development Supabase project, and the existing trust-boundary decision requires writes to derive `profile_id` from validated Telegram init data.
- Scope: `src/app/api/auth/telegram/route.ts`, `src/app/api/onboarding/route.ts`, `src/lib/supabase/server.ts`, `src/lib/telegram/profile-identity.ts`, `src/features/onboarding/components/OnboardingFlow.tsx`, [[../05_TECH/Supabase_Setup]], [[../05_TECH/Telegram_Integration]], and [[../05_TECH/Security]].
- Role: Backend.
- Reviewer: DB, Telegram, QA.
- Follow-up: Add profile-aware Home state and daily quest seed/write path next.
- Decision: The first MVP daily quest package is seeded by `/api/home` after Telegram validation when no quests exist for the current profile/date.
- Reason: Home must become the first useful screen after onboarding, and quest generation must use server-derived identity instead of client-owned data.
- Scope: `src/app/api/home/route.ts`, `src/lib/quests/daily-quest-seed.ts`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/Quest_System]], [[../05_TECH/Telegram_Integration]], and [[../05_TECH/Security]].
- Role: Backend.
- Reviewer: DB, Telegram, QA, Design.
- Follow-up: Add quest completion and XP event writes with anti-spam checks.
- Decision: MVP quest completion writes XP from server-owned quest rewards and treats repeat completion as idempotent.
- Reason: XP must reflect real assigned quest completion, and the client must not be able to submit arbitrary XP or ownership fields.
- Scope: `src/app/api/quests/complete/route.ts`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/Quest_System]], [[../03_SYSTEMS/XP_System]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Backend.
- Reviewer: DB, Telegram, QA, Design.
- Follow-up: Add daily quest streak updates and live Home streak display.
- Decision: MVP `daily_quest` streak advances only when the full daily quest package is complete for a validated profile and quest date.
- Reason: Streaks should reward real daily follow-through rather than individual quest taps, and the same date must not inflate consistency.
- Scope: `src/app/api/quests/complete/route.ts`, `src/app/api/home/route.ts`, `src/lib/streaks/daily-quest-streak.ts`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/Streak_System]], and [[../05_TECH/Security]].
- Role: Backend.
- Reviewer: DB, Telegram, QA, Frontend.
- Follow-up: Add route-level QA coverage around onboarding, Home state, quest completion, and streak contracts.
- Decision: MVP weekly check-in uses a server-computed current UTC week and upserts one row per `profile_id + week_start_date`.
- Reason: Weekly review must be low-friction, idempotent for repeat submissions, and protected from client-supplied ownership or week spoofing.
- Scope: `src/app/api/weekly-checkin/route.ts`, `src/app/api/home/route.ts`, `src/lib/weekly-checkins/week-start.ts`, `src/features/weekly-checkin/components/WeeklyCheckInCard.tsx`, [[../03_SYSTEMS/Weekly_Review_System]], [[../04_DATA/Database_Schema]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Architect.
- Reviewer: QA, DB, Backend, Telegram, Design.
- Follow-up: Define the first MVP logging slice after the daily and weekly loops.
- Decision: Water logging is the first MVP logging slice after daily quests and weekly check-ins.
- Reason: Hydration is low-friction, supports the Nutrition domain, creates a useful real-behavior signal, and is safer to introduce before higher-friction meal or workout logging.
- Scope: `supabase/migrations/0002_water_logging.sql`, [[../04_DATA/Data_Model_Overview]], [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend, Telegram.
- Follow-up: Apply and verify `0002_water_logging.sql`, then implement `/api/water-logs` with server-derived profile ownership and client event idempotency.
- Decision: `/api/water-logs` records hydration as an idempotent real-behavior log without awarding XP, rank, or streak progress yet.
- Reason: Hydration logging should become a useful signal before it becomes a reward mechanic; tying XP directly to repeated water taps would create fake progression risk.
- Scope: `src/app/api/water-logs/route.ts`, `src/app/api/home/route.ts`, `src/features/water/components/WaterQuickLogCard.tsx`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Architect.
- Reviewer: QA, DB, Backend, Telegram, Design.
- Follow-up: Define quest-to-log matching and hydration scoring rules before connecting water logs to quest completion or XP events.
- Decision: Workout logging is the next MVP logging slice after water logging, and starts as a session-level `workout_logs` table only.
- Reason: Workout sessions are the strongest Body-domain signal, but exercise-level detail, XP, streaks, and quest auto-completion would expand scope and create scoring risk before the basic log path is stable.
- Scope: `supabase/migrations/0003_workout_logging.sql`, `scripts/verify-supabase-workout-logging.mjs`, `package.json`, [[../04_DATA/Data_Model_Overview]], [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Apply and verify `0003_workout_logging.sql`, then implement `/api/workout-logs` with server-derived profile ownership and `client_event_id` idempotency.

2026-04-17:

- Decision: `/api/workout-logs` records workout sessions as idempotent real-behavior logs without awarding XP, rank, streak progress, or quest auto-completion yet.
- Reason: Workout sessions are valuable Body-domain signals, but direct rewards from repeated quick-log taps would create fake progression and spam risk before scoring and quest-to-log matching rules exist.
- Scope: `src/app/api/workout-logs/route.ts`, `src/app/api/home/route.ts`, `src/features/workout/components/WorkoutQuickLogCard.tsx`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Architect.
- Reviewer: QA, DB, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Define workout scoring and quest-to-log matching rules before workout logs can affect XP, rank, streaks, domain scores, or quest completion.

- Decision: Hydration is the first and only MVP log source allowed to auto-complete a daily quest, and only after the server-side daily water aggregate reaches at least 1000 ml.
- Reason: This improves the existing manual hydration quest by requiring a real water log aggregate, while avoiding broad log-to-XP farming and keeping workout auto-completion disabled until stronger scoring exists.
- Scope: `src/lib/quests/log-quest-sync.ts`, `src/lib/quests/daily-quest-seed.ts`, `src/app/api/water-logs/route.ts`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/Quest_System]], [[../03_SYSTEMS/XP_System]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Architect.
- Reviewer: QA, Backend, DB, Telegram, Product/Analyst, Design.
- Follow-up: Smoke-test hydration quest sync in Telegram and keep workout quest auto-completion disabled until workout payload/scoring rules are stronger.

- Decision: Sleep/recovery logging is the next MVP logging slice, and starts as an append-only `sleep_logs` table only.
- Reason: Recovery is a core product domain, but daily sleep logs must not double-count weekly check-in `sleep_score` or create XP/streak farming before recovery scoring rules exist.
- Scope: `supabase/migrations/0004_sleep_logging.sql`, `scripts/verify-supabase-sleep-logging.mjs`, `src/shared/types/database.ts`, [[../04_DATA/Data_Model_Overview]], [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Apply and verify `0004_sleep_logging.sql` before adding `/api/sleep-logs` or Home sleep quick-log runtime code.

- Decision: `/api/sleep-logs` records sleep duration as idempotent real-behavior logs without awarding XP, rank, streak progress, quest auto-completion, or bot notifications.
- Reason: Sleep is a valuable Recovery-domain signal, but direct rewards from repeated sleep quick logs would create fake progression and could double-count weekly check-in `sleep_score`.
- Scope: `src/app/api/sleep-logs/route.ts`, `src/app/api/home/route.ts`, `src/features/sleep/components/SleepQuickLogCard.tsx`, `src/features/home/components/HomeScreen.tsx`, [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Architect.
- Reviewer: QA, DB, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Define recovery scoring and quest-to-log matching rules before sleep logs can affect XP, rank, streaks, domain scores, or recovery quest completion.

- Decision: Meal/nutrition logging is the next MVP logging slice, and starts as an append-only `meal_logs` table only.
- Reason: Nutrition is central to body progression, but ingredient-level food logging, calories/macros engines, direct XP, streaks, and quest auto-completion would create friction and spam/fake-progression risk before the basic meal signal is stable.
- Scope: `supabase/migrations/0005_meal_logging.sql`, `scripts/verify-supabase-meal-logging.mjs`, `src/shared/types/database.ts`, [[../04_DATA/Data_Model_Overview]], [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Apply and verify `0005_meal_logging.sql`, harden log-route payload allowlists, then implement `/api/meal-logs` without XP, rank, streak, quest auto-completion, or bot notification side effects.

- Decision: Existing and future log-write routes must fail closed on unknown top-level request fields before Telegram validation, profile derivation, or Supabase writes.
- Reason: Ignoring extra client fields makes trust-boundary drift easy, especially for ownership, dates, XP, rank, streak, quest, score, aggregate, or notification values.
- Scope: `src/app/api/water-logs/route.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/sleep-logs/route.ts`, `src/app/api/meal-logs/route.ts`, [[../05_TECH/Security]], [[../05_TECH/Telegram_Integration]], and [[../05_TECH/Architecture]].
- Role: Backend.
- Reviewer: QA, Telegram, Security.
- Follow-up: Apply the same strict allowlist pattern to future learning/language/body log routes.

- Decision: `/api/meal-logs` records meal entries as idempotent real-behavior logs without awarding XP, rank, streak progress, quest auto-completion, or bot notifications.
- Reason: Nutrition logs are valuable signals, but raw meal taps must not create fake progression, spam rewards, or turn the MVP into a calorie-tracker UI.
- Scope: `src/app/api/meal-logs/route.ts`, `src/app/api/home/route.ts`, `src/features/meal/components/MealQuickLogCard.tsx`, `src/features/home/components/HomeScreen.tsx`, [[../04_DATA/Database_Schema]], [[../05_TECH/Security]], [[../05_TECH/Telegram_Integration]], [[../03_SYSTEMS/XP_System]], and [[../03_SYSTEMS/Quest_System]].
- Role: Architect.
- Reviewer: QA, DB, Backend, Telegram, Product/Analyst, Design.
- Follow-up: Define nutrition scoring, anti-spam limits, and stable quest-matching metadata before meal logs can affect XP, rank, streaks, domain scores, or meal/protein quest completion.

- Decision: Future log-based progression effects must use server-side aggregate scoring and explicit quest metadata, not raw log counts, title matching, or broad domain matching.
- Reason: Water, workout, sleep, and meal quick-logs are useful real-behavior evidence, but unchecked raw-log rewards would create fake progression, duplicate rewards, timezone abuse, and rank inflation.
- Scope: [[../04_DATA/Domain_Score_Logic]], [[../03_SYSTEMS/XP_System]], [[../03_SYSTEMS/Quest_System]], [[../03_SYSTEMS/Rank_System]], [[../03_SYSTEMS/Streak_System]], and [[../03_SYSTEMS/Adaptive_Mission_Engine]].
- Role: Product/Analyst.
- Reviewer: Architect, QA, Backend, Telegram, DB.
- Follow-up: Keep workout, sleep, and meal logs evidence-only until runtime matchers use `matchVersion`, `autoCompleteKey`, `matchWindow`, same-profile/date checks, aggregate thresholds, idempotency, and daily reward caps.

- Decision: Add local Telegram quick-log smoke tooling that uses captured Mini App `initData` through public server routes only.
- Reason: Real Telegram WebView launch cannot be proven from terminal alone, but a captured `initData` value lets Codex validate the server-side Home and quick-log loop without bypassing Telegram validation or Supabase ownership rules.
- Scope: `scripts/smoke-telegram-quick-logs.mjs`, `src/features/telegram/components/TelegramStatusCard.tsx`, `package.json`, `.env.example`, [[../05_TECH/Telegram_Integration]], [[../05_TECH/Env_Variables]], and [[../05_TECH/Security]].
- Role: QA/Telegram.
- Reviewer: Backend, Security.
- Follow-up: Use the development-only `Copy initData` action to capture fresh `TELEGRAM_TEST_INIT_DATA` from Telegram WebView and run `npm run smoke:telegram`.

- Decision: Telegram smoke tests may pass captured `TELEGRAM_TEST_INIT_DATA` through `x-telegram-init-data` only in development mode, while production routes continue to require body `initData`.
- Reason: A real Telegram WebView cannot be reproduced honestly from terminal automation, so development header fallback enables local/ngrok smoke tests without weakening production auth or accepting auth secrets as body payload fields.
- Scope: `src/lib/telegram/request-init-data.ts`, `src/app/api/home/route.ts`, `src/app/api/water-logs/route.ts`, `src/app/api/workout-logs/route.ts`, `src/app/api/sleep-logs/route.ts`, `src/app/api/meal-logs/route.ts`, `scripts/smoke-telegram-quick-logs.mjs`, `src/features/telegram/components/TelegramStatusCard.tsx`, `.env.example`, `README.md`, [[../05_TECH/Telegram_Integration]], [[../05_TECH/Env_Variables]], and [[../05_TECH/Security]].
- Role: Telegram.
- Reviewer: QA, Backend, Security.
- Follow-up: Capture fresh `TELEGRAM_TEST_INIT_DATA` from the real Telegram WebView, set `NEXT_PUBLIC_APP_URL=https://flashing-hazelnut-scored.ngrok-free.dev`, and run `npm run smoke:telegram`.

- Decision: Workout quick-log may auto-complete only newly seeded Body main quests with explicit `autoCompleteKey = workout_log`, `matchWindow = quest_date`, and `minWorkoutSessions` metadata.
- Reason: This is the smallest safe Body-domain matcher because it uses server-derived profile/date, daily workout aggregate, idempotent quest completion, and no title/domain fallback or direct raw-log XP.
- Scope: `src/lib/quests/daily-quest-seed.ts`, `src/lib/quests/log-quest-sync.ts`, `src/app/api/workout-logs/route.ts`, `src/features/home/components/HomeScreen.tsx`, `src/shared/types/game.ts`, [[../03_SYSTEMS/Quest_System]], [[../03_SYSTEMS/XP_System]], [[../04_DATA/Domain_Score_Logic]], [[../05_TECH/Security]], and [[../05_TECH/Telegram_Integration]].
- Role: Backend.
- Reviewer: QA, Telegram, Security, Product/Analyst.
- Follow-up: Keep sleep and meal matchers disabled until they are implemented with the same explicit metadata, aggregate threshold, and idempotency rules.
