// @vitest-environment node
import { describe, expect, it } from "vitest";
import { teamMembers } from "../../data/team/members";
import { parseTeamMembers } from "../schema";

describe("sales-team schema", () => {
  it("parses team members", () => {
    const parsed = parseTeamMembers(teamMembers);
    expect(parsed[0].contact.email).toContain("@");
  });

  it("rejects invalid email", () => {
    const bad = { ...teamMembers[0], contact: { ...teamMembers[0].contact, email: "not-an-email" } } as unknown;
    expect(() => parseTeamMembers([bad])).toThrow();
  });
});
