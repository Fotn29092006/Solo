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

1. Add Supabase URL and anon key to ignored `.env.local`, then verify `/api/health/supabase` against the live project.
2. Apply or review `supabase/migrations/0001_mvp_spine.sql` in a Supabase development environment.
3. Implement server-side Telegram init data validation before trusting Telegram user data.
4. Wire onboarding structure to create `profiles`, `goals`, and `user_paths`.
5. Define first real daily quest seed data and XP event write path.
6. Rotate the Telegram Bot token before production use.
7. Finalize exact public app name and MVP domain boundaries.

Do not change:

- Non-negotiables.
- Telegram-first direction.
- Five-domain progression model.
- Rule that XP and stats must be tied to real behavior.
