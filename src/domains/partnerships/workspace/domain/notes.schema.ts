import { z } from "zod";
import type { WorkspaceNote } from "./notes";

export const WorkspaceNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  updatedAt: z.string(),
});

export const WorkspaceNotesSchema = z.array(WorkspaceNoteSchema);

export function parseWorkspaceNotes(data: unknown): WorkspaceNote[] {
  return WorkspaceNotesSchema.parse(data);
}
