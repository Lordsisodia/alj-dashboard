// @vitest-environment node
import { describe, expect, it } from "vitest";
import { pipelineOpsMocks } from "../../infrastructure/mockPipelineOpsApi";
import { selectAtRiskDeals, selectProspectsByStage, selectRecruitmentInvites } from "../selectors";

describe("pipeline selectors", () => {
  const overview = {
    prospects: pipelineOpsMocks.prospects,
    activeDeals: pipelineOpsMocks.activeDeals,
    recruitment: pipelineOpsMocks.recruitment,
  };

  it("selects prospects by stage", () => {
    const prospects = selectProspectsByStage(overview, "qualified");
    expect(prospects.every((p) => p.stage === "qualified")).toBe(true);
  });

  it("selects at-risk deals", () => {
    const risk = selectAtRiskDeals(overview);
    expect(risk.every((d) => d.health === "risk")).toBe(true);
  });

  it("selects invites by status", () => {
    const accepted = selectRecruitmentInvites(overview, "accepted");
    expect(accepted.every((i) => i.status === "accepted")).toBe(true);
  });
});
