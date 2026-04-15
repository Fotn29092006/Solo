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

Deferred:

- Full Bot command handling.
- Notification dispatch.
- Server-side Telegram init data validation.
- Telegram deep-link routing.
