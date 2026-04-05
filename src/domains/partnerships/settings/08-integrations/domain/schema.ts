import { z } from "zod";
import type { Integration } from "./types";

export const IntegrationSchema: z.ZodType<Integration> = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["notion", "google-drive", "google-calendar", "slack"]),
  connected: z.boolean(),
  connectedAt: z.date().optional(),
  permissions: z.array(z.string()),
});

export const IntegrationsSchema = z.array(IntegrationSchema);

export type IntegrationParsed = z.infer<typeof IntegrationSchema>;

export function parseIntegration(input: unknown): IntegrationParsed {
  return IntegrationSchema.parse(input);
}

export function parseIntegrations(input: unknown): IntegrationParsed[] {
  return IntegrationsSchema.parse(input);
}
