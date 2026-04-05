import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePrivacySettings } from "../usePrivacySettings";
import type { PrivacyService } from "../../infrastructure/privacyService";

const base = {
  profileVisibility: "partners-only" as const,
  showEmail: true,
  showPhone: false,
  dataProcessingConsent: true,
  marketingConsent: false,
};

describe("usePrivacySettings", () => {
  it("loads and updates privacy settings", async () => {
    const getSettings = vi.fn<PrivacyService["getSettings"]>().mockResolvedValue(base);
    const updateSettings = vi.fn<PrivacyService["updateSettings"]>().mockImplementation(async partial => ({ ...base, ...partial }));

    const service: PrivacyService = { getSettings, updateSettings };
    const { result } = renderHook(() => usePrivacySettings(service));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings?.marketingConsent).toBe(false);

    await act(async () => {
      await result.current.update({ marketingConsent: true });
    });

    expect(updateSettings).toHaveBeenCalledWith({ marketingConsent: true });
    expect(result.current.settings?.marketingConsent).toBe(true);
  });
});
