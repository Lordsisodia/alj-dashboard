import { describe, expect, it } from "vitest";
import { filterTasksByStatus, getOverdueTasks, summarizeTasks } from "../selectors";
import type { WorkspaceTask } from "../tasks";

const tasks: WorkspaceTask[] = [
  { id: "1", title: "A", status: "todo", priority: "low", dueDate: "2025-01-01" },
  { id: "2", title: "B", status: "in_progress", priority: "medium", dueDate: "2024-12-01" },
  { id: "3", title: "C", status: "done", priority: "high" },
];

describe("workspace selectors", () => {
  it("filters by status", () => {
    const todos = filterTasksByStatus(tasks, "todo");
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe("1");
  });

  it("returns overdue tasks", () => {
    const overdue = getOverdueTasks(tasks, new Date("2024-12-15"));
    expect(overdue).toHaveLength(1);
    expect(overdue[0].id).toBe("2");
  });

  it("summarizes statuses", () => {
    const summary = summarizeTasks(tasks);
    expect(summary.todo).toBe(1);
    expect(summary.in_progress).toBe(1);
    expect(summary.done).toBe(1);
  });
});
