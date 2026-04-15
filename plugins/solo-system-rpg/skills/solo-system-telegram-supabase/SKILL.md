---
name: solo-system-telegram-supabase
description: Use for Telegram Mini App, Telegram Bot, Supabase, Postgres, RLS, Edge Functions, and notification work in Solo System RPG.
---

# Telegram and Supabase Skill

## Telegram Product Rules

- Treat Telegram as a core surface, not a bolt-on channel.
- Mini App is the main UI.
- Bot is the reminder, trigger, and notification layer.
- Optimize flows for quick open, quick log, quick complete, and quick review.
- Notification copy must be short, sharp, and system-like.

## Supabase Rules

- Design schema around real product events: logs, quest assignments, completions, XP events, streaks, ranks, notifications, and weekly check-ins.
- Every user-owned table must have row level security planned before production use.
- Prefer migrations and typed data contracts over manual dashboard-only changes.
- Store Telegram IDs carefully.
- Do not expose bot tokens, service-role keys, or private secrets to the client.
- Use server-side code for privileged operations such as notification dispatch, bot API calls, and admin aggregation.

## Recommended Task Flow

1. Read `00_START_HERE/06_Graph_Memory_Protocol.md`.
2. Read `05_TECH/Telegram_Integration.md`.
3. Read `05_TECH/Supabase_Setup.md`.
4. Read `05_TECH/Security.md`.
5. Read `04_DATA/Data_Model_Overview.md`.
6. Read `04_DATA/Database_Schema.md`.
7. Read the current milestone and task file.
8. Define acceptance criteria before coding.
