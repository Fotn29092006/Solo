# Env Variables

## Purpose
Environment variable inventory.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-16

## Related Files
- [[Supabase_Setup]]
- [[Telegram_Integration]]

## Content
Expected variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_MINI_APP_URL`

Migration/admin-only variable:

- `SUPABASE_ACCESS_TOKEN` is only for Supabase CLI administrative workflows when using CLI auth in automation. It is not an app runtime variable and must not be committed.

Never commit real secrets.

Workspace files:

- `.env.example` is tracked and contains empty placeholders.
- `.env.local` is ignored and stores local development values.
- `.env.local` currently contains Supabase URL, anon key, service role key, Telegram Bot token, and Telegram Bot username.

Current runtime usage:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the Supabase health route and browser client.
- `TELEGRAM_BOT_TOKEN` is required server-side for Telegram Mini App init-data validation.
- `TELEGRAM_BOT_TOKEN` is present locally for development but must be rotated before production because it was shared in chat.
- `SUPABASE_SERVICE_ROLE_KEY` must not be used in client-side modules.
- `SUPABASE_SERVICE_ROLE_KEY` is reserved for server-side profile/data operations after Telegram identity validation.
- `SUPABASE_SERVICE_ROLE_KEY` is also used by `npm run verify:supabase:mvp` for local admin verification of table existence; the script must never print the key.
- `SUPABASE_SERVICE_ROLE_KEY` must be rotated before production because it was shared in chat.
- `TELEGRAM_MINI_APP_URL` is currently empty locally because no public Mini App launch URL is configured yet.

Verified local status:

- Supabase URL is present in ignored `.env.local`.
- Supabase anon key is present in ignored `.env.local`.
- Supabase service role key is present in ignored `.env.local`.
- Telegram Bot token is present in ignored `.env.local`.
- Telegram Bot username is present in ignored `.env.local`.
- Telegram Mini App URL is not set yet.
- Supabase CLI access token is not available in the current workspace environment, so CLI project listing/linking and migration push are blocked.
