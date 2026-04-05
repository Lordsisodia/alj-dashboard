import { describe, expect, it } from "vitest";
import {
  opportunities,
  overviewSummary,
  quickActions,
  timelineStages,
} from "../../data/earningsOverview";
import {
  OverviewSummarySchema,
  TimelineStageSchema,
  parseOpportunities,
  parseOverviewSummary,
  parseQuickActions,
  parseTimelineStages,
} from "../schema";

describe("earnings overview schemas", () => {
  it("parses summary and collections", () => {
    const summary = parseOverviewSummary(overviewSummary);
    const stages = parseTimelineStages(timelineStages);
    const opps = parseOpportunities(opportunities);
    const actions = parseQuickActions(quickActions);

    expect(summary.monthToDatePayouts).toBe("$24,800");
    expect(stages[0].label).toBe("Submitted");
    expect(opps[1].reward).toBe("+$600");
    expect(actions[0].label).toBe("Submit proof");
  });

  it("rejects negative stage count", () => {
    const bad = { ...timelineStages[0], count: -1 } as unknown;
    expect(() => TimelineStageSchema.parse(bad)).toThrow();
  });

  it("rejects missing summary field", () => {
    expect(() => OverviewSummarySchema.parse({ monthToDatePayouts: "$0" })).toThrow();
  });
});
