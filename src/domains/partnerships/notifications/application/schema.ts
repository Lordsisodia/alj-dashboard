import { z } from "zod";

export const NotificationUserSchema = z.object({
  name: z.string(),
  avatar: z.string().url().optional(),
  fallback: z.string().optional(),
});

export const NotificationFileSchema = z
  .object({
    name: z.string(),
    size: z.string().optional(),
    type: z.string().optional(),
  })
  .partial()
  .strict();

export const NotificationItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  user: NotificationUserSchema,
  action: z.string(),
  target: z.string().optional(),
  content: z.string().optional(),
  timestamp: z.string(),
  timeAgo: z.string().optional(),
  isRead: z.boolean().optional(),
  hasActions: z.boolean().optional(),
  file: NotificationFileSchema.optional(),
});

export const NotificationsPayloadSchema = z.array(NotificationItemSchema);

export type NotificationItem = z.infer<typeof NotificationItemSchema>;
