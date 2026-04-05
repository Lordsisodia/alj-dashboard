import { describe, expect, it } from "vitest";
import { calculatePortfolioStats } from "../calculate-stats";
import { allClients } from "../../data";

describe("calculatePortfolioStats", () => {
  it("returns stats shape", () => {
    const stats = calculatePortfolioStats(allClients);
    expect(stats).toHaveProperty("totalProjects");
    expect(stats.totalProjects).toBeGreaterThan(0);
  });
});

