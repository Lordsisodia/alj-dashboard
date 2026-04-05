export const SETTINGS_ROUTES = {
  base: "/partners/settings",
  account: "/partners/settings/account",
  notifications: "/partners/settings/account/notifications",
  profile: "/partners/settings/profile",
  devices: "/partners/settings/connected-devices",
  security: "/partners/settings/security",
  privacy: "/partners/settings/privacy",
  legal: "/partners/settings/legal",
  integrations: "/partners/settings/integrations",
} as const;

export type SettingsRouteKey = keyof typeof SETTINGS_ROUTES;
