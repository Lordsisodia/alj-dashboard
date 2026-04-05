// @ts-nocheck
import { deriveState } from "../domain/states";
import { useWorkspacePanels } from "../application/useWorkspacePanels";
import { filterTasksByStatus } from "../domain/selectors";
import { WorkspacePanel } from "./components/WorkspacePanel";

export function WorkspaceDashboard() {
  const { snapshot, loading, error } = useWorkspacePanels();
  const tasks = snapshot.tasks;
  const files = snapshot.files;
  const notes = snapshot.notes;

  const taskState = deriveState(tasks, loading, error);
  const fileState = deriveState(files, loading, error);
  const noteState = deriveState(notes, loading, error);

  const todo = filterTasksByStatus(tasks, "todo");

  return (
    <div className="space-y-4">
      <WorkspacePanel
        title="Tasks"
        state={taskState}
        description="Track partner follow-ups and internal todos"
        errorMessage="Unable to load tasks"
      >
        <div className="space-y-2 text-sm text-white/80">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">To do</p>
          <ul className="space-y-1">
            {todo.map((task) => (
              <li key={task.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="font-semibold text-white">{task.title}</span>
                {task.dueDate ? <span className="ml-2 text-xs text-siso-text-muted">Due {task.dueDate}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title="Files"
        state={fileState}
        description="Recent uploads"
        errorMessage="Unable to load files"
      >
        <ul className="space-y-1 text-sm text-white/80">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="font-semibold text-white">{file.name}</span>
              <span className="text-xs text-siso-text-muted">{file.sizeKb} KB</span>
            </li>
          ))}
        </ul>
      </WorkspacePanel>

      <WorkspacePanel
        title="Notes"
        state={noteState}
        description="Pinned workspace notes"
        errorMessage="Unable to load notes"
      >
        <ul className="space-y-1 text-sm text-white/80">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="font-semibold text-white">{note.title}</p>
              <p className="text-xs text-siso-text-muted">Updated {note.updatedAt}</p>
            </li>
          ))}
        </ul>
      </WorkspacePanel>
    </div>
  );
}
