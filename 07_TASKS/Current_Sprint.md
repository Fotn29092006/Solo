# Current Sprint

## Purpose
Near-term sprint focus.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Backlog]]
- [[../00_START_HERE/05_Next_Steps]]

## Content
Sprint goal:

Turn foundation specs into a working Telegram Mini App runtime base.

Tasks:

- Completed: scaffold Next.js App Router runtime with TypeScript and Tailwind CSS.
- Completed: create modular `src` structure for app, features, components, lib, config, and shared types.
- Completed: add Telegram Mini App base detection, init, safe area handling, and user data read path.
- Completed: add Supabase client setup and `/api/health/supabase` connection test route.
- Completed: add Supabase development env values to ignored `.env.local`.
- Completed: verify Supabase anon key against the Auth settings endpoint.
- Completed: draft MVP Supabase spine migration with only the eight foundation tables.
- Next: apply or review the MVP spine migration in Supabase.
- Next: implement server-side Telegram init data validation.
- Next: wire onboarding writes for profile, goal, and path.
