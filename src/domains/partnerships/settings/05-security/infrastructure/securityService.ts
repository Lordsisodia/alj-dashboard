import { SecuritySettings, Session } from "../domain/types";
import { SecuritySettingsSchema, SessionSchema } from "../domain/schema";

export interface SecurityService {
  getSettings(): Promise<SecuritySettings>;
  terminateSession(sessionId: string): Promise<{ success: boolean; terminated?: Session }>; 
  toggleLoginAlerts(enabled: boolean): Promise<SecuritySettings>;
}

export class MockSecurityService implements SecurityService {
  private settings = SecuritySettingsSchema.parse({
    twoFactorEnabled: true,
    loginAlerts: true,
    recoveryEmail: "security@example.com",
    recoveryPhone: "+12025550123",
    activeSessions: [
      {
        id: "session-1",
        device: "MacBook Pro",
        location: "New York, NY",
        lastActive: new Date("2025-11-25T10:00:00Z"),
        current: true,
      },
      {
        id: "session-2",
        device: "iPhone 15",
        location: "Brooklyn, NY",
        lastActive: new Date("2025-11-20T08:00:00Z"),
        current: false,
      },
    ],
  });

  async getSettings(): Promise<SecuritySettings> {
    return SecuritySettingsSchema.parse(this.settings);
  }

  async terminateSession(sessionId: string): Promise<{ success: boolean; terminated?: Session }> {
    const match = this.settings.activeSessions.find(session => session.id === sessionId);
    if (!match) return { success: false };

    // Non-destructive: return payload but do not mutate state
    SessionSchema.parse(match);
    return { success: true, terminated: match };
  }

  async toggleLoginAlerts(enabled: boolean): Promise<SecuritySettings> {
    this.settings = SecuritySettingsSchema.parse({
      ...this.settings,
      loginAlerts: enabled,
    });
    return this.settings;
  }
}

export function createMockSecurityService(): SecurityService {
  return new MockSecurityService();
}
