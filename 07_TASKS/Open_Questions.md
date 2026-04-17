# Open Questions

## Purpose
Questions that must be resolved manually or during planning.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Decisions_Log]]
- [[Backlog]]
- [[../00_START_HERE/05_Next_Steps]]
- [[Canonical_Naming]]

## Content
- What is the final public app name?
- Which domains are mandatory in MVP: all five or a smaller first slice?
- What is the final rank ladder naming?
- What are the final path names?
- What is the target user priority for v1?
- What Telegram Bot username will be used?
- What notification frequency is acceptable?
- Will body photos be in MVP?
- What Supabase region and project naming should be used?
- Which Draft docs must graduate to Active before app scaffolding starts?
- Resolved 2026-04-16: the first Supabase migration was applied outside this workspace, and `npm run verify:supabase:mvp` passed for all eight tables.
- Resolved 2026-04-16: the earlier verifier `network_error` was treated as a connectivity/tooling failure; later verification reached Supabase and all eight MVP tables passed.
- Resolved 2026-04-17: `supabase/migrations/0002_water_logging.sql` has been applied outside this workspace, `npm run verify:supabase:water` passed, and `/api/water-logs` plus Home hydration quick-log were implemented.
- Resolved 2026-04-17: hydration logs can automatically satisfy only the assigned hydration daily quest after the server-side daily water aggregate reaches at least 1000 ml; XP still flows through quest completion, not raw logs.
- Resolved 2026-04-17: `supabase/migrations/0003_workout_logging.sql` has been applied outside this workspace, `npm run verify:supabase:workout` passed, and `/api/workout-logs` plus Home workout quick-log were implemented.
- Resolved 2026-04-17: sleep/recovery is the next MVP logging slice after hydration quest sync and workout quick-log.
- Resolved 2026-04-17: `supabase/migrations/0004_sleep_logging.sql` has been applied outside this workspace, `npm run verify:supabase:sleep` passed, and `/api/sleep-logs` plus Home sleep quick-log were implemented.
- Resolved 2026-04-17: meal/nutrition is the next MVP logging slice after water, workout, and sleep.
- Resolved 2026-04-17: `supabase/migrations/0005_meal_logging.sql` has been applied outside this workspace, `npm run verify:supabase:meal` passed, and `/api/meal-logs` plus Home nutrition quick-log were implemented.
- Resolved 2026-04-17: water/workout/sleep log routes reject unknown payload fields before auth or persistence; meal logging follows the same fail-closed allowlist pattern from day one.
- Resolved 2026-04-17: anti-spam scoring guardrails and deterministic quest-to-log matching rules are documented in [[../04_DATA/Domain_Score_Logic]], [[../03_SYSTEMS/XP_System]], and [[../03_SYSTEMS/Quest_System]].
- Resolved 2026-04-17: Telegram quick-log smoke tooling exists as `npm run smoke:telegram`.
- Resolved 2026-04-17: Telegram smoke tooling now uses required `NEXT_PUBLIC_APP_URL` and development-only `x-telegram-init-data` header fallback for the five smoke endpoints.
- Resolved 2026-04-17: simple workout session-count matching was chosen as the first metadata-driven matcher after hydration; it requires explicit `workout_log` metadata and does not use title/domain fallback.
- Pending 2026-04-17: capture fresh valid `TELEGRAM_TEST_INIT_DATA` from Telegram WebView and run `npm run smoke:telegram` against `https://flashing-hazelnut-scored.ngrok-free.dev`.
- Pending 2026-04-17: choose the next metadata-driven matcher to implement; safest candidates are sleep duration or meal log count/type.
- Pending 2026-04-17: define user-specific nutrition targets before meal/protein logs can affect quality XP, nutrition score, or rank.
