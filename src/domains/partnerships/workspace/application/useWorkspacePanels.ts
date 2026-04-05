"use client";

// Client hook for workspace panel state
import { useEffect, useState } from "react";
import { mockTasks } from "../data/tasks";
import { mockFiles } from "../data/files";
import { mockNotes } from "../data/notes";
import { parseWorkspaceTasks } from "../domain/schema";
import { loadWorkspaceSnapshot, resetWorkspaceStore, saveWorkspaceTasks, saveWorkspaceFiles, saveWorkspaceNotes } from "../infrastructure/persistence";
import type { WorkspaceTask } from "../domain/tasks";
import { parseWorkspaceFiles } from "../domain/files.schema";
import { parseWorkspaceNotes } from "../domain/notes.schema";

export function bootstrapWorkspaceTasks() {
  // seed in-memory store once with mock tasks
  return saveWorkspaceTasks(parseWorkspaceTasks(mockTasks));
}

export function bootstrapWorkspaceFiles() {
  return saveWorkspaceFiles(parseWorkspaceFiles(mockFiles));
}

export function bootstrapWorkspaceNotes() {
  return saveWorkspaceNotes(parseWorkspaceNotes(mockNotes));
}

export function useWorkspacePanels() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState(() => loadWorkspaceSnapshot());

  useEffect(() => {
    try {
      // ensure store has initial data
      bootstrapWorkspaceTasks();
      bootstrapWorkspaceFiles();
      bootstrapWorkspaceNotes();
      setSnapshot(loadWorkspaceSnapshot());
      setError(null);
    } catch (err) {
      setError("Failed to load workspace panels");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTasks = (tasks: WorkspaceTask[] | unknown) => {
    try {
      const parsed = saveWorkspaceTasks(tasks);
      setSnapshot((prev) => ({ ...prev, tasks: parsed }));
      setError(null);
      return parsed;
    } catch (err) {
      setError("Failed to save tasks");
      return snapshot.tasks;
    }
  };

  const reset = () => {
    resetWorkspaceStore();
    setSnapshot(loadWorkspaceSnapshot());
  };

  return { snapshot, loading, error, saveTasks, reset };
}

// Backwards-compatible selectors for services/tests
export function useWorkspacePanelsSnapshot() {
  return loadWorkspaceSnapshot();
}

export function getWorkspaceTasks() {
  const snapshot = loadWorkspaceSnapshot();
  if (snapshot.tasks.length === 0) {
    return { tasks: bootstrapWorkspaceTasks() };
  }
  return { tasks: snapshot.tasks };
}
