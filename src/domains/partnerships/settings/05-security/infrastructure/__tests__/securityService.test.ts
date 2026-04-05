import { describe, expect, it } from "vitest";
import { createMockSecurityService } from "../securityService";

const service = createMockSecurityService();

describe("MockSecurityService", () => {
  it("returns security settings", async () => {
    const result = await service.getSettings();
    expect(result.twoFactorEnabled).toBe(true);
    expect(result.activeSessions.length).toBeGreaterThan(0);
  });

  it("terminates a known session without mutating list", async () => {
    const settings = await service.getSettings();
    const first = settings.activeSessions[0];

    const response = await service.terminateSession(first.id);
    expect(response.success).toBe(true);
    expect(response.terminated?.id).toBe(first.id);

    const unchanged = await service.getSettings();
    expect(unchanged.activeSessions.length).toBe(settings.activeSessions.length);
  });

  it("toggles login alerts", async () => {
    const updated = await service.toggleLoginAlerts(false);
    expect(updated.loginAlerts).toBe(false);
  });
});
