"use client";

import { useEffect, useState } from "react";
import {
  applyTelegramViewport,
  getTelegramWebApp,
  initializeTelegramWebApp
} from "@/lib/telegram/web-app";
import type { TelegramUser } from "@/shared/types/telegram";

interface TelegramState {
  isReady: boolean;
  isTelegram: boolean;
  initData: string;
  platform: string;
  version: string;
  user: TelegramUser | null;
}

const initialState: TelegramState = {
  isReady: false,
  isTelegram: false,
  initData: "",
  platform: "browser",
  version: "unknown",
  user: null
};

export function useTelegramWebApp() {
  const [state, setState] = useState<TelegramState>(initialState);

  useEffect(() => {
    const webApp = getTelegramWebApp();

    if (!webApp) {
      setState({ ...initialState, isReady: true });
      return;
    }

    initializeTelegramWebApp(webApp);

    const syncViewport = () => applyTelegramViewport(webApp);

    webApp.onEvent?.("viewportChanged", syncViewport);
    webApp.onEvent?.("themeChanged", syncViewport);

    setState({
      isReady: true,
      isTelegram: true,
      initData: webApp.initData,
      platform: webApp.platform,
      version: webApp.version,
      user: webApp.initDataUnsafe.user ?? null
    });

    return () => {
      webApp.offEvent?.("viewportChanged", syncViewport);
      webApp.offEvent?.("themeChanged", syncViewport);
    };
  }, []);

  return state;
}
