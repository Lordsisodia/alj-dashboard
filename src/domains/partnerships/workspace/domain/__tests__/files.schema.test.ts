// @vitest-environment node
import { describe, expect, it } from "vitest";
import { WorkspaceFileSchema } from "../files.schema";

describe("workspace file schema", () => {
  it("parses valid file", () => {
    const file = { id: "f1", name: "deck.pdf", sizeKb: 1200, uploadedAt: "2025-11-20", type: "application/pdf" };
    const parsed = WorkspaceFileSchema.parse(file);
    expect(parsed.name).toBe("deck.pdf");
  });

  it("rejects negative size", () => {
    const bad = { id: "f1", name: "deck.pdf", sizeKb: -1, uploadedAt: "2025-11-20", type: "application/pdf" } as unknown;
    expect(() => WorkspaceFileSchema.parse(bad)).toThrow();
  });
});
