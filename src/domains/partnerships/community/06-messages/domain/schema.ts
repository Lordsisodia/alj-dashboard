import { z } from "zod";

export const AttachmentChipSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string().url().optional(),
});

export const ConversationMessageSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  authorInitials: z.string().max(4),
  authorTitle: z.string().optional(),
  direction: z.enum(["incoming", "outgoing"]),
  content: z.string(),
  timestamp: z.string(),
  sentiment: z.enum(["positive", "neutral", "warning"]).optional(),
  attachments: z.array(AttachmentChipSchema).optional(),
});

export const ThreadOverviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  preview: z.string(),
  timestamp: z.string().optional(),
  unreadCount: z.number().int().nonnegative().optional(),
  badge: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["active", "draft", "submitted", "archived"]).optional(),
});

export const ThreadPageSchema = z.object({
  threadId: z.string(),
  cursor: z.string().nullable(),
  messages: z.array(ConversationMessageSchema),
  hasMore: z.boolean(),
});

export type ConversationMessageInput = z.input<typeof ConversationMessageSchema>;
export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;
export type ThreadOverview = z.infer<typeof ThreadOverviewSchema>;
export type ThreadPage = z.infer<typeof ThreadPageSchema>;
