import { PrivacySettings } from "../domain/types";
import { PrivacySettingsSchema } from "../domain/schema";

export interface PrivacyService {
  getSettings(): Promise<PrivacySettings>;
  updateSettings(partial: Partial<PrivacySettings>): Promise<PrivacySettings>;
}

export class MockPrivacyService implements PrivacyService {
  private settings = PrivacySettingsSchema.parse({
    profileVisibility: "partners-only",
    showEmail: true,
    showPhone: false,
    dataProcessingConsent: true,
    marketingConsent: false,
    consentAudit: [
      { action: "consent-granted", actor: "user", at: new Date("2025-11-01T00:00:00Z") },
    ],
  });

  async getSettings(): Promise<PrivacySettings> {
    return PrivacySettingsSchema.parse(this.settings);
  }

  async updateSettings(partial: Partial<PrivacySettings>): Promise<PrivacySettings> {
    this.settings = PrivacySettingsSchema.parse({
      ...this.settings,
      ...partial,
    });
    return this.settings;
  }
}

export function createMockPrivacyService(): PrivacyService {
  return new MockPrivacyService();
}
