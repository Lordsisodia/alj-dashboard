import type { WorkspaceTask } from "./tasks";

export function filterTasksByStatus(tasks: WorkspaceTask[], status: WorkspaceTask["status"]): WorkspaceTask[] {
  return tasks.filter((task) => task.status === status);
}

export function getOverdueTasks(tasks: WorkspaceTask[], today: Date = new Date()): WorkspaceTask[] {
  return tasks.filter((task) => task.dueDate && new Date(task.dueDate) < today && task.status !== "done");
}

export function summarizeTasks(tasks: WorkspaceTask[]) {
  const summary = { todo: 0, in_progress: 0, done: 0 } as Record<WorkspaceTask["status"], number>;
  tasks.forEach((task) => {
    summary[task.status] += 1;
  });
  return summary;
}
