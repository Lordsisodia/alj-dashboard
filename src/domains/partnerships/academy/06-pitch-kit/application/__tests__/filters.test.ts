import { describe, expect, it } from "vitest";
import type { PitchAsset } from "../../06-pitch-kit/types";

const assets: PitchAsset[] = [
  { id: "1", title: "Restaurants", summary: "Food", focus: "focus", type: "decks", status: "public", tags: ["food"], link: "#", relatedProofs: [] },
  { id: "2", title: "Mobility", summary: "Bike", focus: "focus", type: "decks", status: "public", tags: ["bike"], link: "#", relatedProofs: [] },
];

const filter = (term: string) =>
  assets.filter((asset) =>
    [asset.title, asset.summary, asset.focus, ...(asset.tags ?? [])]
      .some((field) => field.toLowerCase().includes(term.toLowerCase())),
  );

describe("pitch-kit search filter", () => {
  it("matches on title/summary/tags", () => {
    expect(filter("rest").map((a) => a.id)).toEqual(["1"]);
    expect(filter("bike").map((a) => a.id)).toEqual(["2"]);
    expect(filter("focus").length).toBe(2);
  });
});

