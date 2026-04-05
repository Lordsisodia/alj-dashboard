import { z } from "zod";
import type { GeneralSettingsData } from "./types";

export const AppearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.enum(["small", "medium", "large", "extra-large"]),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
  hapticsEnabled: z.boolean(),
  customAccentColor: z.string().optional(),
});

export const LanguageSchema = z.object({
  language: z.string().min(2),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.enum(["12h", "24h"]),
  numberFormat: z.string(),
  currency: z.string().min(1),
});

export const NotificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  inApp: z.boolean(),
  categories: z.object({
    deals: z.boolean(),
    messages: z.boolean(),
    tasks: z.boolean(),
    updates: z.boolean(),
    announcements: z.boolean(),
    reminders: z.boolean(),
  }),
  frequency: z.enum(["immediate", "hourly", "daily", "weekly"]),
  quietHours: z
    .object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    })
    .optional(),
});

export const IntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  connected: z.boolean(),
  lastSync: z.date().optional(),
  configuration: z.record(z.any()).optional(),
  permissions: z.array(z.string()),
});

export const GeneralSettingsSchema = z.object({
  appearance: AppearanceSchema,
  language: LanguageSchema,
  notifications: NotificationPreferencesSchema,
  integrations: z.array(IntegrationSchema),
  lastUpdated: z.date(),
  version: z.string(),
  deviceId: z.string(),
});

export type GeneralSettingsParsed = z.infer<typeof GeneralSettingsSchema>;

export function parseGeneralSettings(data: unknown): GeneralSettingsParsed {
  return GeneralSettingsSchema.parse(data);
}
