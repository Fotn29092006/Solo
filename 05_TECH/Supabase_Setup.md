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
- Browser client setup exists at `src/lib/supabase/client.ts`.
- Connection test route exists at `src/app/api/health/supabase/route.ts`.
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

- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to ignored `.env.local`.
- Add `SUPABASE_SERVICE_ROLE_KEY` only when server-side privileged operations exist.
- Apply or review the migration in a Supabase development environment.
- Verify `/api/health/supabase` after environment variables are set.
