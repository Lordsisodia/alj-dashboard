import { z } from "zod";
import type { WorkspaceFile } from "./files";

export const WorkspaceFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  sizeKb: z.number().nonnegative(),
  uploadedAt: z.string(),
  type: z.string(),
});

export const WorkspaceFilesSchema = z.array(WorkspaceFileSchema);

export function parseWorkspaceFiles(data: unknown): WorkspaceFile[] {
  return WorkspaceFilesSchema.parse(data);
}
