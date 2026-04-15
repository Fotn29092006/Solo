# Env Variables

## Purpose
Environment variable inventory.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

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

Never commit real secrets.

Workspace files:

- `.env.example` is tracked and contains empty placeholders.
- `.env.local` is ignored and stores local development values.

Current runtime usage:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the Supabase health route and browser client.
- `TELEGRAM_BOT_TOKEN` is present locally for development but must be rotated before production because it was shared in chat.
- `SUPABASE_SERVICE_ROLE_KEY` must not be used in client-side modules.
