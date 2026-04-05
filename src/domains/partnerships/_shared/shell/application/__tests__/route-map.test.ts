import { describe, expect, it } from "vitest";
import { getTabForPath, getDrawerSectionForPath } from "../route-map";

describe("route map helpers", () => {
  it("maps paths to tabs", () => {
    expect(getTabForPath("/partners/community/wins")).toBe("messages");
    expect(getTabForPath("/partners/notifications")).toBe("notifications");
    expect(getTabForPath("/partners/settings/general")).toBe("quick-actions");
    expect(getTabForPath("/partners/unknown")).toBe("campus");
  });

  it("maps paths to drawer sections", () => {
    expect(getDrawerSectionForPath("/partners/community/wins")).toBe("community");
    expect(getDrawerSectionForPath("/partners/recruitment/team")).toBe("recruitment");
    expect(getDrawerSectionForPath("/partners/workspace")).toBe("workspace");
    expect(getDrawerSectionForPath("/partners/other")).toBe("home");
  });
});
