import { z } from "zod";
import type { WorkspaceTask } from "./tasks";

export const WorkspaceTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

export const WorkspaceTasksSchema = z.array(WorkspaceTaskSchema);

export function parseWorkspaceTasks(data: unknown): WorkspaceTask[] {
  return WorkspaceTasksSchema.parse(data);
}
