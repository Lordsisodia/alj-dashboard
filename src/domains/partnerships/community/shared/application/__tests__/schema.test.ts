import { describe, expect, it } from "vitest";
import { PartnerDirectorySchema, HelpCollectionsSchema } from "../schema";

describe("community schemas", () => {
  it("parses partner directory", () => {
    const parsed = PartnerDirectorySchema.safeParse([{ id: "1", name: "Alice" }]);
    expect(parsed.success).toBe(true);
  });

  it("fails on missing id", () => {
    const parsed = PartnerDirectorySchema.safeParse([{ name: "NoId" }]);
    expect(parsed.success).toBe(false);
  });

  it("parses help collections", () => {
    const parsed = HelpCollectionsSchema.safeParse([{ title: "Help", slug: "help", articles: [] }]);
    expect(parsed.success).toBe(true);
  });
});

