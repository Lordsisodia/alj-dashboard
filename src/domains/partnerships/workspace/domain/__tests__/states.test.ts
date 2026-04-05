// @vitest-environment node
import { describe, expect, it } from "vitest";
import { deriveState } from "../states";

describe("workspace states helper", () => {
  it("returns loading", () => {
    expect(deriveState([], true)).toBe("loading");
  });

  it("returns empty", () => {
    expect(deriveState([], false)).toBe("empty");
  });

  it("returns ready", () => {
    expect(deriveState([{ id: 1 }], false)).toBe("ready");
  });
});
