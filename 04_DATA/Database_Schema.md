# Database Schema

## Purpose
Working schema notes for Supabase/Postgres.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Data_Model_Overview]]
- [[../05_TECH/Supabase_Setup]]

## Content
Schema is not finalized.

Current foundation migration:

- `supabase/migrations/0001_mvp_spine.sql`

Current MVP spine tables:

- `profiles`: Telegram identity binding, display name, level, XP, and rank key.
- `goals`: selected user goals.
- `user_paths`: selected progression path.
- `daily_quests`: assigned daily quest records.
- `quest_completions`: completion records for daily quests.
- `weekly_checkins`: weekly weigh-in and reflection inputs.
- `xp_events`: append-style XP history.
- `streaks`: current and best streak counters.

Every user-owned table must have an RLS strategy before production.

Deferred tables:

- Workout logs.
- Water logs.
- Nutrition logs.
- Notification dispatch logs.
- Achievements.
- Domain score derivations.
