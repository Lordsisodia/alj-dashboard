import { z } from "zod";
import type { Mission } from "../data/missions";

export const MissionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  reward: z.string(),
  deadline: z.string(),
  status: z.enum(["active", "upcoming", "completed"]),
  progress: z.number().min(0).max(100),
  steps: z.array(z.string()).min(1),
});

export const MissionsSchema = z.array(MissionSchema);

export function parseMissions(data: unknown): Mission[] {
  return MissionsSchema.parse(data);
}
