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
Manual setup required:

- Create Supabase project.
- Save project URL and anon key.
- Save service role key only in server-side secrets.
- Create migrations.
- Configure RLS.
- Configure storage buckets if body photos are included.
- Document environment variables.

Implementation rules:

- Client uses anon key only.
- Server-side privileged actions use secure environment variables.
- Notification dispatch should use server-side code.
- RLS policies must enforce user ownership.
