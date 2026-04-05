import type { ConversationMessage } from "./types";

export function groupMessagesByDay(messages: ConversationMessage[]) {
  return messages.reduce<Record<string, ConversationMessage[]>>((acc, msg) => {
    const day = msg.timestamp.slice(0, 10);
    acc[day] = acc[day] ? [...acc[day], msg] : [msg];
    return acc;
  }, {});
}

export function paginateMessages(messages: ConversationMessage[], page = 1, pageSize = 20) {
  const size = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(messages.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * size;
  return {
    items: messages.slice(start, start + size),
    page: current,
    totalPages,
    pageSize: size,
    totalCount: messages.length,
  };
}

export function optimisticSend(messages: ConversationMessage[], draft: Omit<ConversationMessage, "id" | "direction">) {
  const optimisticMessage: ConversationMessage = {
    ...draft,
    id: `optimistic-${Date.now()}`,
    direction: "outgoing",
  };
  return [...messages, optimisticMessage];
}
