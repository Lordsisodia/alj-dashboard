import { describe, expect, it } from "vitest";
import { createMockLegalService } from "../legalService";

const service = createMockLegalService();

describe("MockLegalService", () => {
  it("lists legal documents", async () => {
    const { documents, highlightedIds } = await service.list();
    expect(documents.length).toBeGreaterThan(0);
    expect(highlightedIds?.[0]).toBe("terms");
  });

  it("acknowledges a document id", async () => {
    const result = await service.acknowledge("terms");
    expect(result.acknowledged).toBe(true);
    expect(result.id).toBe("terms");
  });
});
