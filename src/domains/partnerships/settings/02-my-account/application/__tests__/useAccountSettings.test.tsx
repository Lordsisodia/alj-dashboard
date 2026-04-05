// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAccountSettings } from "../useAccountSettings";
import type { AccountSettingsParsed } from "../../domain/schema";

describe("useAccountSettings", () => {
  it("loads settings and exposes fields", async () => {
    const mockGet = vi.fn<[], Promise<AccountSettingsParsed>>().mockResolvedValue({
      fields: [{ id: "username", label: "Username", value: "@demo" }],
      twoFactorActions: [],
    } as any);

    const { result } = renderHook(() =>
      useAccountSettings({
        get: mockGet,
      } as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings?.fields[0].value).toBe("@demo");
    expect(result.current.hero.username).toBe("@demo");
    expect(result.current.error).toBeNull();
  });

  it("sets error on failure and stops loading", async () => {
    const mockGet = vi.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() =>
      useAccountSettings({
        get: mockGet,
      } as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});
