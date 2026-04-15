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
- [[../07_TASKS/Open_Questions]]

## Content
Current milestone: Phase 0 to Phase 1 transition.

Nearest goal:

Wire the foundation runtime into real Telegram and Supabase flows.

Next tasks:

1. Apply or review `supabase/migrations/0001_mvp_spine.sql` in a Supabase development environment.
2. Implement server-side Telegram init data validation before trusting Telegram user data.
3. Wire onboarding structure to create `profiles`, `goals`, and `user_paths`.
4. Define first real daily quest seed data and XP event write path.
5. Rotate the Telegram Bot token and Supabase service role key before production use.
6. Configure BotFather/Mini App launch URL when the public Mini App URL exists.
7. Finalize exact public app name and MVP domain boundaries.

Do not change:

- Non-negotiables.
- Telegram-first direction.
- Five-domain progression model.
- Rule that XP and stats must be tied to real behavior.
