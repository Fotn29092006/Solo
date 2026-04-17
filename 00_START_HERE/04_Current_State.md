# Current State

## Purpose
Facts about what exists now.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[00_Project_Index]]
- [[06_Graph_Memory_Protocol]]
- [[07_File_Roles_and_Status]]
- [[05_Next_Steps]]
- [[../07_TASKS/Decisions_Log]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[../10_LOGS/Session_Log]]

## Content
- Workspace root: `C:\Projects\system`.
- Git repository has been initialized at the workspace root.
- GitHub remote `origin/main` has received the runtime env status, mini-team workflow controls, and Telegram trust-boundary foundation commits.
- Repository `.gitignore` exists for secrets, dependency folders, build outputs, caches, logs, local editor state, Obsidian workspace state, Supabase local runtime state, and agent runtime state.
- Repository `.gitattributes` exists to normalize text files to LF for cross-platform and multi-agent work.
- Raw product blueprint exists in `main.md`.
- Obsidian vault structure has been created in this workspace.
- Graph-memory protocol exists at [[06_Graph_Memory_Protocol]].
- File authority and role map exists at [[07_File_Roles_and_Status]].
- Canonical naming rules exist at [[../07_TASKS/Canonical_Naming]].
- Strict pre-task, role, memory-update, decision, and failure-detection enforcement is documented in [[06_Graph_Memory_Protocol]].
- Agent workstream enforcement exists at [[../07_TASKS/Agent_Workstreams]].
- Mini-team execution mode is documented in [[06_Graph_Memory_Protocol]] for significant Level 2 and Level 3 work.
- Parallel workstream control exists at [[../07_TASKS/Parallel_Workstreams]] for Level 3 large or cross-domain tasks.
- Orchestrator session guidance exists at [[../08_PROMPTS/Orchestrator_Agent_Prompt]].
- [[00_Project_Index]] is the vault entry point for future Codex sessions.
- Local Codex project plugin exists at `plugins/solo-system-rpg`.
- Local Codex project plugin skills mirror the graph-memory startup route.
- Local marketplace exists at `.agents/plugins/marketplace.json`.
- `AGENTS.md` contains the graph-memory startup route and pre-task enforcement gate for future Codex sessions.
- Foundation files intended for version control include vault Markdown, `main.md`, root agent guidance files, stable `.obsidian` settings, `.agents/plugins/marketplace.json`, and the local project plugin manifest/skills.
- Obsidian workspace state remains local and ignored.
- Empty root file `null` exists and is treated as local scratch/junk, not project source.
- Practical Codex skills are installed under `C:\Users\Almas\.codex\skills`.
- Figma/design skills are installed for design work.
- Application runtime foundation now exists at the repository root.
- Next.js App Router project is configured with TypeScript and Tailwind CSS.
- `npm run dev` uses Next.js webpack dev mode for Telegram Desktop WebView compatibility; `npm run dev:turbo` is available for ordinary browser preview work.
- Runtime source lives under `src`, with `src/app`, `src/features`, `src/components`, `src/lib`, `src/config`, and `src/shared/types`.
- Home screen shell exists at `src/app/page.tsx`.
- Onboarding structure exists at `src/app/onboarding/page.tsx`.
- Telegram Mini App base integration exists under `src/features/telegram` and `src/lib/telegram`.
- Server-side Telegram Mini App init-data validation scaffold exists at `src/lib/telegram/server.ts`.
- Telegram auth validation route exists at `src/app/api/auth/telegram/route.ts`.
- Telegram init-data validation unit tests exist at `src/lib/telegram/validate-init-data.test.ts`.
- Route-level API tests now cover onboarding, Home state, quest completion, daily quest streak, weekly check-in, water logging, workout logging, sleep logging, and meal logging response contracts.
- Vitest is configured as the TypeScript unit test runner.
- Supabase browser client setup exists at `src/lib/supabase/client.ts`.
- Supabase connection health route exists at `src/app/api/health/supabase/route.ts`.
- Tracked `.env.example` documents required Telegram and Supabase variables.
- Ignored local `.env.local` contains Supabase URL, anon key, service role key, Telegram Bot token, and Telegram Bot username for development.
- Supabase URL and anon key were verified against the Supabase Auth settings endpoint.
- Supabase Auth settings health returned HTTP 200 from this workspace with local development credentials on 2026-04-15.
- Supabase Auth settings health returned HTTP 200 from this workspace with local development credentials again on 2026-04-16.
- Supabase CLI is installed locally at version 2.84.2.
- This workspace does not currently have `supabase/config.toml`, so it is not linked as a Supabase CLI project workspace.
- `SUPABASE_ACCESS_TOKEN` is not present in the current process environment.
- Supabase CLI project listing is blocked because no CLI access token is available in the workspace environment.
- No Supabase MCP SQL/migration resources are exposed to this Codex session.
- Supabase MVP spine live verification script exists at `scripts/verify-supabase-mvp-spine.mjs` and is exposed as `npm run verify:supabase:mvp`.
- The Supabase MVP spine verifier now exits cleanly with a non-zero status when tables are unavailable.
- A live REST probe with the local service role key returned HTTP 404 for all eight MVP tables earlier on 2026-04-16.
- A later `npm run verify:supabase:mvp` run on 2026-04-16 confirmed Supabase reachability returned HTTP 200 and all eight MVP tables returned HTTP 200.
- The Supabase MVP spine DB gate has passed.
- A later `npm run verify:supabase:mvp` run on 2026-04-16 returned `network_error` for all eight MVP tables because the workspace could not reach Supabase; this does not prove the tables exist or do not exist.
- `scripts/verify-supabase-mvp-spine.mjs` now handles Supabase fetch/network failures as clean non-zero verifier failures instead of uncaught stack traces.
- `src/lib/supabase/server.ts` now creates a server-only Supabase service-role client for validated server routes.
- `src/app/api/auth/telegram/route.ts` now validates Telegram init data and looks up or creates `profiles` by `telegram_user_id`.
- `src/app/api/home/route.ts` now validates Telegram init data, derives `profile_id`, returns profile-aware Home state, reads active goal/path/streaks, and seeds the current daily quest package when missing.
- `src/app/api/onboarding/route.ts` now validates Telegram init data, derives `profile_id`, and persists MVP `goals` and `user_paths`.
- `src/app/api/quests/complete/route.ts` now validates Telegram init data, verifies quest ownership, completes assigned quests, writes XP events, syncs profile XP/level, and updates the daily quest streak when the full daily package is complete.
- `src/app/api/weekly-checkin/route.ts` now validates Telegram init data, derives `profile_id`, reads or upserts the current weekly check-in, generates the MVP summary server-side, and updates the weekly review streak.
- `src/lib/quests/daily-quest-seed.ts` defines the first MVP daily quest seed package.
- `src/lib/streaks/daily-quest-streak.ts` defines the MVP daily quest streak progression helper.
- `src/lib/weekly-checkins/week-start.ts` defines UTC week-start and weekly review streak helpers.
- `src/features/home/components/HomeScreen.tsx` now loads profile-aware Home state, real daily quests, live daily quest streaks, weekly check-in state, and one-tap quest completion in Telegram, with browser preview fallback.
- `src/features/weekly-checkin/components/WeeklyCheckInCard.tsx` now provides the compact Home weekly review entry and submit form.
- `src/features/onboarding/components/OnboardingFlow.tsx` now contains a working Telegram-first goal/path onboarding flow instead of a placeholder.
- A requested architect sub-agent was attempted twice on 2026-04-16, but both attempts failed with a Codex subagent stream-disconnect error before completion.
- A six-stream readiness split for DB, Backend, Telegram, Frontend, QA, and Product/Design is recorded in [[../07_TASKS/Parallel_Workstreams]], and the DB, identity, onboarding backend, onboarding frontend, and QA streams have moved forward after the DB gate passed.
- Supabase MVP spine migration exists at `supabase/migrations/0001_mvp_spine.sql`.
- The MVP spine currently includes only `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- Water logging migration exists at `supabase/migrations/0002_water_logging.sql`.
- `0002_water_logging.sql` prepares `water_logs` with validated-profile ownership, client event idempotency, ml amount bounds, UTC log date, query indexes, and RLS enabled without anon/client policies.
- `0002_water_logging.sql` has been applied to the live development Supabase project and verified on 2026-04-17.
- `npm run verify:supabase:water` exists and verifies Supabase reachability plus the `water_logs` table.
- `src/app/api/water-logs/route.ts` validates Telegram init data, derives `profile_id`, writes idempotent `water_logs` records by `client_event_id`, and returns today's hydration aggregate.
- `/api/water-logs` rejects unknown top-level request fields before Telegram validation or Supabase access.
- `src/features/water/components/WaterQuickLogCard.tsx` provides a compact Home hydration quick-log entry.
- `src/features/home/components/HomeScreen.tsx` reads `waterToday` from `/api/home` and submits quick water logs through `/api/water-logs`.
- Water logging is a real behavior signal and can auto-complete only the assigned hydration daily quest after the server-side daily water aggregate reaches at least 1000 ml.
- Water logs do not award XP directly; hydration XP still flows only through `quest_completions` and `xp_events` for the assigned hydration quest.
- `src/lib/quests/log-quest-sync.ts` defines MVP hydration and workout quest sync helpers.
- Workout logging migration exists at `supabase/migrations/0003_workout_logging.sql`.
- `0003_workout_logging.sql` prepares `workout_logs` with validated-profile ownership, client event idempotency, workout type, optional session details, UTC log date, query indexes, and RLS enabled without anon/client policies.
- `0003_workout_logging.sql` has been applied to the live development Supabase project and verified on 2026-04-17.
- `npm run verify:supabase:workout` exists and verifies Supabase reachability plus the `workout_logs` table after apply.
- `npm run verify:supabase:workout` reached Supabase on 2026-04-17 and returned HTTP 200 for `workout_logs`.
- `src/app/api/workout-logs/route.ts` validates Telegram init data, derives `profile_id`, writes idempotent `workout_logs` records by `client_event_id`, and returns today's workout aggregate.
- `/api/workout-logs` rejects unknown top-level request fields before Telegram validation or Supabase access.
- `src/features/workout/components/WorkoutQuickLogCard.tsx` provides a compact Home workout quick-log entry.
- `src/features/home/components/HomeScreen.tsx` reads `workoutToday` from `/api/home` and submits quick workout logs through `/api/workout-logs`.
- Workout logging is a real Body-domain behavior signal and can auto-complete only explicitly metadata-seeded Body main quests after the server-side daily workout session threshold is reached.
- Workout logs do not award direct XP, update rank, update standalone workout streaks, or match broad/title-based workout quests.
- Sleep logging migration exists at `supabase/migrations/0004_sleep_logging.sql`.
- `0004_sleep_logging.sql` prepares `sleep_logs` with validated-profile ownership, client event idempotency, sleep duration, optional sleep quality, optional morning energy, UTC log date, query indexes, and RLS enabled without anon/client policies.
- `npm run verify:supabase:sleep` exists and verifies Supabase reachability plus the `sleep_logs` table after apply.
- `0004_sleep_logging.sql` has been applied to the live development Supabase project and verified on 2026-04-17.
- `npm run verify:supabase:sleep` reached Supabase on 2026-04-17 and returned HTTP 200 for `sleep_logs`.
- `src/app/api/sleep-logs/route.ts` validates Telegram init data, derives `profile_id`, writes idempotent `sleep_logs` records by `client_event_id`, and returns today's sleep aggregate.
- `/api/sleep-logs` rejects unknown top-level request fields before Telegram validation or Supabase access.
- `src/features/sleep/components/SleepQuickLogCard.tsx` provides a compact Home sleep quick-log entry.
- `src/features/home/components/HomeScreen.tsx` reads `sleepToday` from `/api/home` and submits quick sleep logs through `/api/sleep-logs`.
- Sleep logging is a real Recovery-domain daily behavior signal, separate from weekly check-in `sleep_score`, to avoid double-counting the same recovery signal.
- Sleep logging does not award XP, update rank, update streaks, auto-complete quests, or send bot notifications yet.
- Meal logging migration exists at `supabase/migrations/0005_meal_logging.sql`.
- `0005_meal_logging.sql` prepares `meal_logs` with validated-profile ownership, client event idempotency, meal type, optional meal name, optional calories/protein, UTC log date, query indexes, and RLS enabled without anon/client policies.
- `npm run verify:supabase:meal` exists and checks the local migration contract, Supabase reachability, required live columns, and anon insert blocking after apply.
- `npm run smoke:telegram` exists and runs `scripts/smoke-telegram-quick-logs.mjs` against `/api/home`, `/api/water-logs`, `/api/workout-logs`, `/api/sleep-logs`, and `/api/meal-logs`.
- Telegram smoke tooling requires local `TELEGRAM_TEST_INIT_DATA` copied from a real Telegram Mini App launch and required `NEXT_PUBLIC_APP_URL` pointing at the public dev URL.
- Telegram smoke tooling uses public server routes only, does not use Supabase service-role credentials, sends `ngrok-skip-browser-warning: true` for ngrok automation, and passes captured init data only through the `x-telegram-init-data` header.
- Telegram smoke tooling creates real development log rows for the validated Telegram profile when run with valid init data.
- `TelegramStatusCard` now includes a development-only Telegram debug block that always renders in development, can copy `initData` and `initDataUnsafe`, and renders only a masked `initData` preview.
- `useTelegramWebApp` now waits briefly for the Telegram SDK before falling back to browser preview mode.
- `TelegramStatusCard` now renders development-only sanitized launch diagnostics for SDK availability, WebApp object availability, `initData` presence, `tgWebAppData` launch-param presence/source, platform/version param presence, unsafe user presence, and SDK wait attempts.
- Telegram development diagnostics also show whether the client effect is active, whether the Telegram SDK script tag exists in the document, and the document readiness state.
- The development diagnostics do not render raw Telegram launch parameters or raw `initData`.
- `TelegramBridgeFallback` now provides a development-only no-React capture path that can copy real Telegram SDK `initData` or real launch `tgWebAppData` even when the main Next/React client bundle does not hydrate in Telegram WebView.
- `src/app/layout.tsx` now loads the Telegram WebApp SDK through a direct script tag and renders the development-only fallback bridge after the app shell.
- `/api/home`, `/api/water-logs`, `/api/workout-logs`, `/api/sleep-logs`, and `/api/meal-logs` accept `x-telegram-init-data` only in development mode for local smoke requests; production behavior still requires body `initData`.
- `0005_meal_logging.sql` has been applied to the live development Supabase project and verified on 2026-04-17.
- `npm run verify:supabase:meal` reached Supabase on 2026-04-17, confirmed `meal_logs` returned HTTP 200, and confirmed anon inserts are blocked with HTTP 401.
- `src/app/api/meal-logs/route.ts` validates Telegram init data, derives `profile_id`, rejects unknown request fields, writes idempotent `meal_logs` records by `client_event_id`, and returns today's meal aggregate.
- `src/features/meal/components/MealQuickLogCard.tsx` provides a compact Home nutrition quick-log entry.
- `src/features/home/components/HomeScreen.tsx` reads `mealToday` from `/api/home` and submits quick meal logs through `/api/meal-logs`.
- Meal logging is intended as a real Nutrition-domain daily behavior signal, not an ingredient-level food database or direct XP source.
- Meal logging does not award XP, update rank, update streaks, auto-complete quests, or send bot notifications yet.
- Domain scoring guardrails now exist at `04_DATA/Domain_Score_Logic.md`.
- Current anti-spam scoring rules require server-derived identity/date, aggregate thresholds, daily reward caps, and idempotent side effects before logs can affect XP, rank, streaks, or domain scores.
- Future quest-to-log matching rules must use explicit `daily_quests.metadata` keys such as `matchVersion`, `autoCompleteKey`, `matchWindow`, and threshold fields; title-text matching and broad domain matching are forbidden for new matchers.
- Workout, sleep, and meal quick-logs remain evidence-only until quests are seeded with explicit matching metadata and the corresponding runtime matcher is implemented.
- Real Telegram WebView smoke testing for quick-log flows remains external to this terminal session until a fresh `TELEGRAM_TEST_INIT_DATA` value is captured from Telegram.
- The MVP identity boundary is server-validated Telegram identity mapped to an internal `profiles.id`.
- `profiles.telegram_user_id` is the unique external Telegram identity binding.
- Direct client writes to user-owned Supabase tables are deferred until a Supabase Auth/JWT and RLS policy strategy exists.
- Live Supabase health passed through local `/api/health/supabase`.
- The MVP spine, water logging, workout logging, sleep logging, and meal logging migrations have been applied to the live development project outside the unauthenticated local CLI workflow and verified from this workspace.
- Applying future migrations from this workspace is still blocked until either Supabase Dashboard SQL is used manually or Supabase CLI auth/linking is configured.
- Profile creation and onboarding goal/path writes now have server routes, but direct client writes remain blocked.
- Backend, frontend, QA, and integration streams for profile/onboarding persistence have started after the Supabase MVP spine verification passed.
- `npm test` passes with route-level coverage for the weekly check-in, water logging, workout logging, sleep logging, and hydration quest sync paths.
- `npm run typecheck` passes.
- `npm run verify:supabase:mvp` passes for the original eight MVP spine tables.
- `npm run verify:supabase:water` passes for the water logging table.
- `npm run verify:supabase:workout` passes for the workout logging table.
- `npm run verify:supabase:sleep` passes for the sleep logging table.
- `npm run verify:supabase:meal` passes for the meal logging table and anon insert blocking check.
- `npm run build` passes.
- Supabase project credentials are not present in tracked files.
- Telegram Mini App client foundation exists, but BotFather/Mini App launch configuration is not present in this workspace.

Known risks:

- Product scope is large for an MVP.
- XP/rank systems can become fake if scoring rules are weak.
- Telegram reminders can become spammy if triggers are not controlled.
- Too many logging surfaces can create daily friction.
- The current Telegram Bot token and Supabase service role key were shared in chat and should be rotated before production use.
- Future data writes beyond onboarding remain gated by validated server routes and scoped implementation streams.
