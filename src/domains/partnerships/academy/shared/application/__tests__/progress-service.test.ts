import { describe, expect, it } from "vitest";

import { ProgressPayloadSchema } from "../schema";
import { __private } from "../progress-service";

const samplePayload = {
  level: {
    currentLevel: 3,
    currentPoints: 1200,
    pointsToNextLevel: 300,
    nextLevel: 4,
    currentTierId: "builder",
    nextTierId: "vanguard",
  },
  tiers: [
    { id: "builder", title: "Builder" },
    { id: "vanguard", title: "Vanguard" },
  ],
  xpFeed: [
    { id: "1", title: "Lesson", source: "course", xp: 100, when: "today" },
    { id: "2", title: "Win", source: "deal", xp: 200, when: "yesterday" },
  ],
  certificates: { count: 2, badges: 1 },
};

describe("ProgressPayloadSchema", () => {
  it("parses valid payload", () => {
    const parsed = ProgressPayloadSchema.safeParse(samplePayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.level.currentLevel).toBe(3);
    }
  });

  it("fails on malformed payload", () => {
    const bad = { ...samplePayload, level: { currentLevel: "oops" } };
    const parsed = ProgressPayloadSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });
});

describe("paginateXpFeed", () => {
  const paginate = __private.paginateXpFeed;

  it("clamps pages within bounds", () => {
    const result = paginate(samplePayload.xpFeed, 10, 1);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.items).toHaveLength(1);
  });

  it("handles empty feed", () => {
    const result = paginate([], 1, 5);
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(0);
  });
});

