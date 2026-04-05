import { z } from "zod";

export const ChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  owner: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const ChecklistSchema = z.array(ChecklistItemSchema);

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export function parseChecklist(data: unknown): ChecklistItem[] {
  return ChecklistSchema.parse(data);
}
