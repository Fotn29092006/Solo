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

Initial schema design should prioritize:

- Telegram user identity.
- User profile and goals.
- Quest assignment and completion.
- Logging tables.
- XP events as append-only records.
- Streak and rank derivation.
- Notification queue or dispatch log.

Every user-owned table must have an RLS strategy before production.
