"use client";

import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChatViewport } from "../components/mobile/ChatViewport";
import { DirectoryOverlay } from "../components/mobile/DirectoryOverlay";
import {
  demoConversation,
  demoDirectoryContacts,
  demoThreads,
} from "../../data/conversation-fixtures";
import { useHydrateOnView } from "@/domains/shared/hooks/useHydrateOnView";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";
import { buildOptimisticMessage, groupMessagesByDay } from "@/domains/partnerships/community/06-messages/application/message-helpers";

const LazyComposerBar = dynamic(() => import("../components/mobile/ComposerBar").then((mod) => ({ default: mod.ComposerBar })), {
  ssr: false,
});

function ComposerFallback({ minHeight }: { minHeight: number }) {
  return (
    <div
      className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.35em] text-white/50"
      style={{ minHeight }}
    >
      Preparing composer...
    </div>
  );
}

export function MessagesScreen() {
  const [messages, setMessages] = useState(demoConversation);
  const [draftValue, setDraftValue] = useState("");
  const [composerHeight, setComposerHeight] = useState(0);
  const [isDirectoryOpen, setDirectoryOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(demoThreads[0]?.id);
  const { ref: composerRef, hydrated: composerHydrated } = useHydrateOnView<HTMLDivElement>({ rootMargin: "200px 0px" });
  const fallbackComposerHeight = 136;
  const effectiveComposerHeight = composerHydrated ? composerHeight : fallbackComposerHeight;

  const outgoing = useMemo(() => demoDirectoryContacts.slice(0, 1), []);
  const blocked = useMemo(() => demoDirectoryContacts.slice(1), []);

  const handleSend = useCallback(() => {
    if (!draftValue.trim()) return;
    const optimistic = buildOptimisticMessage({
      content: draftValue.trim(),
      authorName: "You",
      authorInitials: "YOU",
      direction: "outgoing",
    });
    setMessages((prev) => [...prev, optimistic]);
    setDraftValue("");
  }, [draftValue]);

  const activeThread = demoThreads.find((thread) => thread.id === activeThreadId) ?? demoThreads[0];
  const threadStatus = activeThread?.badge ? `${activeThread.badge} • ${activeThread.timestamp ?? "Live"}` : activeThread?.timestamp;
  const { openDrawer } = useMobileNavigation();
  const groupedMessages = useMemo(() => groupMessagesByDay(messages), [messages]);

  // Hide floating nav button to match submit-client experience
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.hideFloatingNavButton;
    root.dataset.hideFloatingNavButton = "true";
    return () => {
      if (previous) root.dataset.hideFloatingNavButton = previous;
      else delete root.dataset.hideFloatingNavButton;
    };
  }, []);

  return (
    <>
      <DirectoryOverlay
        isOpen={isDirectoryOpen}
        variant="messages"
        threads={demoThreads}
        activeThreadId={activeThreadId}
        onClose={() => setDirectoryOpen(false)}
        onSelectThread={(nextId) => {
          setActiveThreadId(nextId);
          setDirectoryOpen(false);
        }}
        outgoingRequests={outgoing}
        blockedUsers={blocked}
      />
      <section className="relative min-h-screen bg-siso-bg-primary text-white">
        <TierProgressBackdrop />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6">
          <ChatViewport
            threadName={activeThread?.name ?? "Partner Thread"}
            threadStatus={threadStatus}
            avatarLabel={activeThread?.name.slice(0, 2).toUpperCase() ?? "PT"}
            isDirectoryOpen={isDirectoryOpen}
            onOpenDirectory={() => setDirectoryOpen(true)}
            showAppDrawerButton
            showBurger
            showDirectoryToggle
            onOpenAppDrawer={openDrawer}
            contentOffset={effectiveComposerHeight + 32}
            maxWidthClassName="mx-auto w-full max-w-2xl px-2"
            showHeader
          >
            <div className="space-y-4 pb-4">
              {groupedMessages.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-center text-[11px] uppercase tracking-[0.25em] text-white/50">{group.label}</p>
                  <div className="space-y-3">
                    {group.messages.map((message) => (
                      <ChatBubble key={message.id} message={message} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ChatViewport>
          <div ref={composerRef} aria-live="polite">
            {composerHydrated ? (
              <Suspense fallback={<ComposerFallback minHeight={fallbackComposerHeight} />}>
                <LazyComposerBar
                  onHeightChange={setComposerHeight}
                  maxWidthClassName="mx-auto w-full max-w-2xl px-2"
                  inputValue={draftValue}
                  onInputChange={setDraftValue}
                  onSend={handleSend}
                  sendDisabled={!draftValue.trim()}
                  topSlot={
                    <div className="rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.35em] text-white/60">
                      Live partner broadcast
                    </div>
                  }
                />
              </Suspense>
            ) : (
              <ComposerFallback minHeight={fallbackComposerHeight} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ChatBubble({ message }: { message: (typeof demoConversation)[number] }) {
  const isOutgoing = message.direction === "outgoing";
  return (
    <div className={cn("flex items-start gap-2", isOutgoing ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border",
          isOutgoing ? "order-2 border-siso-orange/40 bg-siso-orange/20" : "order-1 border-siso-orange/20 bg-siso-orange/15",
        )}
      >
        {isOutgoing ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-siso-text-primary">YOU</span>
        ) : (
          <Image src="/branding/siso-logo.svg" alt="SISO" width={20} height={20} className="h-5 w-5" priority={false} />
        )}
      </div>
      <div className={cn("flex max-w-[82%] flex-col gap-1", isOutgoing ? "order-1 items-end text-right" : "order-2 items-start text-left")}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          <span className="text-white">{message.authorName}</span>
          {message.authorTitle ? <span className="text-white/45">{message.authorTitle}</span> : null}
          {message.timestamp ? <span>{message.timestamp}</span> : null}
        </div>
        <div
          className={cn(
            "rounded-3xl px-4 py-2 text-sm shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
            isOutgoing
              ? "rounded-br border border-siso-orange/40 bg-siso-orange text-[#120600]"
              : "rounded-bl border border-white/12 bg-siso-bg-tertiary text-white",
          )}
        >
          {message.content}
        </div>
        {message.attachments?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.attachments.map((chip) => (
              <span key={chip.id} className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/80">
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
        {message.sentiment ? (
          <p
            className={cn(
              "text-xs",
              message.sentiment === "positive"
                ? "text-emerald-300"
                : message.sentiment === "warning"
                  ? "text-amber-300"
                  : "text-white/70",
            )}
          >
            {message.sentiment}
          </p>
        ) : null}
      </div>
    </div>
  );
}
