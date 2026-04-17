# Solo System RPG

## DEV TESTING

1. Run the Telegram-compatible dev server: `npm run dev`.
2. Run ngrok for the local dev port: `ngrok http 3000`.
3. Open the Mini App inside Telegram.
4. Press `Copy initDataUnsafe` for development debugging only.
5. Press `Copy initData`, then paste the real auth token into ignored `.env.local` as `TELEGRAM_TEST_INIT_DATA=<copied from Telegram WebView>`.
6. Set `NEXT_PUBLIC_APP_URL=https://flashing-hazelnut-scored.ngrok-free.dev` in `.env.local`.
7. Run `npm run smoke:telegram`.

If auth fails with `stale_auth_date`, reopen the Mini App inside Telegram and press `Copy initData` again to refresh `TELEGRAM_TEST_INIT_DATA`.

`npm run dev` uses the webpack dev server because Telegram Desktop WebView may not hydrate the Turbopack dev bundle reliably. Use `npm run dev:turbo` only for ordinary browser preview work.
