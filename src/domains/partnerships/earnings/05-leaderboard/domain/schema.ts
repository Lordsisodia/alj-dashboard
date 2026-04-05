import { z } from "zod";
import type { LeaderboardEntry } from "../data/leaderboard";

export const LeaderboardEntrySchema = z.object({
  rank: z.number().int().positive(),
  name: z.string(),
  metricLabel: z.string(),
  metricValue: z.number(),
  trend: z.enum(["up", "down", "flat"]),
  region: z.string().optional(),
});

export const LeaderboardHighlightSchema = z.object({
  topPerformer: z.string(),
  fastestMover: z.string(),
  biggestDeal: z.string(),
});

export function parseLeaderboardEntries(data: unknown): LeaderboardEntry[] {
  return z.array(LeaderboardEntrySchema).parse(data);
}

export function parseLeaderboardHighlights(data: unknown) {
  return LeaderboardHighlightSchema.parse(data);
}
