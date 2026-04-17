# Next Steps

## Purpose
Immediate working plan for the next sessions.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[04_Current_State]]
- [[03_Roadmap]]
- [[06_Graph_Memory_Protocol]]
- [[../07_TASKS/Current_Sprint]]
- [[../07_TASKS/Agent_Workstreams]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[../07_TASKS/Open_Questions]]

## Content
Current milestone: Phase 0 to Phase 1 transition.

Nearest goal:

Validate the live quick-log loop in Telegram, then implement only the safest deterministic log-to-quest matchers that follow the new scoring guardrails.

Next tasks:

1. Open the Mini App inside Telegram and use the development-only `Copy initData` action to capture fresh `TELEGRAM_TEST_INIT_DATA`; store it only in ignored `.env.local`.
2. Set `NEXT_PUBLIC_APP_URL=https://flashing-hazelnut-scored.ngrok-free.dev` locally and run `npm run smoke:telegram` to smoke-test Home hydration quest sync, workout quick-log, sleep quick-log, and meal quick-log.
3. Keep sleep and meal quest auto-completion disabled until runtime matchers use explicit metadata and aggregate thresholds from `04_DATA/Domain_Score_Logic.md`.
4. Implement the next matcher only for simple explicitly seeded quests, such as sleep duration target or meal-log count/type; do not match broad titles/domains.
5. Keep rank, standalone streaks, domain scores, penalties, and bot notifications disabled for raw logs until daily caps and rolling aggregate scoring are implemented.
6. Rotate the Telegram Bot token and Supabase service role key before production use.
7. Configure BotFather/Mini App launch URL when the public Mini App URL exists.
8. Finalize exact public app name and MVP domain boundaries.

Current blocker:

- This workspace has Supabase CLI 2.84.2, but it is not linked to the Supabase project and has no CLI access token available. Future migration apply cannot be completed from Codex until Dashboard SQL is run manually or CLI authentication/linking is configured.
- `SUPABASE_ACCESS_TOKEN` is not present in the current process environment.
- The MVP spine DB gate passes.
- The water logging DB gate passes.
- The workout logging DB gate passes.
- The sleep logging DB gate passes.
- The meal logging DB gate passes.
- Anti-spam scoring and deterministic matching guardrails are now documented, but real Telegram smoke testing is still external to this terminal session.
- Telegram quick-log smoke tooling exists, but a fresh valid `TELEGRAM_TEST_INIT_DATA` value is still required for a real passing smoke run.
- Future migrations still need Dashboard SQL or authenticated Supabase CLI workflow before runtime writes are implemented.

Do not change:

- Non-negotiables.
- Telegram-first direction.
- Five-domain progression model.
- Rule that XP and stats must be tied to real behavior.
