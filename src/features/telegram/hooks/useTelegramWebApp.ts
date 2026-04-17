"use client";

import { useEffect, useState } from "react";
import {
  applyTelegramViewport,
  getTelegramWebApp,
  initializeTelegramWebApp
} from "@/lib/telegram/web-app";
import type { TelegramUser } from "@/shared/types/telegram";

const WEB_APP_WAIT_MS = 100;
const MAX_WEB_APP_WAIT_ATTEMPTS = 20;
const BROWSER_PLATFORMS = new Set(["", "browser", "unknown"]);

interface TelegramLaunchDiagnostics {
  sdkAvailable: boolean;
  webAppAvailable: boolean;
  hasInitData: boolean;
  hasInitDataUnsafeUser: boolean;
  hasLaunchDataParam: boolean;
  hasLaunchPlatformParam: boolean;
  hasLaunchVersionParam: boolean;
  launchParamSource: "hash" | "search" | "none";
  attempts: number;
}

interface TelegramState {
  isReady: boolean;
  isTelegram: boolean;
  initData: string;
  platform: string;
  version: string;
  user: TelegramUser | null;
  diagnostics: TelegramLaunchDiagnostics;
}

const initialState: TelegramState = {
  isReady: false,
  isTelegram: false,
  initData: "",
  platform: "browser",
  version: "unknown",
  user: null,
  diagnostics: {
    sdkAvailable: false,
    webAppAvailable: false,
    hasInitData: false,
    hasInitDataUnsafeUser: false,
    hasLaunchDataParam: false,
    hasLaunchPlatformParam: false,
    hasLaunchVersionParam: false,
    launchParamSource: "none",
    attempts: 0
  }
};

export function useTelegramWebApp() {
  const [state, setState] = useState<TelegramState>(initialState);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: number | null = null;
    let unsubscribe = () => {};

    function sync(attempts: number) {
      const webApp = getTelegramWebApp();

      if (!webApp) {
        if (attempts < MAX_WEB_APP_WAIT_ATTEMPTS) {
          timeoutId = window.setTimeout(() => sync(attempts + 1), WEB_APP_WAIT_MS);
          return;
        }

        if (!isCancelled) {
          setState({
            ...initialState,
            isReady: true,
            diagnostics: getLaunchDiagnostics(null, attempts)
          });
        }

        return;
      }

      initializeTelegramWebApp(webApp);

      const syncViewport = () => applyTelegramViewport(webApp);

      webApp.onEvent?.("viewportChanged", syncViewport);
      webApp.onEvent?.("themeChanged", syncViewport);

      const updateState = () => {
        const diagnostics = getLaunchDiagnostics(webApp, attempts);

        setState({
          isReady: true,
          isTelegram: isTelegramLaunch(webApp, diagnostics),
          initData: webApp.initData,
          platform: webApp.platform || "unknown",
          version: webApp.version || "unknown",
          user: webApp.initDataUnsafe.user ?? null,
          diagnostics
        });
      };

      updateState();

      unsubscribe = () => {
        webApp.offEvent?.("viewportChanged", syncViewport);
        webApp.offEvent?.("themeChanged", syncViewport);
      };
    }

    sync(0);

    return () => {
      isCancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      unsubscribe();
    };
  }, []);

  return state;
}

function isTelegramLaunch(webApp: NonNullable<ReturnType<typeof getTelegramWebApp>>, diagnostics: TelegramLaunchDiagnostics) {
  return (
    diagnostics.hasInitData ||
    diagnostics.hasInitDataUnsafeUser ||
    diagnostics.hasLaunchDataParam ||
    !BROWSER_PLATFORMS.has((webApp.platform ?? "").toLowerCase())
  );
}

function getLaunchDiagnostics(
  webApp: NonNullable<ReturnType<typeof getTelegramWebApp>> | null,
  attempts: number
): TelegramLaunchDiagnostics {
  const hashParams = getSafeUrlParams("hash");
  const searchParams = getSafeUrlParams("search");
  const hasHashLaunchData = hashParams.has("tgWebAppData");
  const hasSearchLaunchData = searchParams.has("tgWebAppData");
  const launchParamSource = hasHashLaunchData ? "hash" : hasSearchLaunchData ? "search" : "none";

  return {
    sdkAvailable: typeof window !== "undefined" && Boolean(window.Telegram),
    webAppAvailable: Boolean(webApp),
    hasInitData: Boolean(webApp?.initData),
    hasInitDataUnsafeUser: Boolean(webApp?.initDataUnsafe?.user),
    hasLaunchDataParam: hasHashLaunchData || hasSearchLaunchData,
    hasLaunchPlatformParam: hashParams.has("tgWebAppPlatform") || searchParams.has("tgWebAppPlatform"),
    hasLaunchVersionParam: hashParams.has("tgWebAppVersion") || searchParams.has("tgWebAppVersion"),
    launchParamSource,
    attempts
  };
}

function getSafeUrlParams(source: "hash" | "search") {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  const raw = source === "hash" ? window.location.hash.replace(/^#/, "") : window.location.search.replace(/^\?/, "");

  try {
    return new URLSearchParams(raw);
  } catch {
    return new URLSearchParams();
  }
}
