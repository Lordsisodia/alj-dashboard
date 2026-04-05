import { describe, expect, it } from "vitest";
import { badgeCollection } from "../../data/earningsAchievements";
import {
  BadgeDetailSchema,
  LeaderboardEntrySchema,
  parseBadges,
} from "../schema";

describe("earnings achievements schemas", () => {
  it("parses badge collection", () => {
    const parsed = parseBadges(badgeCollection);
    expect(parsed[0].name).toBe("Momentum Max");
    expect(parsed[1].status).toBe("earned");
  });

  it("rejects out-of-range progress", () => {
    const bad = { ...badgeCollection[0], progress: 150 } as unknown;
    expect(() => BadgeDetailSchema.parse(bad)).toThrow();
  });

  it("rejects negative leaderboard rank", () => {
    const bad = { rank: -1, name: "X", metricLabel: "Rev", metricValue: "$0", trend: "flat" } as unknown;
    expect(() => LeaderboardEntrySchema.parse(bad)).toThrow();
  });
});
