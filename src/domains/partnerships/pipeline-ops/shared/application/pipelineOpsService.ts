// @ts-nocheck
import type {
  DealSummary,
  PipelineOpsOverview,
  ProspectSummary,
  SubmitClientPayload,
  SubmitClientResponse,
} from "../domain/types";
import {
  DealSummarySchema,
  PipelineOpsOverviewSchema,
  ProspectSummarySchema,
  SubmitClientPayloadSchema,
  SubmitClientResponseSchema,
} from "../domain/schema";
import {
  fetchPipelineOpsOverview,
  pipelineOpsMocks,
  submitClientIntake,
} from "../infrastructure/mockPipelineOpsApi";
import { withTimeout } from "./withTimeout";

function safeParse<T>(schema: { safeParse: (data: unknown) => { success: boolean; data: T } }, data: unknown): T | unknown {
  const result = schema.safeParse(data);
  return result.success ? result.data : data;
}

export async function getPipelineOverview(): Promise<PipelineOpsOverview> {
  try {
    const overview = await withTimeout(fetchPipelineOpsOverview(), 2000, () => pipelineOpsMocks);
    return safeParse(PipelineOpsOverviewSchema, overview) as PipelineOpsOverview;
  } catch (error) {
    console.warn("getPipelineOverview fallback to mocks", error);
    return safeParse(PipelineOpsOverviewSchema, pipelineOpsMocks) as PipelineOpsOverview;
  }
}

export async function getProspects(): Promise<ProspectSummary[]> {
  return safeParse(ProspectSummarySchema.array(), pipelineOpsMocks.prospects) as ProspectSummary[];
}

export async function getProspectById(id: string): Promise<ProspectSummary | undefined> {
  const parsed = safeParse(ProspectSummarySchema.array(), pipelineOpsMocks.prospects) as ProspectSummary[];
  return parsed.find((prospect) => prospect.id === id);
}

export async function getActiveDeals(): Promise<DealSummary[]> {
  return safeParse(DealSummarySchema.array(), pipelineOpsMocks.activeDeals) as DealSummary[];
}

export async function submitClient(payload: SubmitClientPayload): Promise<SubmitClientResponse> {
  const validatedPayload = safeParse(SubmitClientPayloadSchema, payload) as SubmitClientPayload;
  try {
    const response = await withTimeout(submitClientIntake(validatedPayload), 2000, () => ({
      intakeId: "timeout",
      status: "needs_review",
      estimatedSlaHrs: 12,
    }));
    return safeParse(SubmitClientResponseSchema, response) as SubmitClientResponse;
  } catch (error) {
    console.error("submitClient failed", error);
    return { intakeId: "fallback", status: "needs_review", estimatedSlaHrs: 12 };
  }
}
