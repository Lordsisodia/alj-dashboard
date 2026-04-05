import { describe, expect, it } from "vitest";
import {
  PlanInputSchema,
  PlanRecommendationSchema,
  PlanPromptSchema,
  parsePlanGeneratorSnapshot,
} from "../schema";

describe("app-plan generator schemas", () => {
  it("parses plan snapshot", () => {
    const snapshot = {
      prompts: [
        { id: "p1", question: "What's the vertical?", field: "vertical", required: true },
      ],
      input: {
        companyName: "Northwind",
        vertical: "SaaS",
        painPoint: "Churn",
        goals: ["Reduce churn"],
        timeline: "Q1",
      },
      recommendations: [
        {
          id: "r1",
          title: "Lifecycle messaging",
          description: "Add churn playbook",
          effort: "medium",
          impact: "high",
          etaDays: 14,
        },
      ],
    };

    const parsed = parsePlanGeneratorSnapshot(snapshot);
    expect(parsed.prompts[0].field).toBe("vertical");
    expect(parsed.recommendations?.[0].impact).toBe("high");
  });

  it("rejects missing goals", () => {
    const bad = { companyName: "X", vertical: "Y", painPoint: "Z", goals: [] } as unknown;
    expect(() => PlanInputSchema.parse(bad)).toThrow();
  });

  it("rejects invalid effort", () => {
    const bad = { id: "r1", title: "t", description: "d", effort: "xl", impact: "low" } as unknown;
    expect(() => PlanRecommendationSchema.parse(bad)).toThrow();
  });

  it("rejects prompt without field", () => {
    const bad = { id: "p1", question: "q" } as unknown;
    expect(() => PlanPromptSchema.parse(bad)).toThrow();
  });
});
