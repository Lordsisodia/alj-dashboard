import { z } from "zod";
import type {
  AchievementFeedItem,
  BadgeDetail,
  CertificateSummary,
  FeaturedBadge,
  LeaderboardEntry,
  LeaderboardInsight,
  NextUnlock,
} from "../data/earningsAchievements";

export const FeaturedBadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  reward: z.string(),
  criteria: z.string(),
  rarity: z.string(),
});

export const BadgeDetailSchema = FeaturedBadgeSchema.extend({
  status: z.enum(["earned", "in-progress", "locked"]),
  progress: z.number().min(0).max(100).optional(),
  unlockedAt: z.string().optional(),
  featured: z.boolean().optional(),
});

export const LeaderboardInsightSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number().int().nonnegative(),
  name: z.string(),
  metricLabel: z.string(),
  metricValue: z.string(),
  trend: z.string(),
  insights: z.array(LeaderboardInsightSchema).optional(),
  profileId: z.string().optional(),
});

export const AchievementFeedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  timestamp: z.string(),
  tag: z.string(),
});

export const CertificateSummarySchema = z.object({
  issued: z.number().int().nonnegative(),
  inProgress: z.number().int().nonnegative(),
  nextUnlock: z.string(),
  preview: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.enum(["Issued", "In progress", "Unlocked"]),
      issued: z.string().optional(),
    })
  ),
});

export const NextUnlockSchema = z.object({
  id: z.string(),
  label: z.string(),
  requirement: z.string(),
  progress: z.number().min(0).max(100),
  eta: z.string(),
  reward: z.string(),
});

export function parseBadges(data: unknown): BadgeDetail[] {
  return z.array(BadgeDetailSchema).parse(data);
}

export function parseLeaderboard(data: unknown): LeaderboardEntry[] {
  return z.array(LeaderboardEntrySchema).parse(data);
}

export function parseFeedItems(data: unknown): AchievementFeedItem[] {
  return z.array(AchievementFeedItemSchema).parse(data);
}

export function parseCertificateSummary(data: unknown): CertificateSummary {
  return CertificateSummarySchema.parse(data);
}

export function parseNextUnlocks(data: unknown): NextUnlock[] {
  return z.array(NextUnlockSchema).parse(data);
}
