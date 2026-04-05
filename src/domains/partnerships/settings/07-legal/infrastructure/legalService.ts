import { LegalDocumentId, LegalSettings } from "../domain/types";
import { LegalSettingsSchema, LegalDocumentIdSchema } from "../domain/schema";

export interface LegalService {
  list(): Promise<LegalSettings>;
  acknowledge(id: LegalDocumentId): Promise<{ acknowledged: boolean; id: LegalDocumentId }>;
}

export class MockLegalService implements LegalService {
  private settings = LegalSettingsSchema.parse({
    documents: [
      {
        id: "terms",
        title: "Terms of Service",
        description: "Usage terms",
        href: "/partners/settings/legal/terms-of-service",
        status: "Last updated: Nov 2024",
        lastUpdated: new Date("2024-11-01T00:00:00Z"),
        requiresAcknowledgement: true,
        version: "v2",
      },
      {
        id: "partner-agreement",
        title: "Partner Agreement",
        description: "Partner obligations and commissions",
        href: "/partners/settings/legal/partner-agreement",
        status: "Required for all partners",
        version: "v1",
      },
    ],
    highlightedIds: ["terms"],
  });

  async list(): Promise<LegalSettings> {
    return LegalSettingsSchema.parse(this.settings);
  }

  async acknowledge(id: LegalDocumentId): Promise<{ acknowledged: boolean; id: LegalDocumentId }> {
    LegalDocumentIdSchema.parse(id);
    // Non-destructive: mark acknowledged but keep data intact
    return { acknowledged: true, id };
  }
}

export function createMockLegalService(): LegalService {
  return new MockLegalService();
}
