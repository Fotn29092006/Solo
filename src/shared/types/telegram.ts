export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface TelegramInset {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  safeAreaInset?: TelegramInset;
  contentSafeAreaInset?: TelegramInset;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  onEvent?: (eventType: "viewportChanged" | "themeChanged", callback: () => void) => void;
  offEvent?: (eventType: "viewportChanged" | "themeChanged", callback: () => void) => void;
}

export type TelegramInitDataValidationStatus =
  | "valid"
  | "missing_bot_token"
  | "missing_init_data"
  | "invalid_init_data"
  | "missing_hash"
  | "invalid_hash"
  | "missing_auth_date"
  | "stale_auth_date"
  | "invalid_user";

export interface TelegramValidatedUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
}

export interface TelegramIdentityHint {
  provider: "telegram";
  telegramUserId: string;
}

export interface TelegramProfileIdentity {
  id: string;
  telegramUserId: string;
  telegramUsername: string | null;
  displayName: string | null;
  level: number;
  totalXp: number;
  rankKey: string;
}

export interface TelegramInitDataValidationResult {
  ok: boolean;
  status: TelegramInitDataValidationStatus;
  user: TelegramValidatedUser | null;
  identity: TelegramIdentityHint | null;
  authDate: string | null;
}

export type TelegramAuthStatus =
  | TelegramInitDataValidationStatus
  | "missing_supabase_config"
  | "profile_upsert_failed";

export interface TelegramAuthResponse {
  ok: boolean;
  status: TelegramAuthStatus;
  user: TelegramValidatedUser | null;
  identity: TelegramIdentityHint | null;
  authDate: string | null;
  profile: TelegramProfileIdentity | null;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
