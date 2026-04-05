// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency, formatDateLabel, formatDeltaPercent } from "../formatters";

describe("earnings formatters", () => {
  it("formats currency with defaults", () => {
    expect(formatCurrency(4200)).toBe("$4,200.00");
  });

  it("formats compact currency", () => {
    expect(formatCompactCurrency(125000)).toBe("$125K");
  });

  it("formats delta percent with sign", () => {
    expect(formatDeltaPercent(0.125)).toBe("+12.5%");
    expect(formatDeltaPercent(-0.05)).toBe("-5.0%");
  });

  it("formats date label", () => {
    expect(formatDateLabel("2025-11-26")).toBe("Nov 26, 2025");
  });
});
