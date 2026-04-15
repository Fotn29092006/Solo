export const APP_CONFIG = {
  internalName: "Solo System RPG",
  publicBrand: "TBD",
  productSurface: "Telegram Mini App",
  notificationSurface: "Telegram Bot",
  mvpTagline: "Earned progression for body, discipline, and mind.",
  supportEmail: "support@solo-system.local"
} as const;

export const MVP_DOMAINS = [
  "body",
  "nutrition",
  "recovery",
  "mind",
  "language"
] as const;

export const ONBOARDING_STEPS = [
  "welcome",
  "basic-profile",
  "goal-selection",
  "path-selection"
] as const;
