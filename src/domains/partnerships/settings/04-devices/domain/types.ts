export type DeviceType = "desktop" | "laptop" | "tablet" | "mobile" | "other";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  lastActive?: string;
  location?: string;
  trusted?: boolean;
}

export interface DeviceRevokePayload {
  deviceId: string;
  reason?: string;
}
