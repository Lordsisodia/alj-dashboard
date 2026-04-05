import { z } from "zod";

export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["desktop", "laptop", "tablet", "mobile", "other"]),
  lastActive: z.string().optional(),
  location: z.string().optional(),
  trusted: z.boolean().optional(),
});

export type Device = z.infer<typeof DeviceSchema>;

export const DeviceRevokePayloadSchema = z.object({
  deviceId: z.string(),
  reason: z.string().optional(),
});

export const DevicesSchema = z.array(DeviceSchema);

export function parseDevice(input: unknown): Device {
  return DeviceSchema.parse(input);
}

export function parseDevices(input: unknown): Device[] {
  return DevicesSchema.parse(input);
}
