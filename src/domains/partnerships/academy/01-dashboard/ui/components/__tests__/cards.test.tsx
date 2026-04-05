import { describe, expect, it } from "vitest";
import { __private } from "../cards";

describe("AcademyDashboard cards helpers", () => {
  it("clamps widget percent between 0 and 100", () => {
    const { clampPercent } = __private;
    expect(clampPercent(150)).toBe(100);
    expect(clampPercent(-10)).toBe(0);
    expect(clampPercent(42)).toBe(42);
  });
});
