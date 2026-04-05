// @vitest-environment node
import { describe, expect, it } from "vitest";
import { useWorkspacePanelsSnapshot, getWorkspaceTasks } from "../useWorkspacePanels";
import { saveWorkspaceTasks, resetWorkspaceStore } from "../../infrastructure/persistence";

describe("useWorkspacePanels snapshot", () => {
  it("returns persisted snapshot", () => {
    resetWorkspaceStore();
    saveWorkspaceTasks([{ id: "t1", title: "Review", status: "todo", priority: "high" }]);
    const snapshot = useWorkspacePanelsSnapshot();
    expect(snapshot.tasks[0].id).toBe("t1");
  });
});

describe("getWorkspaceTasks", () => {
  it("parses mock tasks", () => {
    const { tasks } = getWorkspaceTasks();
    expect(tasks.length).toBeGreaterThan(0);
  });
});
