import { describe, expect, it } from "vitest";
import { createMockIntegrationsService } from "../integrationsService";

const service = createMockIntegrationsService();

describe("MockIntegrationsService", () => {
  it("lists integrations", async () => {
    const list = await service.list();
    expect(list.length).toBeGreaterThan(0);
  });

  it("connects an integration", async () => {
    const connected = await service.connect("notion");
    expect(connected?.connected).toBe(true);
  });

  it("disconnects an integration", async () => {
    const disconnected = await service.disconnect("slack");
    expect(disconnected?.connected).toBe(false);
  });
});
