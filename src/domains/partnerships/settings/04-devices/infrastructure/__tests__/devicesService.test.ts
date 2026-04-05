import { describe, expect, it } from "vitest";
import { createMockDevicesService } from "../devicesService";

describe("MockDevicesService", () => {
  const service = createMockDevicesService();

  it("lists devices with validated shape", async () => {
    const list = await service.list();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty("id");
  });

  it("revoke returns success without mutating list", async () => {
    const before = await service.list();
    const result = await service.revoke({ deviceId: before[0].id });
    const after = await service.list();

    expect(result.success).toBe(true);
    expect(after.length).toBe(before.length);
  });
});
