// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDevices } from "../useDevices";
import type { Device } from "../../domain/types";

const mockDevices: Device[] = [
  { id: "1", name: "MacBook Pro", type: "laptop", location: "SF", lastActive: "2025-11-26" },
];

describe("useDevices", () => {
  it("loads devices and can revoke", async () => {
    const list = vi.fn().mockResolvedValue(mockDevices);
    const revoke = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useDevices({
        list,
        revoke,
      } as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.devices).toHaveLength(1);
    expect(result.current.error).toBeNull();

    await result.current.revoke("1");
    expect(revoke).toHaveBeenCalledWith({ deviceId: "1" });
  });

  it("surfaces errors", async () => {
    const list = vi.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() =>
      useDevices({
        list,
        revoke: vi.fn(),
      } as any),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});
