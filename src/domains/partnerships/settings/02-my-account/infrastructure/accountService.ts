import { AccountSettingsSchema, parseAccountSettings } from "../domain/schema";
import type { AccountSettingsParsed } from "../domain/schema";

export interface AccountSettingsService {
  get(): Promise<AccountSettingsParsed>;
}

export class MockAccountSettingsService implements AccountSettingsService {
  private settings: AccountSettingsParsed = parseAccountSettings({
    fields: [
      { id: "username", label: "Username", value: "@SISOagency", icon: {} },
      { id: "account-email", label: "Email", value: "hello@siso.agency", icon: {} },
      { id: "account-phone", label: "Phone", value: "+15555550123", icon: {} },
    ],
    twoFactorActions: [
      { id: "totp", label: "Authenticator", description: "Add TOTP", ctaLabel: "Connect" },
      { id: "sms", label: "SMS codes", description: "Send backup codes via SMS", ctaLabel: "Enable" },
    ],
  });

  async get(): Promise<AccountSettingsParsed> {
    return AccountSettingsSchema.parse(this.settings);
  }
}

export function createMockAccountSettingsService(): AccountSettingsService {
  return new MockAccountSettingsService();
}
