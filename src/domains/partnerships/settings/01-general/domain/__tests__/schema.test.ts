import { describe, expect, it } from "vitest";
import { GeneralSettingsSchema } from "../schema";

describe("GeneralSettingsSchema", () => {
  const base = {
    appearance: {
      theme: "dark",
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
      hapticsEnabled: true,
    },
    language: {
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/dd/yyyy",
      timeFormat: "12h",
      numberFormat: "en-US",
      currency: "USD",
    },
    notifications: {
      email: true,
      push: true,
      inApp: true,
      categories: {
        deals: true,
        messages: true,
        tasks: true,
        updates: false,
        announcements: true,
        reminders: true,
      },
      frequency: "immediate",
      quietHours: { enabled: false, start: "22:00", end: "08:00" },
    },
    integrations: [],
    lastUpdated: new Date(),
    version: "1.0.0",
    deviceId: "device-123",
  };

  it("parses valid settings", () => {
    const parsed = GeneralSettingsSchema.parse(base);
    expect(parsed.appearance.theme).toBe("dark");
  });

  it("rejects invalid theme", () => {
    expect(() => GeneralSettingsSchema.parse({ ...base, appearance: { ...base.appearance, theme: "nope" } })).toThrow();
  });
});
