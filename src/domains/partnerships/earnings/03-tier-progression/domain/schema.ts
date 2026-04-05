import { z } from "zod";
import type {
  TierBenefit,
  TierHistoryEntry,
  TierId,
  TierMetric,
  UnlockMission,
} from "../data/tierProgression";

export const TierIdSchema = z.enum(["Trailblazer", "Builder", "Vanguard", "Apex", "Sovereign"]);
const TierScopeSchema = z.union([TierIdSchema, z.literal("Global")]);

export const TierMetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().nonnegative(),
  target: z.number().positive(),
  helper: z.string(),
});

export const TierBenefitSchema = z.object({
  perk: z.string(),
  tiers: z.object({
    Trailblazer: z.string(),
    Builder: z.string(),
    Vanguard: z.string(),
    Apex: z.string(),
    Sovereign: z.string(),
  }),
});

export const UnlockMissionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  reward: z.string(),
  steps: z.array(z.string()).min(1),
  tiers: z.array(TierScopeSchema).optional(),
});

export const TierHistorySchema = z.object({
  id: z.string(),
  tier: TierIdSchema,
  date: z.string(),
  note: z.string(),
});

export const TierMetaSchema = z.object({
  currentTier: TierIdSchema,
  nextTier: TierIdSchema,
  pointsToNext: z.number().nonnegative(),
  estUpgradeDate: z.string(),
  progressPct: z.number().min(0).max(100),
});

export const TierProgressionSnapshotSchema = z.object({
  meta: TierMetaSchema,
  metrics: z.array(TierMetricSchema),
  benefits: z.array(TierBenefitSchema),
  missions: z.array(UnlockMissionSchema),
  history: z.array(TierHistorySchema),
});

export type TierProgressionSnapshot = z.infer<typeof TierProgressionSnapshotSchema>;

export function parseTierMeta(data: unknown): z.infer<typeof TierMetaSchema> {
  return TierMetaSchema.parse(data);
}

export function parseTierMetrics(data: unknown): TierMetric[] {
  return z.array(TierMetricSchema).parse(data);
}

export function parseTierBenefits(data: unknown): TierBenefit[] {
  return z.array(TierBenefitSchema).parse(data);
}

export function parseUnlockMissions(data: unknown): UnlockMission[] {
  return z.array(UnlockMissionSchema).parse(data);
}

export function parseTierHistory(data: unknown): TierHistoryEntry[] {
  return z.array(TierHistorySchema).parse(data);
}

export function parseTierProgression(data: unknown): TierProgressionSnapshot {
  return TierProgressionSnapshotSchema.parse(data);
}
