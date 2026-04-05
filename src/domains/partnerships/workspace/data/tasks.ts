import type { WorkspaceTask } from "../domain/tasks"

export const mockTasks: WorkspaceTask[] = [
  { id: "task-1", title: "Follow up with BetaOps", status: "todo", priority: "high", dueDate: "2025-11-27" },
  { id: "task-2", title: "Prep invite list", status: "in_progress", priority: "medium", dueDate: "2025-11-28" },
  { id: "task-3", title: "Archive completed notes", status: "done", priority: "low" },
]
