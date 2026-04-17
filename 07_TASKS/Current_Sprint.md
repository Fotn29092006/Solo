# Current Sprint

## Purpose
Near-term sprint focus.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Backlog]]
- [[../00_START_HERE/05_Next_Steps]]
- [[Agent_Workstreams]]
- [[Parallel_Workstreams]]

## Content
Sprint goal:

Turn foundation specs into a working Telegram Mini App runtime base.

Tasks:

- Completed: scaffold Next.js App Router runtime with TypeScript and Tailwind CSS.
- Completed: create modular `src` structure for app, features, components, lib, config, and shared types.
- Completed: add Telegram Mini App base detection, init, safe area handling, and user data read path.
- Completed: add Supabase client setup and `/api/health/supabase` connection test route.
- Completed: add Supabase development env values to ignored `.env.local`.
- Completed: verify Supabase anon key against the Auth settings endpoint.
- Completed: draft MVP Supabase spine migration with only the eight foundation tables.
- Completed: add strict pre-task, role, memory-update, decision, and failure-detection enforcement.
- Completed: add `07_TASKS/Agent_Workstreams.md` for role/scope ownership.
- Completed: add mini-team task classification, parallel workstream control, and merge discipline for significant Codex sessions.
- Completed: add server-side Telegram init-data validation scaffold and `/api/auth/telegram` validation route.
- Completed: revise the MVP spine migration around server-validated Telegram identity and internal profile IDs.
- Completed: verify live Supabase health through the local health route.
- Completed: add automated tests for Telegram init-data validation.
- Completed: add `npm run verify:supabase:mvp` to verify the eight MVP tables after migration apply.
- Completed: record the Level 3 parallel workstream map for Telegram identity and onboarding connection.
- Completed: live MVP table verification now passes for all eight tables.
- Completed: implement profile lookup/create by validated Telegram identity.
- Completed: wire onboarding writes for goal and path through the validated server identity path.
- Completed: replace onboarding placeholder with a Telegram-first goal/path persistence flow.
- Completed: add profile-aware Home state route and first real daily quest seed/write path.
- Completed: wire Home shell to live profile state and seeded daily quests.
- Completed: add daily quest completion, XP event write, and Home quick-complete flow.
- Completed: add daily quest streak update path and show live streak on Home.
- Completed: add route-level QA coverage around onboarding, Home state, quest completion, and streak contracts.
- Completed: define and implement the first weekly check-in/read path.
- Completed: choose water as the first MVP logging slice after the daily and weekly loops.
- Completed: prepare `supabase/migrations/0002_water_logging.sql` and the water logging data/security contract.
- Completed: verify the live `water_logs` table.
- Completed: implement `/api/water-logs` with Telegram validation, server-derived ownership, and `client_event_id` idempotency.
- Completed: add Home hydration quick-log and today's water aggregate.
- Completed: choose workout logging as the next MVP logging slice.
- Completed: prepare `supabase/migrations/0003_workout_logging.sql` and `npm run verify:supabase:workout`.
- Completed: verify the live `workout_logs` table.
- Completed: implement `/api/workout-logs` with Telegram validation, server-derived ownership, and `client_event_id` idempotency.
- Completed: add Home workout quick-log and today's workout aggregate.
- Completed: define and implement the first safe quest-to-log matching rule: hydration auto-completes only the assigned water quest after the server-side daily water aggregate reaches 1000 ml.
- Completed: choose sleep/recovery as the next MVP logging slice and prepare `supabase/migrations/0004_sleep_logging.sql` plus `npm run verify:supabase:sleep`.
- Completed: verify the live `sleep_logs` table.
- Completed: implement `/api/sleep-logs` with Telegram validation, server-derived ownership, and `client_event_id` idempotency.
- Completed: add Home sleep quick-log and today's sleep aggregate.
- Completed: choose meal/nutrition as the next MVP logging slice after water, workout, and sleep.
- Completed: prepare `supabase/migrations/0005_meal_logging.sql` and `npm run verify:supabase:meal`.
- Completed: verify the live `meal_logs` table and anon insert blocking.
- Completed: harden water, workout, and sleep log routes so unknown client fields fail closed before auth or persistence.
- Completed: implement `/api/meal-logs` with Telegram validation, server-derived ownership, strict payload allowlist, and `client_event_id` idempotency.
- Completed: add Home nutrition quick-log and today's meal aggregate.
- Completed: define anti-spam scoring guardrails and deterministic quest-to-log matching rules for future log-based progression effects.
- Completed: add `npm run smoke:telegram` to automate Home and quick-log route smoke testing after a real Telegram `initData` value is captured.
- Completed: add a development-only Telegram runtime card action to copy real Mini App `initData` without rendering the secret on screen.
- Completed: tighten Telegram WebView dev smoke flow so Home exposes `Copy initData` and `Copy initDataUnsafe` only in development, smoke requests use `NEXT_PUBLIC_APP_URL`, and five smoke endpoints accept `x-telegram-init-data` only in development.
- Completed: implement the first post-hydration metadata-driven matcher: workout quick-log can auto-complete only newly seeded Body main quests with explicit `workout_log` metadata and a server-side session threshold.
- Completed: add SDK retry and development-only sanitized Telegram launch diagnostics after Telegram Desktop still showed browser preview.
- Completed: add client hydration, SDK script tag, and document readiness diagnostics after `SDK wait` stayed at `0 checks`.
- Next: reopen the Mini App through Telegram, read the Client/SDK/SDK script/WebApp/initData/tgWebAppData diagnostics, capture fresh `TELEGRAM_TEST_INIT_DATA` if `initData` is present, set `NEXT_PUBLIC_APP_URL=https://flashing-hazelnut-scored.ngrok-free.dev`, run `npm run smoke:telegram`, then choose the next explicit matcher candidate for sleep or meal.
