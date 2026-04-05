// @ts-nocheck
import type { ConversationMessageInput } from "../domain/schema";
import { buildOptimisticMessage } from "./message-helpers";
import type { ConversationMessageInput } from "../domain/schema";

export type OptimisticSendResult = {
  optimisticMessage: ReturnType<typeof buildOptimisticMessage>;
  revert: () => void;
};

export function createOptimisticSend(
  addMessage: (message: ReturnType<typeof buildOptimisticMessage>) => void,
  removeMessage: (id: string) => void,
) {
  return (input: Pick<ConversationMessageInput, "content"> & Partial<ConversationMessageInput>): OptimisticSendResult => {
    const optimisticMessage = buildOptimisticMessage({
      ...input,
      id: input.id ?? `optimistic-${Date.now()}`,
    });
    addMessage(optimisticMessage);
    return {
      optimisticMessage,
      revert: () => removeMessage(optimisticMessage.id),
    };
  };
}
