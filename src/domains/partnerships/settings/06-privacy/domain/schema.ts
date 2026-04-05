import { z } from "zod";
import type { PrivacySettings, ConsentAuditEntry } from "./types";

const ConsentAuditEntrySchema: z.ZodType<ConsentAuditEntry> = z.object({
  action: z.enum(["consent-granted", "consent-revoked", "export-requested", "data-deleted"]),
  actor: z.string(),
  at: z.date(),
  notes: z.string().optional(),
});

export const PrivacySettingsSchema: z.ZodType<PrivacySettings> = z.object({
  profileVisibility: z.enum(["public", "partners-only", "private"]),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  dataProcessingConsent: z.boolean(),
  marketingConsent: z.boolean(),
  consentAudit: z.array(ConsentAuditEntrySchema).optional(),
});

export type PrivacySettingsParsed = z.infer<typeof PrivacySettingsSchema>;

export function parsePrivacySettings(input: unknown): PrivacySettingsParsed {
  return PrivacySettingsSchema.parse(input);
}
