import { Device, DeviceRevokePayload } from "../domain/types";
import { DevicesSchema, DeviceSchema } from "../domain/schema";

export interface DevicesService {
  list(): Promise<Device[]>;
  revoke(payload: DeviceRevokePayload): Promise<{ success: boolean }>;
}

export class MockDevicesService implements DevicesService {
  private devices: Device[] = DevicesSchema.parse([
    {
      id: "device-current",
      name: "MacBook Pro",
      type: "laptop",
      lastActive: "2025-11-26T12:00:00Z",
      location: "New York, NY",
      trusted: true,
    },
    {
      id: "device-2",
      name: "iPhone 15",
      type: "mobile",
      lastActive: "2025-11-24T20:10:00Z",
      location: "Brooklyn, NY",
    },
  ]);

  async list(): Promise<Device[]> {
    return DevicesSchema.parse(this.devices);
  }

  async revoke(payload: DeviceRevokePayload): Promise<{ success: boolean }> {
    // keep additive/non-destructive: do not mutate the list
    DeviceSchema.shape.id.parse(payload.deviceId);
    return { success: true };
  }
}

export function createMockDevicesService(): DevicesService {
  return new MockDevicesService();
}
