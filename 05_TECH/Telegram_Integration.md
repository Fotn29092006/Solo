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
