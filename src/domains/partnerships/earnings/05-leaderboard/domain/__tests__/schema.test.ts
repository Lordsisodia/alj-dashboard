// @vitest-environment node
import { describe, expect, it } from "vitest";
import { leaderboardEntries, leaderboardHighlights } from "../../data/leaderboard";
import { parseLeaderboardEntries, parseLeaderboardHighlights } from "../schema";

describe("earnings leaderboard schemas", () => {
  it("parses entries", () => {
    const parsed = parseLeaderboardEntries(leaderboardEntries);
    expect(parsed[0].rank).toBe(1);
  });

  it("rejects invalid trend", () => {
    const bad = { ...leaderboardEntries[0], trend: "rocket" } as unknown;
    expect(() => parseLeaderboardEntries([bad])).toThrow();
  });

  it("parses highlights", () => {
    const parsed = parseLeaderboardHighlights(leaderboardHighlights);
    expect(parsed.topPerformer).toBe("Avery Diaz");
  });
});
