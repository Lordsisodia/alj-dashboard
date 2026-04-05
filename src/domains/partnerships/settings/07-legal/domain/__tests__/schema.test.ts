import { describe, expect, it } from "vitest";
import { parseLegalSettings, LegalDocumentIdSchema, LegalSettingsSchema } from "../schema";

const document = {
  id: "terms" as const,
  title: "Terms of Service",
  description: "Usage terms",
  href: "/partners/settings/legal/terms-of-service",
  status: "Last updated: Nov 2024",
  lastUpdated: new Date("2024-11-01T00:00:00Z"),
  requiresAcknowledgement: true,
  version: "v2",
};

describe("LegalSettingsSchema", () => {
  it("parses a list of legal documents", () => {
    const parsed = parseLegalSettings({ documents: [document], highlightedIds: ["terms"] });
    expect(parsed.documents[0].title).toBe("Terms of Service");
    expect(parsed.highlightedIds?.[0]).toBe("terms");
    expect(parsed.documents[0].version).toBe("v2");
  });

  it("rejects unknown document ids", () => {
    expect(() => LegalDocumentIdSchema.parse("random-id" as unknown)).toThrow();
  });

  it("rejects missing documents", () => {
    expect(() => LegalSettingsSchema.parse({ documents: [] })).toThrow();
  });
});
