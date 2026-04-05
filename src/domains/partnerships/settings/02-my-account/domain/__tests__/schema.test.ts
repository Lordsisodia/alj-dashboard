import { describe, expect, it } from "vitest";
import { AccountSettingsSchema, parseAccountSettings } from "../schema";

describe("AccountSettingsSchema", () => {
  const base = {
    fields: [
      { id: "username", label: "Username", value: "user123", icon: {} },
      { id: "account-email", label: "Email", value: "test@example.com", icon: {} },
      { id: "account-phone", label: "Phone", value: "+12025550123", icon: {} },
    ],
    twoFactorActions: [
      { id: "totp", label: "Authenticator", description: "Add TOTP", ctaLabel: "Connect" },
    ],
  };

  it("parses valid data", () => {
    const parsed = parseAccountSettings(base);
    expect(parsed.fields).toHaveLength(3);
  });

  it("fails on missing field label", () => {
    expect(() => AccountSettingsSchema.parse({ ...base, fields: [{ id: "x", value: "a", icon: {} }] as any })).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => parseAccountSettings({ ...base, fields: [...base.fields, { id: "account-email", label: "Email", value: "nope", icon: {} }] })).toThrow();
  });

  it("rejects invalid phone", () => {
    expect(() => parseAccountSettings({ ...base, fields: [...base.fields, { id: "account-phone", label: "Phone", value: "123", icon: {} }] })).toThrow();
  });
});
