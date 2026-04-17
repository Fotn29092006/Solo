# Bugs

## Purpose
Track bugs and strange behavior.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Current_Sprint]]

## Content
2026-04-16:

- Fixed: `npm run verify:supabase:mvp` could crash with an uncaught `fetch failed` stack trace when Supabase was unreachable.
- Result: the verifier now reports `network_error` per table and exits with a clean non-zero status.
- Resolved: profile/onboarding persistence started after the verifier reached Supabase and all eight MVP tables passed.

2026-04-17:

- Risk recorded: sleep/recovery runtime must not double-count weekly check-in `sleep_score`, must not trust client dates, and must not award XP/streak/quest progress from raw repeated sleep logs.
- Status: resolved by the first sleep runtime slice; `/api/sleep-logs` is log-only, server-owned, and has no XP/streak/quest side effects.
- Risk recorded: current log routes validate expected fields but do not yet reject unknown extra payload fields. Extra client-owned fields are ignored today, but strict allowlist rejection should be added before `/api/meal-logs` because nutrition payloads are likely to expand.
- Status: resolved. Water, workout, sleep, and meal log routes now reject unknown top-level payload fields before Telegram validation or Supabase access.
- Resolved blocker: `npm run verify:supabase:meal` now reaches Supabase, returns HTTP 200 for `meal_logs`, and confirms anon inserts are blocked.
