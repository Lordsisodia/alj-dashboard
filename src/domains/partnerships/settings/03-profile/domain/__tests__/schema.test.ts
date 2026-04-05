import { describe, expect, it } from "vitest";
import { ProfileSchema, ProfileUploadSchema } from "../schema";

describe("ProfileSchema", () => {
  const base = {
    id: "user-1",
    displayName: "Alex Lee",
    bio: "Partner profile",
  };

  it("parses minimal profile", () => {
    const parsed = ProfileSchema.parse(base);
    expect(parsed.displayName).toBe("Alex Lee");
  });

  it("rejects invalid url", () => {
    expect(() => ProfileSchema.parse({ ...base, website: "not-a-url" })).toThrow();
  });
});

describe("ProfileUploadSchema", () => {
  it("parses upload", () => {
    const parsed = ProfileUploadSchema.parse({ fileName: "avatar.png", size: 12345, type: "image/png" });
    expect(parsed.type).toBe("image/png");
  });
});
