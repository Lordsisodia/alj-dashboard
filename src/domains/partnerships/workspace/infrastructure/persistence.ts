import { parseChecklist } from "../checklist/domain/schema";
import { parseWorkspaceFiles } from "../domain/files.schema";
import { parseWorkspaceNotes } from "../domain/notes.schema";
import { parseWorkspaceTasks } from "../domain/schema";
import type { ChecklistItem } from "../checklist/domain/schema";
import type { WorkspaceFile } from "../domain/files";
import type { WorkspaceNote } from "../domain/notes";
import type { WorkspaceTask } from "../domain/tasks";

type WorkspaceSnapshot = {
  tasks: WorkspaceTask[];
  files: WorkspaceFile[];
  notes: WorkspaceNote[];
  checklist: ChecklistItem[];
};

const store: WorkspaceSnapshot = {
  tasks: [],
  files: [],
  notes: [],
  checklist: [],
};

export function loadWorkspaceSnapshot(): WorkspaceSnapshot {
  return {
    tasks: [...store.tasks],
    files: [...store.files],
    notes: [...store.notes],
    checklist: [...store.checklist],
  };
}

export function saveWorkspaceTasks(tasks: unknown): WorkspaceTask[] {
  const parsed = parseWorkspaceTasks(tasks);
  store.tasks = parsed;
  return store.tasks;
}

export function saveWorkspaceFiles(files: unknown): WorkspaceFile[] {
  const parsed = parseWorkspaceFiles(files);
  store.files = parsed;
  return store.files;
}

export function saveWorkspaceNotes(notes: unknown): WorkspaceNote[] {
  const parsed = parseWorkspaceNotes(notes);
  store.notes = parsed;
  return store.notes;
}

export function saveWorkspaceChecklist(items: unknown): ChecklistItem[] {
  const parsed = parseChecklist(items);
  store.checklist = parsed;
  return store.checklist;
}

export function resetWorkspaceStore(): void {
  store.tasks = [];
  store.files = [];
  store.notes = [];
  store.checklist = [];
}
