import { z } from "zod";
import type { PipelineOpsOverview, SubmitClientPayload, SubmitClientResponse } from "./types";

export const PipelineStageSchema = z.enum(["prospect", "qualified", "proposal", "negotiation", "won", "lost"]);
export const ProspectLifecycleStatusSchema = z.enum(["potential", "onboarded", "active", "complete"]);

export const ProspectSummarySchema = z.object({
  id: z.string(),
  company: z.string(),
  contactName: z.string(),
  contactEmail: z.string().email(),
  nextAction: z.string().optional(),
  confidence: z.number().min(0).max(1),
  stage: z.union([z.literal("prospect"), z.literal("qualified")]),
  status: ProspectLifecycleStatusSchema,
  owner: z.string(),
  tags: z.array(z.string()),
  updatedAt: z.string(),
});

export const DealSummarySchema = z.object({
  id: z.string(),
  company: z.string(),
  amount: z.number().nonnegative(),
  stage: PipelineStageSchema,
  agingDays: z.number().nonnegative(),
  lastActivityAt: z.string(),
  health: z.enum(["on_track", "risk", "stalled"]),
  owner: z.string(),
});

export const RecruitmentInviteSchema = z.object({
  id: z.string(),
  partnerName: z.string(),
  email: z.string().email(),
  status: z.enum(["sent", "accepted", "pending", "inactive"]),
  rewardShareBps: z.number().nonnegative(),
  sentAt: z.string(),
});

export const SubmitClientPayloadSchema = z.object({
  companyName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  website: z.string().url().optional(),
  socialLink: z.string().url().optional(),
  dealSizeEstimate: z.number().nonnegative(),
  notes: z.string().optional(),
  vertical: z.string().min(1),
});

export const SubmitClientResponseSchema = z.object({
  intakeId: z.string(),
  status: z.enum(["received", "needs_review"]),
  estimatedSlaHrs: z.number().positive(),
});

export const PipelineOpsOverviewSchema = z.object({
  prospects: z.array(ProspectSummarySchema),
  activeDeals: z.array(DealSummarySchema),
  recruitment: z.array(RecruitmentInviteSchema),
});

export function parseSubmitClientPayload(data: unknown): SubmitClientPayload {
  return SubmitClientPayloadSchema.parse(data);
}

export function parseSubmitClientResponse(data: unknown): SubmitClientResponse {
  return SubmitClientResponseSchema.parse(data);
}

export function parsePipelineOverview(data: unknown): PipelineOpsOverview {
  return PipelineOpsOverviewSchema.parse(data);
}

export type ParsedPipelineStage = z.infer<typeof PipelineStageSchema>;
export type ParsedProspectLifecycle = z.infer<typeof ProspectLifecycleStatusSchema>;
