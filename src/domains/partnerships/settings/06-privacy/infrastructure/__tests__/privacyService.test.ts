import { describe, expect, it } from "vitest";
import { createMockPrivacyService } from "../privacyService";

const service = createMockPrivacyService();

describe("MockPrivacyService", () => {
  it("returns privacy settings", async () => {
    const settings = await service.getSettings();
    expect(settings.profileVisibility).toBe("partners-only");
  });

  it("updates settings with validation", async () => {
    const updated = await service.updateSettings({ marketingConsent: true });
    expect(updated.marketingConsent).toBe(true);
  });
});
