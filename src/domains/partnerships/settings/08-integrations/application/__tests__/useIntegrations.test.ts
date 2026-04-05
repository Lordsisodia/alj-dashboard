import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIntegrations } from "../useIntegrations";
import type { IntegrationsService } from "../../infrastructure/integrationsService";

const baseList = [
  {
    id: "slack",
    name: "Slack",
    type: "slack" as const,
    connected: true,
    connectedAt: new Date("2025-11-20T12:00:00Z"),
    permissions: ["chat:write"],
  },
  {
    id: "notion",
    name: "Notion",
    type: "notion" as const,
    connected: false,
    permissions: ["database:read"],
  },
];

describe("useIntegrations", () => {
  it("loads integrations and connects", async () => {
    const list = vi.fn<IntegrationsService["list"]>().mockResolvedValue(baseList);
    const connect = vi.fn<IntegrationsService["connect"]>().mockResolvedValue({ ...baseList[1], connected: true });
    const disconnect = vi.fn<IntegrationsService["disconnect"]>().mockResolvedValue({ ...baseList[0], connected: false });

    const service: IntegrationsService = { list, connect, disconnect };
    const { result } = renderHook(() => useIntegrations(service));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.integrations).toHaveLength(2);
    expect(list).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.connect("notion");
    });

    expect(connect).toHaveBeenCalledWith("notion");
    expect(result.current.integrations.find(i => i.id === "notion")?.connected).toBe(true); // optimistic
    expect(list).toHaveBeenCalledTimes(1); // no redundant refresh
  });
});
