import { describe, expect, it, vi } from "vitest";

const mockGetPipelineOverview = vi.fn().mockResolvedValue({ prospectCount: 2 });
const mockGetWorkspaceTasks = vi.fn(() => ({ tasks: [{ id: "1", title: "Task", status: "todo" }] }));
const mockGetWalletSnapshot = vi.fn(() => ({ walletSummary: { balance: 10, currency: "USD" }, ledgerEntries: [], complianceChecklist: [] }));
const mockGetTierProgressSnapshot = vi.fn(() => ({ tierMeta: [], tierMetrics: [{ tier: "gold", progress: 0.5 }] }));

vi.mock("@/domains/partnerships/pipeline-ops/shared/application/usePipelineOverview", () => ({
  getPipelineOverview: (...args: unknown[]) => mockGetPipelineOverview(...args),
}));

vi.mock("@/domains/partnerships/workspace/application/useWorkspacePanels", () => ({
  getWorkspaceTasks: (...args: unknown[]) => mockGetWorkspaceTasks(...args),
}));

vi.mock("@/domains/partnerships/earnings/01-dashboard/application/dashboard-data", () => ({
  getWalletSnapshot: (...args: unknown[]) => mockGetWalletSnapshot(...args),
  getTierProgressSnapshot: (...args: unknown[]) => mockGetTierProgressSnapshot(...args),
}));

import { loadHubWidgets } from "../aggregateDashboard";

describe("loadHubWidgets", () => {
  it("returns parsed dashboard data", async () => {
    const result = await loadHubWidgets();
    expect(result.status).toBe("ok");
    expect(result.data.pipeline.prospectCount).toBe(2);
    expect(result.data.earnings.walletSummary.balance).toBe(10);
  });

  it("gracefully handles errors", async () => {
    mockGetPipelineOverview.mockRejectedValueOnce(new Error("fail"));
    const result = await loadHubWidgets();
    expect(result.status).toBe("error");
    expect(result.data.pipeline.prospectCount).toBe(0);
  });
});
