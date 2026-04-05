import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSecuritySettings } from "../useSecuritySettings";
import type { SecurityService } from "../../infrastructure/securityService";

const baseSettings = {
  twoFactorEnabled: true,
  loginAlerts: true,
  activeSessions: [
    { id: "s1", device: "Mac", location: "NY", lastActive: new Date("2025-11-25T10:00:00Z"), current: true },
  ],
};

describe("useSecuritySettings", () => {
  it("loads settings and toggles login alerts", async () => {
    const getSettings = vi.fn<SecurityService["getSettings"]>().mockResolvedValue(baseSettings);
    const terminateSession = vi.fn<SecurityService["terminateSession"]>().mockResolvedValue({ success: true, terminated: baseSettings.activeSessions[0] });
    const toggleLoginAlerts = vi.fn<SecurityService["toggleLoginAlerts"]>().mockImplementation(async enabled => ({ ...baseSettings, loginAlerts: enabled }));

    const service: SecurityService = { getSettings, terminateSession, toggleLoginAlerts };

    const { result } = renderHook(() => useSecuritySettings(service));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings?.loginAlerts).toBe(true);

    await act(async () => {
      await result.current.toggleLoginAlerts(false);
    });

    expect(toggleLoginAlerts).toHaveBeenCalledWith(false);
    expect(result.current.settings?.loginAlerts).toBe(false);
  });
});
