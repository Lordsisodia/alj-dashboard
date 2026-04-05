import { describe, expect, it } from "vitest";
import { filterCollections, searchArticles, safeParseCollections } from "../search-helpers";

const collections = [
  {
    title: "Getting Started",
    slug: "getting-started",
    description: "Learn the basics",
    category: "onboarding",
    articles: [
      { title: "Create account", slug: "create", summary: "how to sign up" },
      { title: "Invite teammates", slug: "invite", summary: "sharing access" },
    ],
  },
  {
    title: "Troubleshooting",
    slug: "troubleshooting",
    description: "Fix issues",
    category: "support",
    articles: [{ title: "Reset password", slug: "reset", summary: "forgot password" }],
  },
] as any;

describe("help center search helpers", () => {
  it("filters collections by title/description/category/article summary", () => {
    expect(filterCollections(collections, "onboarding")).toHaveLength(1);
    expect(filterCollections(collections, "reset")).toHaveLength(1);
    expect(filterCollections(collections, "access")).toHaveLength(1);
    expect(filterCollections(collections, "missing")).toHaveLength(0);
  });

  it("searches articles across collections", () => {
    const results = searchArticles(collections, "password");
    expect(results.map((r) => r.slug)).toEqual(["reset"]);
  });

  it("returns [] when parse fails", () => {
    expect(safeParseCollections({} as any)).toEqual([]);
  });
});
