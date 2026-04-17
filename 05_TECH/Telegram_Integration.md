# Telegram Integration

## Purpose
Telegram Mini App and Bot integration notes.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Architecture]]
- [[Supabase_Setup]]

## Content
Telegram surfaces:

- Mini App launch from bot button.
- Reminder links.
- Future command flows if needed.

Current Mini App foundation:

- `npm run dev` uses the webpack dev server for Telegram WebView compatibility; `npm run dev:turbo` is reserved for ordinary browser preview work.
- Telegram WebApp script is loaded in `src/app/layout.tsx`.
- WebApp detection and initialization live in `src/features/telegram/hooks/useTelegramWebApp.ts`.
- The WebApp hook waits briefly for the Telegram SDK to become available before falling back to browser preview mode.
- Safe area and viewport handling live in `src/lib/telegram/web-app.ts`.
- Telegram runtime/user preview is shown by `src/features/telegram/components/TelegramStatusCard.tsx`.
- Raw Telegram `initData` is exposed to client flows through `src/features/telegram/hooks/useTelegramWebApp.ts` for server submission only.
- Server-side init-data validation utilities live in `src/lib/telegram/server.ts`.
- Profile lookup/create helpers live in `src/lib/telegram/profile-identity.ts`.
- Telegram auth/profile route exists at `src/app/api/auth/telegram/route.ts`.
- Home state and daily quest seed route exists at `src/app/api/home/route.ts`.
- Onboarding persistence route exists at `src/app/api/onboarding/route.ts`.
- Quest completion route exists at `src/app/api/quests/complete/route.ts`.
- Water logging route exists at `src/app/api/water-logs/route.ts`.
- Workout logging route exists at `src/app/api/workout-logs/route.ts`.
- Sleep logging route exists at `src/app/api/sleep-logs/route.ts`.
- Meal logging route exists at `src/app/api/meal-logs/route.ts`.
- Telegram quick-log smoke tooling exists at `scripts/smoke-telegram-quick-logs.mjs` and runs through `npm run smoke:telegram`.
- Development-only smoke auth header handling lives in `src/lib/telegram/request-init-data.ts`; it accepts `x-telegram-init-data` only when `NODE_ENV === "development"`.

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

Server validation and profile binding:

- Route: `POST /api/auth/telegram`.
- Request body: `{ "initData": "<Telegram WebApp initData string>" }`.
- The route validates the HMAC-SHA256 hash using `TELEGRAM_BOT_TOKEN`.
- The route rejects missing, malformed, stale, or invalid init data.
- The route looks up or creates `profiles` by validated Telegram user ID.
- The route returns a safe validation result, identity hint, and internal profile identity.

Onboarding persistence:

- Route: `POST /api/onboarding`.
- Request body: raw Telegram `initData`, MVP `goalType`, optional `targetValue`, and MVP `pathKey`.
- The route validates Telegram init data, derives `profile_id`, then writes `goals` and `user_paths`.
- The route rejects client-supplied ownership fields by not accepting `profile_id` in the request body.

Home state:

- Route: `POST /api/home`.
- Request body: raw Telegram `initData`.
- The route validates Telegram init data, derives `profile_id`, returns profile status, reads active goal/path, and seeds the current daily quest package if no quests exist for today.
- The route does not accept client-supplied `profile_id`, XP, rank, or quest ownership fields.

Quest completion:

- Route: `POST /api/quests/complete`.
- Request body: raw Telegram `initData` and `questId`.
- The route validates Telegram init data, derives `profile_id`, verifies the quest belongs to that profile, and completes only assigned quests.
- XP is derived from the stored quest reward, not the client request.
- Repeated completion attempts are idempotent and do not award XP again.
- When all quests for the date are completed, the route updates the `daily_quest` streak from server-owned state.
- The client receives the updated daily quest streak summary and renders it on Home.

Weekly check-in:

- Route: `POST /api/weekly-checkin`.
- Read request body: raw Telegram `initData`.
- Write request body: raw Telegram `initData`, MVP weekly scores, optional weight, and optional reflection.
- The route validates Telegram init data, derives `profile_id`, computes the current week on the server, and reads or upserts one `weekly_checkins` row for that week.
- The route rejects client-supplied ownership and week fields by not using trusted `profile_id` or `weekStartDate` from the request body.
- The MVP `summary` is generated server-side.
- A successful write updates the `weekly_review` streak once per week.
- Home renders a compact weekly review card from `/api/home` state and submits through this route.

Water logging:

- Route: `POST /api/water-logs`.
- Request body: raw Telegram `initData`, `amountMl`, `clientEventId`, and optional note.
- The route validates Telegram init data, derives `profile_id`, and writes `water_logs`.
- `clientEventId` is required for idempotency; repeated taps with the same event ID return the existing log instead of creating a duplicate.
- The route rejects client-supplied ownership and date fields by not using trusted `profile_id`, `telegram_user_id`, `loggedAt`, or `loggedDate` from the request body.
- The route rejects unknown top-level request fields; clients may send only the documented payload keys.
- Home renders a compact hydration quick-log card from `/api/home` state and submits through this route.
- If the server-side daily hydration aggregate reaches at least 1000 ml, the water route can auto-complete the assigned hydration quest and returns the quest sync result to Home.
- Home updates the existing Daily quests list and keeps the feedback inside the hydration card; no Bot notification or extra screen is introduced for this MVP sync.

Workout logging:

