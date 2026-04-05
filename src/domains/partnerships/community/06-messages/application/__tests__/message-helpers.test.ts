import { describe, expect, it } from "vitest";
import { appendPage, buildOptimisticMessage, groupMessagesByDay } from "../message-helpers";
import type { ThreadPage } from "../../domain/schema";

describe("message-helpers", () => {
  it("groups messages by day", () => {
    const grouped = groupMessagesByDay([
      { id: "1", authorName: "A", authorInitials: "A", direction: "incoming", content: "hi", timestamp: "2025-11-25T10:00:00Z" },
      { id: "2", authorName: "B", authorInitials: "B", direction: "incoming", content: "hi", timestamp: "2025-11-26T10:00:00Z" },
    ]);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].messages[0].id).toBe("1");
    expect(grouped[1].messages[0].id).toBe("2");
  });

  it("appends pages for same thread", () => {
    const base: ThreadPage = { threadId: "t1", cursor: null, hasMore: true, messages: [{ id: "1", authorName: "A", authorInitials: "A", direction: "incoming", content: "hi", timestamp: "2025-11-25T10:00:00Z" }] };
    const next: ThreadPage = { threadId: "t1", cursor: "c2", hasMore: false, messages: [{ id: "2", authorName: "B", authorInitials: "B", direction: "incoming", content: "hi", timestamp: "2025-11-26T10:00:00Z" }] };
    const merged = appendPage(base, next);
    expect(merged.messages.map((m) => m.id)).toEqual(["1", "2"]);
    expect(merged.hasMore).toBe(false);
  });

  it("builds optimistic message with defaults", () => {
    const optimistic = buildOptimisticMessage({ content: "hello" });
    expect(optimistic.direction).toBe("outgoing");
    expect(optimistic.authorName).toBe("You");
    expect(optimistic.content).toBe("hello");
  });
});
