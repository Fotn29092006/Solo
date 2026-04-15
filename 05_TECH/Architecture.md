# Architecture

## Purpose
Technical architecture direction.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Telegram_Integration]]
- [[Supabase_Setup]]

## Content
Runtime stack:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Framer Motion.
- Supabase and Postgres.
- Zustand.
- React Hook Form.
- Zod.
- Recharts.
- Telegram Bot API.

Architectural rule:

Keep product systems modular. Quest generation, XP, ranks, streaks, notifications, and logs should not become one tangled module.

Current runtime structure:

- `src/app`: Next.js App Router routes, layout, and API route handlers.
- `src/features`: feature-owned UI and hooks.
- `src/components`: shared layout and small reusable UI primitives.
- `src/lib`: platform clients and adapters for Telegram and Supabase.
- `src/config`: app constants, navigation, and public runtime config.
- `src/shared/types`: shared TypeScript types for game, Telegram, and database surfaces.
- `supabase/migrations`: database migrations.

Foundation routes:

- `/`: Home shell with level, XP, daily quest, streak, Telegram runtime, and Supabase status placeholders.
- `/onboarding`: onboarding structure for welcome, basic profile, goal selection, and path selection.
- `/api/health/supabase`: server-side Supabase REST reachability check using public anon configuration.
- `/api/auth/telegram`: server-side Telegram Mini App init-data validation scaffold.

Trust boundary:

- Telegram Mini App client data is not trusted for persistence.
- The server validates raw Telegram `initData` before deriving identity.
- `profiles.telegram_user_id` is the external Telegram identity binding.
- `profiles.id` is the internal app profile identity.
- Server routes must derive `profile_id` from validated Telegram identity.
- Direct client writes to user-owned Supabase tables are deferred until a Supabase Auth/JWT and RLS strategy exists.

Deferred:

- shadcn/ui, Framer Motion, Zustand, React Hook Form, Zod, and Recharts are not installed yet because the current pass is runtime foundation only.
