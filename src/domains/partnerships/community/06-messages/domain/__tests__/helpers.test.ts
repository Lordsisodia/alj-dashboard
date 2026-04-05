import { describe, expect, it } from "vitest";
import { groupMessagesByDay, paginateMessages, optimisticSend } from "../helpers";
import type { ConversationMessage } from "../types";

const sample: ConversationMessage[] = [
  {
    id: "1",
    authorName: "Alex",
    authorInitials: "AL",
    direction: "incoming",
    content: "Hi",
    timestamp: "2025-11-26T10:00:00Z",
  },
  {
    id: "2",
    authorName: "Sam",
    authorInitials: "SM",
    direction: "incoming",
    content: "Yo",
    timestamp: "2025-11-25T09:00:00Z",
  },
];

describe("groupMessagesByDay", () => {
  it("groups by date prefix", () => {
    const grouped = groupMessagesByDay(sample);
    expect(Object.keys(grouped)).toContain("2025-11-26");
    expect(grouped["2025-11-26"]).toHaveLength(1);
  });
});

describe("paginateMessages", () => {
  it("paginates and clamps page", () => {
    const paged = paginateMessages(sample, 10, 1);
    expect(paged.page).toBe(2);
    expect(paged.totalPages).toBe(2);
    expect(paged.items).toHaveLength(1);
  });
});

describe("optimisticSend", () => {
  it("appends an outgoing optimistic message", () => {
    const next = optimisticSend(sample, {
      authorName: "You",
      authorInitials: "YOU",
      content: "Draft",
      timestamp: "2025-11-26T11:00:00Z",
    });
    expect(next).toHaveLength(3);
    expect(next[next.length - 1].direction).toBe("outgoing");
    expect(next[next.length - 1].id).toMatch(/optimistic-/);
  });
});
