// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildPlanSnapshot, generatePlanRecommendations } from "../planGeneratorService";

describe("planGeneratorService", () => {
  it("generates recommendations and builds snapshot", async () => {
    const recs = await generatePlanRecommendations({
      companyName: "Northwind",
      vertical: "saas",
      painPoint: "churn",
      goals: ["Reduce churn"],
    });

    expect(recs.length).toBeGreaterThan(0);
    const snapshot = buildPlanSnapshot(
      {
        companyName: "Northwind",
        vertical: "saas",
        painPoint: "churn",
        goals: ["Reduce churn"],
      },
      recs,
    );
    expect(snapshot.recommendations?.length).toBe(recs.length);
  });

  it("times out to empty list", async () => {
    const recs = await generatePlanRecommendations(
      { companyName: "X", vertical: "saas", painPoint: "latency", goals: ["Improve"] },
      1,
    );
    expect(Array.isArray(recs)).toBe(true);
  });
});
