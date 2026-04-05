import { describe, expect, it, vi } from "vitest";
import { getNotifications } from "../notification-service";
import * as fixtures from "../../ui/fixtures/notification-fixtures";

describe("notification-service", () => {
  it("parses fixtures successfully", async () => {
    const result = await getNotifications();
    expect(result.error).toBeNull();
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("handles validation failure gracefully", async () => {
    const spy = vi.spyOn(fixtures, "mockNotifications", "get").mockReturnValueOnce([
      { id: "bad-id", type: "oops" },
    ] as any);

    const result = await getNotifications();
    expect(result.error).toBeTruthy();
    expect(result.items).toEqual([]);

    spy.mockRestore();
  });
});
