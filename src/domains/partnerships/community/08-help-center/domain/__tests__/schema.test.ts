import { describe, expect, it } from "vitest";
import { HelpArticleSchema, HelpCollectionsSchema } from "../schema";

const article = {
  slug: "getting-started",
  title: "Getting started",
  summary: "How to begin",
  lastUpdated: "2025-11-20",
  sections: [{ heading: "Intro", body: ["Step 1"] }],
};

describe("HelpCenter schemas", () => {
  it("parses article", () => {
    const parsed = HelpArticleSchema.parse(article);
    expect(parsed.slug).toBe("getting-started");
  });

  it("parses collections", () => {
    const collections = HelpCollectionsSchema.parse([
      {
        slug: "community",
        title: "Community",
        description: "All about channels",
        icon: "users",
        articles: [article],
      },
    ]);
    expect(collections[0].articles).toHaveLength(1);
  });
});
