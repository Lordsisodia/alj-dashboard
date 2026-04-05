import { z } from "zod";
import type { LegalDocumentId, LegalDocumentMeta, LegalSettings } from "./types";

export const LegalDocumentIdSchema: z.ZodType<LegalDocumentId> = z.enum([
  "terms",
  "partner-agreement",
  "commission-terms",
  "service-level-agreement",
  "cookie-tracking-policy",
  "updates-changes-policy",
  "compliance-regulatory",
]);

export const LegalDocumentMetaSchema: z.ZodType<LegalDocumentMeta> = z.object({
  id: LegalDocumentIdSchema,
  title: z.string(),
  description: z.string(),
  href: z.string(),
  status: z.string(),
  lastUpdated: z.date().optional(),
  requiresAcknowledgement: z.boolean().optional(),
  version: z.string(),
});

export const LegalSettingsSchema: z.ZodType<LegalSettings> = z.object({
  documents: z.array(LegalDocumentMetaSchema).nonempty(),
  highlightedIds: z.array(LegalDocumentIdSchema).optional(),
});

export type LegalSettingsParsed = z.infer<typeof LegalSettingsSchema>;

export function parseLegalSettings(input: unknown): LegalSettingsParsed {
  return LegalSettingsSchema.parse(input);
}
