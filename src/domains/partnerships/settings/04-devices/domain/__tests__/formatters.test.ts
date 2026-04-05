import { describe, expect, it } from "vitest";
import { formatDeviceSummary } from "../formatters";

describe("formatDeviceSummary", () => {
  it("builds summary with location and last active", () => {
    const summary = formatDeviceSummary({ id: "1", name: "Mac", type: "laptop", location: "SF", lastActive: "yesterday" });
    expect(summary).toBe("Mac · SF · Last active yesterday");
  });
});
