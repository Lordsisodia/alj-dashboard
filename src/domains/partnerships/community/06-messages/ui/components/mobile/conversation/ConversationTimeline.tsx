"use client";

import type { ConversationMessage } from "../../../../domain/types";
import { cn } from "@/lib/utils";

type ConversationTimelineProps = {
  messages: ConversationMessage[];
};

const sentimentTone: Record<NonNullable<ConversationMessage["sentiment"]>, string> = {
  positive: "text-emerald-300",
  neutral: "text-white/70",
  warning: "text-amber-300",
};

export function ConversationTimeline({ messages }: ConversationTimelineProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-siso-text-muted">
        No messages yet. Start the conversation.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isOutgoing = message.direction === "outgoing";
        return (
          <article
            key={message.id}
            className={cn(
              "flex gap-2",
              isOutgoing ? "flex-row-reverse text-right" : "text-left",
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-semibold text-white/70">
                {message.authorInitials}
              </div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                {message.timestamp}
              </span>
            </div>
            <div
              className={cn(
                "flex-1 space-y-1 rounded-2xl border px-3 py-2 text-sm shadow",
                isOutgoing
                  ? "border-siso-orange/40 bg-siso-orange/10 text-white"
                  : "border-white/10 bg-white/5 text-white/85",
              )}
            >
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.35em] text-white/50">
                <span className="truncate">{message.authorName}</span>
                {message.authorTitle ? <span className="text-white/40">{message.authorTitle}</span> : null}
              </div>
              <p className="text-sm leading-relaxed text-white/90">{message.content}</p>
              {message.attachments?.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {message.attachments.map((chip) => (
                    <span
                      key={chip.id}
                      className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/80"
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              ) : null}
              {message.sentiment ? (
                <p className={cn("text-xs", sentimentTone[message.sentiment])}>{message.sentiment}</p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
