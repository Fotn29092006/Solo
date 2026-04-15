import type { TelegramInset, TelegramWebApp } from "@/shared/types/telegram";

const DEFAULT_BACKGROUND = "#080a0d";

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
}

export function applyTelegramViewport(webApp: TelegramWebApp) {
  const root = document.documentElement;
  const safeArea = webApp.safeAreaInset ?? {};
  const contentSafeArea = webApp.contentSafeAreaInset ?? {};
  const viewportHeight = webApp.viewportStableHeight || webApp.viewportHeight;

  applyInset(root, "tg-safe-area", safeArea);
  applyInset(root, "tg-content-safe-area", contentSafeArea);

  if (viewportHeight) {
    root.style.setProperty("--app-viewport-height", `${viewportHeight}px`);
  }
}

export function initializeTelegramWebApp(webApp: TelegramWebApp) {
  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor?.(DEFAULT_BACKGROUND);
  webApp.setBackgroundColor?.(DEFAULT_BACKGROUND);
  applyTelegramViewport(webApp);
}

function applyInset(root: HTMLElement, name: string, inset: TelegramInset) {
  root.style.setProperty(`--${name}-top`, `${inset.top ?? 0}px`);
  root.style.setProperty(`--${name}-right`, `${inset.right ?? 0}px`);
  root.style.setProperty(`--${name}-bottom`, `${inset.bottom ?? 0}px`);
  root.style.setProperty(`--${name}-left`, `${inset.left ?? 0}px`);
}
