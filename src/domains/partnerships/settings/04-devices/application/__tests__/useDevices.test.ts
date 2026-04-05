import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDevices } from "../useDevices";
import type { DevicesService } from "../../infrastructure/devicesService";

const device = {
  id: "device-1",
  name: "MacBook",
  type: "laptop" as const,
  lastActive: "2025-11-26T12:00:00Z",
};

describe("useDevices", () => {
  it("loads devices and can revoke", async () => {
    const list = vi.fn<DevicesService["list"]>().mockResolvedValue([device]);
    const revoke = vi.fn<DevicesService["revoke"]>().mockResolvedValue({ success: true });
    const service: DevicesService = { list, revoke };

    const { result } = renderHook(() => useDevices(service));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.devices).toHaveLength(1);
    expect(list).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.revoke(device.id);
    });

    expect(revoke).toHaveBeenCalledWith({ deviceId: device.id });
    expect(list).toHaveBeenCalledTimes(2); // refreshed
  });
});
