import { z } from "zod";

export const TierSchema = z.object({
  id: z.string(),
  title: z.string(),
  art: z.string().optional(),
});

export const LevelSchema = z.object({
  currentLevel: z.number(),
  currentPoints: z.number(),
  pointsToNextLevel: z.number(),
  nextLevel: z.number(),
  currentTierId: z.string(),
  nextTierId: z.string(),
});

export const CertificateSchema = z.object({
  count: z.number(),
  badges: z.number(),
});

export const XpEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  xp: z.number(),
  when: z.string(),
});

export const ProgressPayloadSchema = z.object({
  level: LevelSchema,
  tiers: z.array(TierSchema),
  xpFeed: z.array(XpEntrySchema),
  certificates: CertificateSchema,
});

export type ProgressPayload = z.infer<typeof ProgressPayloadSchema>;

