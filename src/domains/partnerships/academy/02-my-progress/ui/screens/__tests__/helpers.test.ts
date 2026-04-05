import { describe, expect, it } from "vitest";
import { tierPercentage } from "../helpers";

describe("tierPercentage", () => {
  const base = {
    currentLevel: 1,
    currentPoints: 50,
    pointsToNextLevel: 50,
    nextLevel: 2,
    currentTierId: "a",
    nextTierId: "b",
  } as const;

  it("calculates percentage safely", () => {
    expect(tierPercentage({ ...base, currentPoints: 50, pointsToNextLevel: 50 })).toBe(50);
  });

  it("handles zero denom", () => {
    expect(tierPercentage({ ...base, currentPoints: 0, pointsToNextLevel: 0 })).toBe(0);
  });

  it("caps at 100", () => {
    expect(tierPercentage({ ...base, currentPoints: 200, pointsToNextLevel: 10 })).toBe(100);
  });
});

