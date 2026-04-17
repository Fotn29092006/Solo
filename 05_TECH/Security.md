# Security

## Purpose
Security rules and review points.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

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
- Do not use the Supabase service role key as a migration/DDL workaround; schema changes must go through reviewed migration SQL via Dashboard or authenticated Supabase CLI workflow.
- Service-role table-existence checks are allowed only as local/admin verification and must not print secrets or write data.
- Never trust client-supplied `profile_id`, `telegram_user_id`, XP amount, rank, or ownership fields.
- Log notification dispatch safely.
- Treat body photos and health data as sensitive.

Current trust boundary:

- Trusted identity source: server-validated Telegram init data.
- External identity key: `telegram_user_id`.
- Internal ownership key: `profiles.id`.
- Current MVP data access path: server routes after Telegram validation using the Supabase service role key.
- Current write routes derive `profile_id` internally for profile lookup/create, onboarding persistence, daily quest seeding, and quest completion.
- Quest completion XP is derived from server-read `daily_quests.xp_reward`; clients cannot submit XP amounts.
- Daily quest streak counts are calculated from server-owned quest state; clients cannot submit streak values.
- Weekly check-in writes derive `profile_id` and current week on the server; clients cannot choose ownership, week identity, summary, or streak values.
- Water logging writes derive `profile_id` on the server and accept only validated log payload fields such as `amount_ml`, `client_event_id`, and optional note text.
- Water logging does not award XP directly, update rank directly, or update streaks directly.
- Hydration can auto-complete only the assigned hydration daily quest after the server-side daily water aggregate reaches at least 1000 ml for the quest date; XP and daily quest streak effects still flow through the existing quest completion path.
- Hydration auto-complete must not accept client-supplied quest IDs, ownership, dates, XP, rank, or streak values.
- Workout logging writes derive `profile_id` on the server and accept only validated session payload fields such as `workout_type`, `client_event_id`, optional duration/RPE, and optional note text.
- Workout logging must not award direct XP, update rank, update standalone workout streaks, or complete broad/title-matched quests.
- Workout logging may auto-complete only explicitly metadata-seeded Body main quests through the server-side quest completion path, with one completion row per quest and no client-supplied quest or XP fields.
- Sleep logging writes derive `profile_id` on the server and accept only validated log payload fields such as `client_event_id`, `sleep_duration_min`, optional sleep quality, optional morning energy, and optional note text.
- Sleep logging must not award XP, update rank, update streaks, auto-complete quests, or send bot notifications until separate scoring and quest-to-log matching rules are reviewed.
- Sleep data must not be double-counted with weekly check-in `sleep_score`; weekly check-ins remain the subjective review layer, while `sleep_logs` are the daily behavior log layer.
- Water, workout, sleep, and meal logging routes use strict top-level payload allowlists and reject unknown client fields before persistence.
- Log routes must fail closed rather than ignore fields that could imply ownership, dates, XP, rank, streaks, quest completion, scoring, aggregates, or notifications.
- Meal logging writes derive `profile_id` on the server and use a strict payload allowlist before persistence.
- Meal logging must not award XP, update rank, update streaks, auto-complete quests, or send bot notifications until nutrition scoring, anti-spam rules, and deterministic quest matching metadata are reviewed.
- Meal data must not double-count nutrition quest completion or weekly adherence signals; raw meal entries are behavior logs, not direct reward events.
- Telegram smoke tooling must use only captured `TELEGRAM_TEST_INIT_DATA` through public server routes and must not use Supabase service-role credentials, client-supplied ownership fields, or direct table writes.
- `TELEGRAM_TEST_INIT_DATA` is sensitive local test data and must stay in ignored local environment files only.
- The development-only `TelegramStatusCard` debug block may copy raw `initData`, but it must render only a masked preview and must not be available in production builds.
- `initDataUnsafe` may be copied only for local development debugging and must never be used for authentication or server ownership.
- Server routes may accept `x-telegram-init-data` only in `NODE_ENV === "development"` to support smoke tests. Production routes must continue to require body `initData`.
- Smoke requests must not send `initData` as a JSON body field when using the development header flow.
- Direct client access to user-owned tables remains blocked until Supabase Auth/JWT mapping and RLS policies are finalized.
