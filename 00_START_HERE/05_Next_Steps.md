# Next Steps

## Purpose
Immediate working plan for the next sessions.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

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

1. Choose and execute the first migration apply path: Supabase Dashboard SQL editor or Supabase CLI link/db push.
2. Verify the eight MVP tables exist after migration apply.
3. Add automated tests for Telegram init-data validation before using it for profile creation.
4. Implement a server route that validates Telegram init data and looks up or creates `profiles` by `telegram_user_id`.
5. Wire onboarding structure to create `goals` and `user_paths` through the validated server identity path.
6. Define first real daily quest seed data and XP event write path.
7. Rotate the Telegram Bot token and Supabase service role key before production use.
8. Configure BotFather/Mini App launch URL when the public Mini App URL exists.
9. Finalize exact public app name and MVP domain boundaries.

Do not change:

- Non-negotiables.
- Telegram-first direction.
- Five-domain progression model.
- Rule that XP and stats must be tied to real behavior.
