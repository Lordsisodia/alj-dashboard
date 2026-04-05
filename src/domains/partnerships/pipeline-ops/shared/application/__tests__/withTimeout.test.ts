// @vitest-environment node
import { describe, expect, it } from "vitest";
import { withTimeout } from "../withTimeout";

describe("withTimeout", () => {
  it("resolves before timeout", async () => {
    const result = await withTimeout(Promise.resolve(42), 100, () => 0);
    expect(result).toBe(42);
  });

  it("returns fallback on timeout", async () => {
    const result = await withTimeout(new Promise(() => {}), 10, () => "fallback");
    expect(result).toBe("fallback");
  });
});
