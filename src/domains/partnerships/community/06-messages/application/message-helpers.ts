import type { ConversationMessage, ConversationMessageInput, ThreadPage } from "../domain/schema";

export type GroupedMessages = Array<{ label: string; messages: ConversationMessage[] }>;

function toDateKey(timestamp?: string): string {
  if (!timestamp) return new Date().toISOString().slice(0, 10);
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function groupMessagesByDay(messages: ConversationMessage[]): GroupedMessages {
  const buckets = new Map<string, ConversationMessage[]>();
  messages.forEach((msg) => {
    const key = toDateKey(msg.timestamp); // YYYY-MM-DD
    const list = buckets.get(key) ?? [];
    list.push(msg);
    buckets.set(key, list);
  });
  return Array.from(buckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, msgs]) => ({ label: new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric" }), messages: msgs }));
}

export function appendPage(existing: ThreadPage, next: ThreadPage): ThreadPage {
  if (existing.threadId !== next.threadId) return next;
  return {
    ...next,
    messages: [...existing.messages, ...next.messages],
  };
}

export function buildOptimisticMessage(partial: Pick<ConversationMessage, "content"> & Partial<ConversationMessage>): ConversationMessage {
  const now = new Date();
  return {
    id: partial.id ?? `optimistic-${now.getTime()}`,
    authorName: partial.authorName ?? "You",
    authorInitials: partial.authorInitials ?? "YOU",
    direction: partial.direction ?? "outgoing",
    content: partial.content,
    timestamp: partial.timestamp ?? now.toISOString(),
    sentiment: partial.sentiment,
    attachments: partial.attachments,
    authorTitle: partial.authorTitle,
  };
}
