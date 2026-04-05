import { z } from "zod";
import type { Opportunity, TimelineStage } from "../data/earningsOverview";

export const OverviewSummarySchema = z.object({
  monthToDatePayouts: z.string(),
  qoqDelta: z.string(),
  nextPayoutDate: z.string(),
  projectedCycle: z.string(),
  pendingReviews: z.string(),
  avgDealSize: z.string(),
});

export const TimelineStageSchema = z.object({
  id: z.string(),
  label: z.string(),
  count: z.number().int().nonnegative(),
  sla: z.string(),
});

export const OpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  reward: z.string(),
  deadline: z.string(),
});

export const QuickActionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export function parseOverviewSummary(data: unknown) {
  return OverviewSummarySchema.parse(data);
}

export function parseTimelineStages(data: unknown): TimelineStage[] {
  return z.array(TimelineStageSchema).parse(data);
}

export function parseOpportunities(data: unknown): Opportunity[] {
  return z.array(OpportunitySchema).parse(data);
}

export function parseQuickActions(data: unknown) {
  return z.array(QuickActionSchema).parse(data);
}
