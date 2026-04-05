import { z } from "zod";

export const DashboardSummarySchema = z.object({
  mtdPayout: z.number().nonnegative(),
  qoqDelta: z.number(),
  nextPayoutDate: z.string(),
  projectedCycle: z.number().nonnegative(),
  pendingReviews: z.number().int().nonnegative(),
  avgDealSize: z.number().nonnegative(),
});

export const DashboardTrendSchema = z.object({
  label: z.string(),
  current: z.number(),
  previous: z.number(),
});

export function parseDashboardSummary(data: unknown) {
  return DashboardSummarySchema.parse(data);
}

export function parseDashboardTrends(data: unknown) {
  return z.array(DashboardTrendSchema).parse(data);
}
