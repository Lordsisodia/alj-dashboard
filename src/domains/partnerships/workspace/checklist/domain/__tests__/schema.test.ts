// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ChecklistItemSchema, parseChecklist } from "../schema";

describe("workspace checklist schema", () => {
  it("parses checklist items", () => {
    const items = [
      { id: "c1", title: "Connect wallet", status: "todo", dueDate: "2025-11-30", tags: ["wallet"] },
      { id: "c2", title: "Submit onboarding docs", status: "in_progress" },
    ];

    const parsed = parseChecklist(items);
    expect(parsed[0].status).toBe("todo");
  });

  it("rejects invalid status", () => {
    const bad = { id: "c1", title: "Bad", status: "later" } as unknown;
    expect(() => ChecklistItemSchema.parse(bad)).toThrow();
  });
});
