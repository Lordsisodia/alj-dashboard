import { describe, expect, it } from "vitest";
import { parseSecuritySettings, SecuritySettingsSchema } from "../schema";

const base = {
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
  ],
};

describe("SecuritySettingsSchema", () => {
  it("parses valid security settings", () => {
    const parsed = parseSecuritySettings(base);
    expect(parsed.activeSessions[0].device).toBe("MacBook Pro");
  });

  it("rejects invalid recovery email", () => {
    expect(() =>
      SecuritySettingsSchema.parse({
        ...base,
        recoveryEmail: "bad",
      })
    ).toThrow();
  });

  it("rejects sessions with non-date lastActive", () => {
    expect(() =>
      SecuritySettingsSchema.parse({
        ...base,
        activeSessions: [{ ...base.activeSessions[0], lastActive: "yesterday" }],
      })
    ).toThrow();
  });
});
