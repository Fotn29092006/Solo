# Supabase Runtime Notes

## Purpose
Supabase setup notes for the Solo System RPG MVP runtime.

## Current Scope
The foundation migration creates only the MVP data spine:

- profiles
- goals
- user_paths
- daily_quests
- quest_completions
- weekly_checkins
- xp_events
- streaks

Do not add extra tables until the vault docs and MVP scope are updated.

## Environment
Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Never commit real keys.

## First Local Check
After environment variables are configured:

```bash
npm run dev
```

Then open `/api/health/supabase` or the Home screen status panel.
