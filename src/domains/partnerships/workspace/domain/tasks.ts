export type TaskId = string

export interface WorkspaceTask {
  id: TaskId
  title: string
  description?: string
  dueDate?: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
}
