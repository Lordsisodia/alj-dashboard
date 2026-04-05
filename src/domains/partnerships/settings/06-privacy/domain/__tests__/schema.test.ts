import { describe, expect, it } from "vitest";
import { parsePrivacySettings, PrivacySettingsSchema } from "../schema";

const base = {
  profileVisibility: "partners-only" as const,
  showEmail: true,
  showPhone: false,
  dataProcessingConsent: true,
  marketingConsent: false,
  consentAudit: [
    { action: "consent-granted", actor: "user", at: new Date("2025-11-20T00:00:00Z") },
  ],
};

describe("PrivacySettingsSchema", () => {
  it("parses valid privacy settings", () => {
    const parsed = parsePrivacySettings(base);
    expect(parsed.profileVisibility).toBe("partners-only");
  });

  it("rejects invalid visibility", () => {
    expect(() => PrivacySettingsSchema.parse({ ...base, profileVisibility: "everyone" })).toThrow();
  });

  it("rejects invalid audit entry", () => {
    expect(() =>
      PrivacySettingsSchema.parse({
        ...base,
        consentAudit: [{ action: "bad", actor: "user", at: new Date() }] as any,
      })
    ).toThrow();
  });
});