- Route: `POST /api/workout-logs`.
- Request body: raw Telegram `initData`, `workoutType`, `clientEventId`, optional `workoutName`, optional `durationMin`, optional `rpe`, and optional note.
- The route validates Telegram init data, derives `profile_id`, and writes `workout_logs`.
- `clientEventId` is required for idempotency; repeated taps with the same event ID return the existing log instead of creating a duplicate.
- The route rejects client-supplied ownership, date, XP, rank, and streak fields by not using trusted `profile_id`, `telegram_user_id`, `loggedAt`, `loggedDate`, XP, rank, or streak values from the request body.
- The route rejects unknown top-level request fields; clients may send only the documented payload keys.
- Home renders a compact workout quick-log card from `/api/home` state and submits through this route.
- If the server-side daily workout aggregate reaches the metadata threshold, the workout route can auto-complete only an explicitly metadata-seeded Body main quest and returns the quest sync result to Home.
- Home updates the existing Daily quests list and keeps feedback inside the workout card; no Bot notification, rank update, or standalone workout streak is introduced for this MVP sync.

Sleep logging:

- Route: `POST /api/sleep-logs`.
- Request body: raw Telegram `initData`, `clientEventId`, `sleepDurationMin`, optional `sleepQuality`, optional `morningEnergy`, and optional note.
- The route validates Telegram init data, derives `profile_id`, and writes `sleep_logs`.
- `clientEventId` is required for idempotency; repeated taps with the same event ID return the existing log instead of creating a duplicate.
- The route rejects client-supplied ownership, date, XP, rank, streak, quest, and notification fields by not using trusted `profile_id`, `telegram_user_id`, `loggedAt`, `loggedDate`, XP, rank, streak, quest, or notification values from the request body.
- The route rejects unknown top-level request fields; clients may send only the documented payload keys.
- Home renders a compact sleep quick-log card from `/api/home` state and submits through this route.
- The route does not award XP, mutate rank/streaks, complete quests, or send Telegram notifications.
- Sleep reminders remain future bot/scheduler work, not a side effect of sleep log writes.

Meal logging:

- Route: `POST /api/meal-logs`.
- Request body: raw Telegram `initData`, `clientEventId`, `mealType`, optional `mealName`, optional `calories`, optional `proteinG`, and optional note.
- The route validates Telegram init data, derives `profile_id`, and writes `meal_logs`.
- The route rejects unknown top-level request fields; clients may send only the documented payload keys.
- `clientEventId` is required for idempotency; repeated taps with the same event ID return the existing log instead of creating a duplicate.
- Home renders a compact nutrition quick-log card from `/api/home` state and submits through this route.
- The route does not award XP, mutate rank/streaks, complete quests, or send Telegram notifications.
- Meal reminders remain future bot/scheduler work, not a side effect of meal log writes.

Telegram smoke testing:

- Manual WebView smoke remains required before production because terminal tests cannot prove Telegram WebView layout, launch, or `initData` delivery.
- `npm run smoke:telegram` can automate the server-side part after a real `initData` value is captured from Telegram.
- Required local variables: `TELEGRAM_TEST_INIT_DATA` and `NEXT_PUBLIC_APP_URL`.
- The smoke script reads `.env.local` or process environment values and never prints the raw `initData`.
- The smoke script sends `TELEGRAM_TEST_INIT_DATA` only as the `x-telegram-init-data` request header, never as a JSON body field.
- The smoke script sends `ngrok-skip-browser-warning: true` to avoid ngrok browser-warning interception during automated HTTP requests.
- The smoke script calls `/api/home`, `/api/water-logs`, `/api/workout-logs`, `/api/sleep-logs`, and `/api/meal-logs` with minimal valid JSON payloads.
- The smoke script creates real development log rows for the Telegram profile and should not be run against production data.
- In development mode, `TelegramStatusCard` always shows a Telegram debug block with `Copy initData` and `Copy initDataUnsafe`.
- `Copy initData` reads `window.Telegram.WebApp.initData` at click time, copies the raw value, and renders only a masked preview with the first 80 characters and field-presence flags.
- `Copy initDataUnsafe` copies `window.Telegram.WebApp.initDataUnsafe` JSON for debugging only and must not be used for auth.
- The development debug block also shows sanitized launch diagnostics only: SDK availability, WebApp object availability, `initData` presence, `tgWebAppData` launch-param presence/source, platform/version param presence, unsafe user presence, and SDK wait attempts.
- The development diagnostics also show whether the client effect is active, whether the Telegram SDK script tag is present, and the document readiness state; this helps distinguish missing Telegram launch context from client-side hydration not running.
- The diagnostics never render raw URL launch parameters or raw `initData`.
- If the debug block shows SDK/WebApp available but `tgWebAppData` and `initData` missing, the page was opened without Telegram launch context, usually through a normal browser preview, a plain URL, or an interstitial/redirect that stripped the Telegram launch hash.
- In production builds, the Telegram debug block is not rendered.

How to get local `TELEGRAM_TEST_INIT_DATA`:

1. Start the app, expose it with ngrok, and open it through the Telegram bot Mini App button.
2. Use the development-only `Copy initData` action in the Telegram runtime card.
3. Put the value in ignored `.env.local` as `TELEGRAM_TEST_INIT_DATA=...`.
4. Put the public dev URL in ignored `.env.local` as `NEXT_PUBLIC_APP_URL=https://flashing-hazelnut-scored.ngrok-free.dev`.
5. Run `npm run smoke:telegram`.
6. If auth fails with `stale_auth_date`, reopen the Mini App inside Telegram and copy `initData` again.

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
- Telegram deep-link routing.
