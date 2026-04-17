# Architecture

## Purpose
Technical architecture direction.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Telegram_Integration]]
- [[Supabase_Setup]]

## Content
Runtime stack:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Vitest for TypeScript unit tests.
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
- `/onboarding`: Telegram-first onboarding flow for starting target, MVP goal, and path selection.
- `/api/health/supabase`: server-side Supabase REST reachability check using public anon configuration.
- `/api/auth/telegram`: server-side Telegram Mini App init-data validation plus profile lookup/create.
- `/api/home`: server-side Home state route that validates Telegram init data, derives `profile_id`, reads active goal/path/streaks, and seeds today's MVP daily quest package when missing.
- `/api/onboarding`: server-side onboarding persistence for `goals` and `user_paths` after Telegram validation.
- `/api/quests/complete`: server-side daily quest completion route that validates Telegram init data, verifies quest ownership, writes `quest_completions`, writes `xp_events`, syncs profile XP/level, and updates the daily quest streak when the full package is complete.
- `/api/weekly-checkin`: server-side current-week review route that validates Telegram init data, derives `profile_id`, reads or upserts the current weekly check-in, and updates the weekly review streak.
- `/api/water-logs`: server-side hydration logging route that validates Telegram init data, derives `profile_id`, writes idempotent water logs by `client_event_id`, and returns today's hydration aggregate.
- `/api/workout-logs`: server-side workout logging route that validates Telegram init data, derives `profile_id`, writes idempotent session logs by `client_event_id`, and returns today's workout aggregate.
- `/api/sleep-logs`: server-side sleep logging route that validates Telegram init data, derives `profile_id`, writes idempotent sleep logs by `client_event_id`, and returns today's sleep aggregate without progression side effects.
- `/api/meal-logs`: server-side meal logging route that validates Telegram init data, derives `profile_id`, enforces a fail-closed payload allowlist, writes idempotent meal logs by `client_event_id`, and returns today's meal aggregate without progression side effects.

Trust boundary:

- Telegram Mini App client data is not trusted for persistence.
- The server validates raw Telegram `initData` before deriving identity.
- `profiles.telegram_user_id` is the external Telegram identity binding.
- `profiles.id` is the internal app profile identity.
- Server routes must derive `profile_id` from validated Telegram identity.
- Direct client writes to user-owned Supabase tables are deferred until a Supabase Auth/JWT and RLS strategy exists.

Test coverage:

- Telegram Mini App init-data validation has unit coverage for valid signatures, tampering, missing hash, stale/future auth dates, missing bot token, malformed user JSON, and bot users.
- Telegram profile identity mapping has unit coverage for safe profile upsert shape and API identity mapping.
- Route-level API coverage exists for onboarding, Home, quest completion, and weekly check-in contracts.
- Route-level API coverage exists for the water logging contract.
- Route-level API coverage exists for the workout logging contract.
- Route-level API coverage exists for the sleep logging contract and Home sleep aggregate resilience.
- Route-level API coverage exists for strict unknown-field rejection in water, workout, and sleep logging routes.
- Route-level API coverage exists for the meal logging contract and Home meal aggregate resilience.

Deferred:

- shadcn/ui, Framer Motion, Zustand, React Hook Form, Zod, and Recharts are not installed yet because the current pass is runtime foundation only.
