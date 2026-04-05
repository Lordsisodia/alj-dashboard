import type { Metadata } from "next";
import { TasksWorkspaceScreen } from "@/domains/partnerships/workspace/ui/tasks/TasksWorkspaceScreen";

export const metadata: Metadata = {
  title: "Workspace Tasks • SISO Partners",
  description: "Centralized workspace tasks view (coming soon).",
};

export default function PartnersWorkspaceTasksPage() {
  return (
    <TasksWorkspaceScreen />
  );
}
