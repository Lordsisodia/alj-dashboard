import { describe, expect, it } from "vitest";
import { profileReducer } from "../reducer";
import type { Profile } from "../schema";

const base: Profile = {
  id: "u1",
  displayName: "Alex",
  bio: "Hi",
};

describe("profileReducer", () => {
  it("updates partial fields", () => {
    const next = profileReducer(base, { type: "update", payload: { bio: "New bio" } });
    expect(next.bio).toBe("New bio");
    expect(next.displayName).toBe("Alex");
  });

  it("replaces profile", () => {
    const next = profileReducer(base, { type: "replace", payload: { ...base, displayName: "Jamie" } });
    expect(next.displayName).toBe("Jamie");
  });
});
