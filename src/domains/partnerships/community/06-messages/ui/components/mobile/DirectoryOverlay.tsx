"use client";

import type { DirectoryContact, ThreadOverview } from "../../../domain/types";
import { X, ArrowUpRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type { ThreadOverview };

type DirectoryOverlayProps = {
  variant?: "messages" | "client-submissions";
  isOpen: boolean;
  threads: ThreadOverview[];
  activeThreadId?: string;
  onClose: () => void;
  onSelectThread?: (threadId: string) => void;
  outgoingRequests?: DirectoryContact[];
  blockedUsers?: DirectoryContact[];
};

export function DirectoryOverlay({
  variant = "messages",
  isOpen,
  threads,
  activeThreadId,
  onClose,
  onSelectThread,
  outgoingRequests = [],
  blockedUsers = [],
}: DirectoryOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] flex bg-black/80 backdrop-blur">
      <button
        type="button"
        className="flex-1"
        aria-label="Close directory overlay"
        onClick={onClose}
      />
      <aside className="w-full max-w-md border-l border-white/10 bg-[#040404] text-white shadow-[0_0_80px_rgba(0,0,0,0.65)]">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              {variant === "client-submissions" ? "Saved drafts" : "Thread directory"}
            </p>
            <p className="text-lg font-semibold text-white">Switch threads</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/20 p-2 text-white/70 hover:text-white"
            onClick={onClose}
            aria-label="Close directory"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex flex-col gap-6 overflow-y-auto px-5 py-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Threads</p>
              <span className="text-xs text-white/50">{threads.length} live</span>
            </div>
            <div className="space-y-3">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => onSelectThread?.(thread.id)}
                    className={cn(
                      "w-full rounded-2xl border px-3 py-3 text-left transition-colors",
                      isActive
                        ? "border-siso-orange/60 bg-siso-orange/10 text-white"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/20",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                      <span>{thread.category ?? "Program"}</span>
                      {thread.badge ? <span className="text-[10px] text-white/70">{thread.badge}</span> : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-white">{thread.name}</p>
                    <p className="text-xs text-white/70">{thread.preview}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                      <span>{thread.timestamp ?? "Moments ago"}</span>
                      {typeof thread.unreadCount === "number" && thread.unreadCount > 0 ? (
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {thread.unreadCount} new
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {outgoingRequests.length ? (
            <section>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/50">Outgoing requests</p>
              <div className="space-y-2">
                {outgoingRequests.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-siso-orange" />
                      <span className="font-semibold text-white">{entry.name}</span>
                    </div>
                    {entry.note ? <p className="text-xs text-white/60">{entry.note}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {blockedUsers.length ? (
            <section>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/50">Blocked</p>
              <div className="space-y-2">
                {blockedUsers.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
                  >
                    <div>
                      <p className="font-semibold text-white">{entry.name}</p>
                      {entry.status ? <p className="text-xs text-white/50">{entry.status}</p> : null}
                    </div>
                    <Shield className="h-4 w-4 text-white/40" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
