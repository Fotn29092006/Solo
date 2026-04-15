# Security

## Purpose
Security rules and review points.

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
Primary risks:

- Leaking Telegram Bot token.
- Leaking Supabase service role key.
- Weak Telegram init data validation.
- Missing or broad RLS policies.
- Exposing private body photos.
- Notification spam or accidental sends.

Security baseline:

- Validate auth on server.
- Validate Telegram Mini App init data on the server before profile lookup or writes.
- Treat `window.Telegram.WebApp.initDataUnsafe` as display/debug data only.
- Use RLS for user-owned records.
- Keep secrets out of client bundles.
- Keep `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Server routes using the service role must derive ownership from validated Telegram identity, not request body fields.
- Never trust client-supplied `profile_id`, `telegram_user_id`, XP amount, rank, or ownership fields.
- Log notification dispatch safely.
- Treat body photos and health data as sensitive.

Current trust boundary:

- Trusted identity source: server-validated Telegram init data.
- External identity key: `telegram_user_id`.
- Internal ownership key: `profiles.id`.
- Current MVP data access path: server routes after Telegram validation.
- Direct client access to user-owned tables remains blocked until Supabase Auth/JWT mapping and RLS policies are finalized.
