import { describe, expect, it } from "vitest";
import { earningsChallenges } from "../../data/earningsChallenges";
import { EarningsChallengeSchema, parseEarningsChallenges } from "../schema";

describe("earnings challenges schema", () => {
  it("parses challenge list", () => {
    const parsed = parseEarningsChallenges(earningsChallenges);
    expect(parsed).toHaveLength(4);
    expect(parsed[0].actions[0].completed).toBe(true);
  });

  it("rejects out-of-range progress", () => {
    const bad = { ...earningsChallenges[0], progress: 150 } as unknown;
    expect(() => EarningsChallengeSchema.parse(bad)).toThrow();
  });
});
