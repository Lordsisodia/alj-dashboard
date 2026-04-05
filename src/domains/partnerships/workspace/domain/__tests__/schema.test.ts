import { describe, expect, it } from "vitest";
import { WorkspaceTaskSchema, parseWorkspaceTasks } from "../schema";

describe("workspace task schema", () => {
  it("parses valid tasks", () => {
    const tasks = [
      { id: "task-1", title: "Follow up", status: "todo", priority: "high", dueDate: "2025-11-25" },
      { id: "task-2", title: "Review deck", status: "in_progress", priority: "medium" },
    ];

    const parsed = parseWorkspaceTasks(tasks);
    expect(parsed).toHaveLength(2);
    expect(parsed[1].status).toBe("in_progress");
  });

  it("rejects unknown status", () => {
    const bad = { id: "task-bad", title: "Nope", status: "waiting", priority: "low" } as unknown;
    expect(() => WorkspaceTaskSchema.parse(bad)).toThrow();
  });
});
