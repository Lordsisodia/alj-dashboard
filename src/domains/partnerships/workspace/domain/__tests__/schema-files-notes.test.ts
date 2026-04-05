import { describe, expect, it } from "vitest";
import { parseWorkspaceFiles } from "../files.schema";
import { parseWorkspaceNotes } from "../notes.schema";

describe("workspace files/notes schema", () => {
  it("parses files", () => {
    const files = parseWorkspaceFiles([{ id: "f1", name: "Doc", sizeKb: 10, uploadedAt: "2025-01-01", type: "pdf" }]);
    expect(files[0].name).toBe("Doc");
  });

  it("parses notes", () => {
    const notes = parseWorkspaceNotes([{ id: "n1", title: "Note", content: "Body", updatedAt: "2025-01-01" }]);
    expect(notes[0].title).toBe("Note");
  });
});
