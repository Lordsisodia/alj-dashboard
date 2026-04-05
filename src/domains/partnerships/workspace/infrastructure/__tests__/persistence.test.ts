// @vitest-environment node
import { describe, expect, it, beforeEach } from "vitest";
import {
  loadWorkspaceSnapshot,
  resetWorkspaceStore,
  saveWorkspaceChecklist,
  saveWorkspaceFiles,
  saveWorkspaceNotes,
  saveWorkspaceTasks,
} from "../persistence";

beforeEach(() => {
  resetWorkspaceStore();
});

describe("workspace persistence stub", () => {
  it("saves and loads tasks", () => {
    saveWorkspaceTasks([{ id: "t1", title: "Follow up", status: "todo", priority: "high" }]);
    const snapshot = loadWorkspaceSnapshot();
    expect(snapshot.tasks[0].id).toBe("t1");
  });

  it("rejects invalid checklist items", () => {
    expect(() => saveWorkspaceChecklist([{ id: "c1", title: "bad" }])).toThrow();
  });

  it("isolates sections", () => {
    saveWorkspaceFiles([{ id: "f1", name: "deck.pdf", sizeKb: 100, uploadedAt: "2025-11-20", type: "application/pdf" }]);
    saveWorkspaceNotes([{ id: "n1", title: "Note", content: "Body", updatedAt: "2025-11-21" }]);
    const snapshot = loadWorkspaceSnapshot();
    expect(snapshot.files).toHaveLength(1);
    expect(snapshot.notes[0].title).toBe("Note");
    expect(snapshot.tasks).toHaveLength(0);
  });
});
