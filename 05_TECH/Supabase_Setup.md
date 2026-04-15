# Supabase Setup

## Purpose
Supabase setup and backend rules.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Architecture]]
- [[../04_DATA/Database_Schema]]

## Content
Current workspace setup:

- Tracked `.env.example` documents required Supabase variables.
- Ignored `.env.local` is the local place for real Supabase values.
- Ignored `.env.local` currently contains development Supabase URL, anon key, and service role key.
- Browser client setup exists at `src/lib/supabase/client.ts`.
- Connection test route exists at `src/app/api/health/supabase/route.ts` and checks `auth/v1/settings` with the anon key.
- First migration exists at `supabase/migrations/0001_mvp_spine.sql`.

Implementation rules:

- Client uses anon key only.
- Server-side privileged actions use secure environment variables.
- Notification dispatch should use server-side code.
- RLS policies must enforce user ownership.

Foundation migration:

- `profiles`
- `goals`
- `user_paths`
- `daily_quests`
- `quest_completions`
- `weekly_checkins`
- `xp_events`
- `streaks`

Manual setup still required:

- Apply or review the migration in a Supabase development environment.
- Verify `/api/health/supabase` after environment variables are set.
- Rotate the Supabase service role key before production use because it was shared in chat.
