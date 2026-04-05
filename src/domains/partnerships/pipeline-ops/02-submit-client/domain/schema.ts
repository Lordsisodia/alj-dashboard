// @ts-nocheck
import { z } from "zod";
import type { SubmitClientPayload } from "./types";

export const SubmitClientPayloadSchema: z.ZodType<SubmitClientPayload> = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().regex(/^\+?[1-9]\d{7,14}$/).optional(),
  industry: z.string().min(2),
  region: z.string().optional(),
  dealSize: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export type SubmitClientPayloadParsed = z.infer<typeof SubmitClientPayloadSchema>;

export function parseSubmitClientPayload(data: unknown): SubmitClientPayloadParsed {
  return SubmitClientPayloadSchema.parse(data);
}
