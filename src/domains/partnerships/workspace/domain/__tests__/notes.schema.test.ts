// @vitest-environment node
import { describe, expect, it } from "vitest";
import { WorkspaceNoteSchema } from "../notes.schema";

describe("workspace note schema", () => {
  it("parses valid note", () => {
    const note = { id: "n1", title: "Retro", content: "Notes...", updatedAt: "2025-11-24" };
    const parsed = WorkspaceNoteSchema.parse(note);
    expect(parsed.title).toBe("Retro");
  });

  it("rejects missing content", () => {
    const bad = { id: "n1", title: "Retro", updatedAt: "2025-11-24" } as unknown;
    expect(() => WorkspaceNoteSchema.parse(bad)).toThrow();
  });
});
