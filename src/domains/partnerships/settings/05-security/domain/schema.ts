import { z } from "zod";
import type { SecuritySettings, Session } from "./types";

export const SessionSchema: z.ZodType<Session> = z.object({
  id: z.string(),
  device: z.string(),
  location: z.string(),
  lastActive: z.date(),
  current: z.boolean(),
});

export const SecuritySettingsSchema: z.ZodType<SecuritySettings> = z.object({
  twoFactorEnabled: z.boolean(),
  activeSessions: z.array(SessionSchema),
  loginAlerts: z.boolean(),
  recoveryEmail: z.string().email().optional(),
  recoveryPhone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/)
    .optional(),
});

export type SecuritySettingsParsed = z.infer<typeof SecuritySettingsSchema>;

export function parseSecuritySettings(input: unknown): SecuritySettingsParsed {
  return SecuritySettingsSchema.parse(input);
}
