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
- Use RLS for user-owned records.
- Keep secrets out of client bundles.
- Log notification dispatch safely.
- Treat body photos and health data as sensitive.
