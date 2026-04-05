import type { WorkspaceTask } from "./tasks";
import type { WorkspaceFile } from "./files";
import type { WorkspaceNote } from "./notes";

export function normalizeTasks(tasks: WorkspaceTask[]) {
  return tasks.reduce<Record<string, WorkspaceTask>>((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});
}

export function normalizeFiles(files: WorkspaceFile[]) {
  return files.reduce<Record<string, WorkspaceFile>>((acc, file) => {
    acc[file.id] = file;
    return acc;
  }, {});
}

export function normalizeNotes(notes: WorkspaceNote[]) {
  return notes.reduce<Record<string, WorkspaceNote>>((acc, note) => {
    acc[note.id] = note;
    return acc;
  }, {});
}
