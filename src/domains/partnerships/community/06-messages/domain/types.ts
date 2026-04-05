export type AttachmentChip = {
  id: string;
  label: string;
  href?: string;
};

export type ConversationMessage = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorTitle?: string;
  direction: "incoming" | "outgoing";
  content: string;
  timestamp: string;
  sentiment?: "positive" | "neutral" | "warning";
  attachments?: AttachmentChip[];
};

export type ThreadOverview = {
  id: string;
  name: string;
  preview: string;
  timestamp?: string;
  unreadCount?: number;
  badge?: string;
  category?: string;
  status?: "active" | "draft" | "submitted" | "archived";
};

export type DirectoryContact = {
  id: string;
  name: string;
  note?: string;
  status?: string;
};
