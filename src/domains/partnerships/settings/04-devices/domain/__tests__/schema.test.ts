import { describe, expect, it } from "vitest";
import { DeviceSchema, parseDevice, parseDevices } from "../schema";

const base = {
  id: "device-1",
  name: "MacBook Pro",
  type: "laptop" as const,
  lastActive: "2025-11-01T10:00:00Z",
  location: "New York, NY",
  trusted: true,
};

describe("DeviceSchema", () => {
  it("parses a single device", () => {
    const parsed = parseDevice(base);
    expect(parsed.name).toBe("MacBook Pro");
  });

  it("rejects an invalid device type", () => {
    expect(() => parseDevice({ ...base, type: "phone" })).toThrow();
  });
});

describe("DevicesSchema", () => {
  it("parses a list of devices", () => {
    const parsed = parseDevices([base]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("device-1");
  });
});
