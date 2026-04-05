import type { Device } from "./types";

export function formatDeviceSummary(device: Device): string {
  const parts = [device.name];
  if (device.location) parts.push(device.location);
  if (device.lastActive) parts.push(`Last active ${device.lastActive}`);
  return parts.join(" · ");
}
