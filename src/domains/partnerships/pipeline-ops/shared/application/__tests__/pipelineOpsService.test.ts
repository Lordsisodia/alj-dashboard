// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { getActiveDeals, getPipelineOverview, submitClient } from "../pipelineOpsService";
import * as api from "../../infrastructure/mockPipelineOpsApi";

describe("pipelineOpsService validation wrappers", () => {
  it("returns parsed overview", async () => {
    const overview = await getPipelineOverview();
    expect(overview.prospects[0].id).toBeDefined();
  });

  it("handles submitClient with basic payload", async () => {
    const response = await submitClient({
      companyName: "Test Co",
      contactEmail: "ops@test.co",
      dealSizeEstimate: 1000,
      vertical: "saas",
    });

    expect(response.status === "received" || response.status === "needs_review").toBe(true);
  });

  it("returns validated deals", async () => {
    const deals = await getActiveDeals();
    expect(deals[0].company).toBeDefined();
  });

  it("falls back to mocks on overview error", async () => {
    const spy = vi.spyOn(api, "fetchPipelineOpsOverview").mockRejectedValueOnce(new Error("boom"));
    const overview = await getPipelineOverview();
    expect(overview.prospects.length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it("returns fallback response on submit error", async () => {
    const spy = vi.spyOn(api, "submitClientIntake").mockRejectedValueOnce(new Error("boom"));
    const res = await submitClient({ companyName: "X", contactEmail: "x@y.com", dealSizeEstimate: 1, vertical: "saas" });
    expect(res.intakeId).toBe("fallback");
    spy.mockRestore();
  });
});
