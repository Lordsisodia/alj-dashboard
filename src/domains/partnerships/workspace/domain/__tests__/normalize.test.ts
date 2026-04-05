// @vitest-environment node
import { describe, expect, it } from "vitest";
import { normalizeTasks } from "../normalize";

describe("workspace normalize", () => {
  it("maps tasks by id", () => {
    const map = normalizeTasks([{ id: "t1", title: "Task", status: "todo", priority: "high" }]);
    expect(map.t1.title).toBe("Task");
  });
});
