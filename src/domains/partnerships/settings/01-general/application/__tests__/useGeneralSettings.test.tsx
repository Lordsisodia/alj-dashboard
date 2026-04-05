// @vitest-environment jsdom
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGeneralSettings } from "../useGeneralSettings";
import type { GeneralSettingsData, SettingsStats } from "@/domains/partnerships/settings/01-general/domain/types";

const baseSettings: GeneralSettingsData = {
  appearance: {
    theme: "system",
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
  lastUpdated: new Date("2024-01-01"),
  version: "1.0.0",
  deviceId: "device-1",
};

const baseStats: SettingsStats = {
  completeness: 50,
  securityScore: 70,
  connectedIntegrations: 0,
  activeNotificationCategories: 4,
  lastSettingsUpdate: new Date("2024-01-01"),
};

const createService = () => ({
  getSettings: vi.fn().mockResolvedValue(baseSettings),
  getStats: vi.fn().mockResolvedValue(baseStats),
  updateSettings: vi.fn(),
  resetToDefaults: vi.fn(),
});

describe("useGeneralSettings", () => {
  it("loads settings and stats", async () => {
    const service = createService();
    const { result } = renderHook(() => useGeneralSettings(service as any));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.settings.currentTheme).toBe("system");
    expect(service.getSettings).toHaveBeenCalled();
    expect(service.getStats).toHaveBeenCalled();
  });

  it("applies optimistic update then rolls back on failure", async () => {
    const service = createService();
    service.updateSettings = vi.fn().mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useGeneralSettings(service as any));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const promise = result.current.updateSettings({ currentTheme: "dark" });
      // optimistic state applied immediately
      expect(result.current.settings.currentTheme).toBe("dark");
      await promise;
    });

    await waitFor(() => expect(result.current.error).toBe("Failed to update settings"));
    expect(result.current.settings.currentTheme).toBe("system");
  });

  it("persists server result on success", async () => {
    const service = createService();
    const updated = { ...baseSettings, appearance: { ...baseSettings.appearance, theme: "dark" as const } };
    service.updateSettings = vi.fn().mockResolvedValue(updated);

    const { result } = renderHook(() => useGeneralSettings(service as any));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateSettings({ currentTheme: "dark" });
    });

    expect(service.updateSettings).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.settings.currentTheme).toBe("dark");
  });
});
