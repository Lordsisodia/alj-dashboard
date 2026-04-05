// @vitest-environment node
import { describe, expect, it } from "vitest";
import { earningsDashboardSummary, earningsDashboardTrends } from "../../data/summary";
import { parseDashboardSummary, parseDashboardTrends } from "../schema";

describe("earnings dashboard schema", () => {
  it("parses summary", () => {
    const parsed = parseDashboardSummary(earningsDashboardSummary);
    expect(parsed.mtdPayout).toBe(24800);
  });

  it("parses trends", () => {
    const parsed = parseDashboardTrends(earningsDashboardTrends);
    expect(parsed[0].label).toBe("Payouts");
  });

  it("rejects negative payout", () => {
    expect(() => parseDashboardSummary({ ...earningsDashboardSummary, mtdPayout: -1 })).toThrow();
  });
});
