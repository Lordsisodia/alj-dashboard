import { describe, expect, it } from "vitest";
import {
  tierBenefits,
  tierHistory,
  tierMeta,
  tierMetrics,
  unlockMissions,
} from "../../data/tierProgression";
import {
  TierMetaSchema,
  UnlockMissionSchema,
  parseTierProgression,
} from "../schema";

describe("tier progression schemas", () => {
  it("parses the progression snapshot", () => {
    const parsed = parseTierProgression({
      meta: tierMeta,
      metrics: tierMetrics,
      benefits: tierBenefits,
      missions: unlockMissions,
      history: tierHistory,
    });

    expect(parsed.meta.currentTier).toBe("Builder");
    expect(parsed.metrics).toHaveLength(3);
    expect(parsed.missions[0].steps[0]).toContain("Start the featured course");
  });

  it("rejects missions without steps", () => {
    const badMission = { ...unlockMissions[0], steps: [] } as unknown;
    expect(() => UnlockMissionSchema.parse(badMission)).toThrow();
  });

  it("rejects invalid progress percent", () => {
    const badMeta = { ...tierMeta, progressPct: 160 } as unknown;
    expect(() => TierMetaSchema.parse(badMeta)).toThrow();
  });
});
