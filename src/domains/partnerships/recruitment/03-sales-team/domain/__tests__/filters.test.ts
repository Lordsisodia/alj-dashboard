// @vitest-environment node
import { describe, expect, it } from "vitest";
import { teamMembers } from "../../data/team/members";
import { filterTeamMembers, sortByInvites } from "../filters";

describe("sales-team filters", () => {
  it("filters by tier and search", () => {
    const filtered = filterTeamMembers(teamMembers, { tier: "Performer", search: "health" });
    expect(filtered.every((m) => m.tier === "Performer")).toBe(true);
  });

  it("sorts by invites desc", () => {
    const sorted = sortByInvites(teamMembers, "desc");
    expect(sorted[0].invitesThisMonth).toBeGreaterThanOrEqual(sorted[1].invitesThisMonth);
  });
});
