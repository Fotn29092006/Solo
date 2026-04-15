# Next Steps

## Purpose
Immediate working plan for the next sessions.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-16

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

Wire the foundation runtime into real Telegram and Supabase flows.

Next tasks:

1. Apply the MVP spine migration through Supabase Dashboard SQL editor, or configure Supabase CLI auth/linking and then run the CLI migration path.
2. Run `npm run verify:supabase:mvp` after migration apply and confirm all eight MVP tables return success.
3. Implement a server route that validates Telegram init data and looks up or creates `profiles` by `telegram_user_id`.
4. Wire onboarding structure to create `goals` and `user_paths` through the validated server identity path.
5. Define first real daily quest seed data and XP event write path.
6. Rotate the Telegram Bot token and Supabase service role key before production use.
7. Configure BotFather/Mini App launch URL when the public Mini App URL exists.
8. Finalize exact public app name and MVP domain boundaries.

Current blocker:

- This workspace has Supabase CLI 2.84.2, but it is not linked to the Supabase project and has no CLI access token available. Migration apply cannot be completed from Codex until Dashboard SQL is run manually or CLI authentication/linking is configured.
- A live service-role REST probe on 2026-04-16 returned HTTP 404 for `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- The Level 3 parallel workstreams for Telegram identity and onboarding are recorded in `07_TASKS/Parallel_Workstreams.md`, but all implementation streams are blocked until `npm run verify:supabase:mvp` passes.

Do not change:

- Non-negotiables.
- Telegram-first direction.
- Five-domain progression model.
- Rule that XP and stats must be tied to real behavior.
