import { describe, expect, it } from "vitest";
import { searchHelpCollections } from "../search";

const collections = [
  {
    slug: "community",
    title: "Community",
    description: "All about channels",
    icon: "users",
    articles: [
      {
        slug: "channels",
        title: "Using channels",
        summary: "Navigate community",
        lastUpdated: "2025-11-20",
        sections: [{ heading: "Tips", body: ["Use @mentions", "Pin threads"] }],
        tags: ["channels", "nav"],
      },
    ],
  },
];

describe("help center search", () => {
  it("finds articles matching term", () => {
    const results = searchHelpCollections(collections, "pin");
    expect(results).toHaveLength(1);
    expect(results[0].collectionSlug).toBe("community");
  });

  it("returns empty for blank query", () => {
    const results = searchHelpCollections(collections, " ");
    expect(results).toHaveLength(0);
  });
});
