import { getPipelineOverview as fetchOverview } from "./pipelineOpsService";
import { selectAtRiskDeals, selectProspectsByStage, selectRecruitmentInvites } from "../domain/selectors";
import type { PipelineOpsOverview } from "../domain/types";

export type PipelineOverviewState = {
  data?: PipelineOpsOverview;
  loading: boolean;
  error?: unknown;
};

export async function loadPipelineOverview(): Promise<PipelineOverviewState> {
  try {
    const data = await fetchOverview();
    return { data, loading: false };
  } catch (error) {
    return { loading: false, error };
  }
}

export function getPipelineSelectors(overview: PipelineOpsOverview) {
  return {
    prospectsByStage: (stage: "prospect" | "qualified") => selectProspectsByStage(overview, stage),
    atRiskDeals: () => selectAtRiskDeals(overview),
    recruitmentInvites: (status?: string) => selectRecruitmentInvites(overview, status),
  };
}
