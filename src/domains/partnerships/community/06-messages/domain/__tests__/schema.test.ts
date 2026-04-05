import { describe, expect, it } from "vitest";
import { ConversationMessageSchema, ThreadOverviewSchema, ThreadPageSchema } from "../schema";

describe("ConversationMessageSchema", () => {
  const base = {
    id: "m1",
    authorName: "Alex",
    authorInitials: "AL",
    direction: "incoming" as const,
    content: "Hello",
    timestamp: "2025-11-26T10:00:00Z",
  };

  it("parses a valid message", () => {
    const parsed = ConversationMessageSchema.parse(base);
    expect(parsed.authorName).toBe("Alex");
  });

  it("rejects too-long initials", () => {
    expect(() => ConversationMessageSchema.parse({ ...base, authorInitials: "TOOLONG" })).toThrow();
  });
});

describe("ThreadOverviewSchema", () => {
  it("parses overview", () => {
    const parsed = ThreadOverviewSchema.parse({ id: "t1", name: "General", preview: "Hello" });
    expect(parsed.name).toBe("General");
  });
});

describe("ThreadPageSchema", () => {
  it("parses a thread page", () => {
    const page = {
      threadId: "t1",
      cursor: null,
      hasMore: false,
      messages: [
        {
          id: "m1",
          authorName: "Alex",
          authorInitials: "AL",
          direction: "incoming",
          content: "Hello",
          timestamp: "2025-11-26T10:00:00Z",
        },
      ],
    };
    const parsed = ThreadPageSchema.parse(page);
    expect(parsed.messages).toHaveLength(1);
  });
});
