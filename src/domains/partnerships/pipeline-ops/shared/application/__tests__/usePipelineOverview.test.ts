// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import * as service from "../pipelineOpsService";
import { getPipelineSelectors, loadPipelineOverview } from "../usePipelineOverview";
import { pipelineOpsMocks } from "../../infrastructure/mockPipelineOpsApi";

describe("usePipelineOverview helper", () => {
  it("returns data when service succeeds", async () => {
    const spy = vi.spyOn(service, "getPipelineOverview").mockResolvedValueOnce(pipelineOpsMocks);
    const state = await loadPipelineOverview();
    expect(state.data?.prospects.length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it("returns error when service fails", async () => {
    const spy = vi.spyOn(service, "getPipelineOverview").mockRejectedValueOnce(new Error("boom"));
    const state = await loadPipelineOverview();
    expect(state.error).toBeDefined();
    spy.mockRestore();
  });

  it("provides selectors", () => {
    const selectors = getPipelineSelectors(pipelineOpsMocks);
    expect(selectors.prospectsByStage("qualified").every((p) => p.stage === "qualified")).toBe(true);
    expect(selectors.atRiskDeals().every((d) => d.health === "risk")).toBe(true);
  });
});
