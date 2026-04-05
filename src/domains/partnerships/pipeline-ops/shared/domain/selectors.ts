import type { PipelineOpsOverview, ProspectSummary } from "./types";

export function selectProspectsByStage(overview: PipelineOpsOverview, stage: ProspectSummary["stage"]): ProspectSummary[] {
  return overview.prospects.filter((p) => p.stage === stage);
}

export function selectAtRiskDeals(overview: PipelineOpsOverview) {
  return overview.activeDeals.filter((deal) => deal.health === "risk");
}

export function selectRecruitmentInvites(overview: PipelineOpsOverview, status?: string) {
  return overview.recruitment.filter((invite) => (status ? invite.status === status : true));
}
