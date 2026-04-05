import { describe, expect, it, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAccountSettings } from "../useAccountSettings";
import type { AccountSettingsService } from "../../infrastructure/accountService";
import { parseAccountSettings } from "../../domain/schema";

const sample = parseAccountSettings({
  fields: [
    { id: "username", label: "Username", value: "user123", icon: {} },
    { id: "account-email", label: "Email", value: "user@example.com", icon: {} },
  ],
  twoFactorActions: [],
});

describe("useAccountSettings", () => {
  it("loads settings and handles errors", async () => {
    const get = vi.fn<NonNullable<AccountSettingsService["get"]>>().mockResolvedValue(sample);
    const svc: AccountSettingsService = { get };

    const { result } = renderHook(() => useAccountSettings(svc));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings?.fields[0].value).toBe("user123");

    get.mockRejectedValueOnce(new Error("fail"));
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
