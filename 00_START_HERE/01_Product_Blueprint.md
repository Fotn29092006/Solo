# Product Blueprint

## Purpose
Canonical compact product definition extracted from `main.md`.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[00_Project_Index]]
- [[02_Non_Negotiables]]
- [[../01_PRODUCT/Vision]]

## Content
Solo System RPG is an AI-assisted self-development RPG system delivered as a Telegram Mini App plus Telegram Bot notifications.

The user builds a character through real-life actions across five domains:

- Body
- Nutrition
- Recovery
- Mind
- Language

The system tracks actions, evaluates consistency and outcomes, generates adaptive quests, awards XP, calculates levels and ranks, maintains streaks, unlocks achievements, sends Telegram reminders, and creates weekly review summaries.

MVP includes Telegram identity binding, onboarding, profile, goals, quests, logging, XP, levels, ranks, streaks, achievements, Telegram reminders, and weekly review summaries.

Suggested stack:

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- Backend: Supabase, Postgres, Edge Functions if needed.
- Auth: Telegram Mini App auth binding.
- State/forms: Zustand, React Hook Form, Zod.
- Charts: Recharts.
- Notifications: Telegram Bot API.
