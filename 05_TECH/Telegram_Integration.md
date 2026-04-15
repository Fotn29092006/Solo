# Telegram Integration

## Purpose
Telegram Mini App and Bot integration notes.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Architecture]]
- [[Supabase_Setup]]

## Content
Telegram surfaces:

- Mini App launch from bot button.
- Reminder links.
- Future command flows if needed.

Current Mini App foundation:

- Telegram WebApp script is loaded in `src/app/layout.tsx`.
- WebApp detection and initialization live in `src/features/telegram/hooks/useTelegramWebApp.ts`.
- Safe area and viewport handling live in `src/lib/telegram/web-app.ts`.
- Telegram runtime/user preview is shown by `src/features/telegram/components/TelegramStatusCard.tsx`.
- Server-side init-data validation utilities live in `src/lib/telegram/server.ts`.
- Minimal validation route exists at `src/app/api/auth/telegram/route.ts`.

Bot notification types:

- Daily quests available.
- Daily reminder.
- Meal, water, workout, and sleep reminders.
- Weekly weigh-in request.
- Weekly review ready.
- Streak at risk.
- Achievement unlocked.
- Level up and rank up.
- Mission failed or incomplete.
- Personalized insight.

Security notes:

- Bot token must never be shipped to the client.
- Validate Telegram Mini App init data on the server.
- Store Telegram user ID as identity binding.
- Do not trust `initDataUnsafe` for persistence or profile ownership.
- Do not accept trusted `profile_id` from the client.

Server validation scaffold:

- Route: `POST /api/auth/telegram`.
- Request body: `{ "initData": "<Telegram WebApp initData string>" }`.
- The route validates the HMAC-SHA256 hash using `TELEGRAM_BOT_TOKEN`.
- The route rejects missing, malformed, stale, or invalid init data.
- The route returns a safe validation result and identity hint only.
- The route does not create profiles, write onboarding data, or send bot notifications yet.

Safe profile mapping path:

1. Client sends raw `window.Telegram.WebApp.initData` to a server route.
2. Server validates the hash and `auth_date`.
3. Server extracts Telegram user ID from validated init data.
4. Server looks up or creates `profiles` by `profiles.telegram_user_id`.
5. Server derives internal `profile_id` from that lookup.
6. Server uses that derived profile ID for goals, paths, quests, logs, XP, streaks, and check-ins.
7. Client-provided profile ownership fields are ignored or rejected.

Deferred:

- Full Bot command handling.
- Notification dispatch.
- Profile creation from validated Telegram init data.
- Telegram deep-link routing.
