 "use client";

import { Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelMessage } from "@/domains/partnerships/community/shared/data/channelPresets";
import { stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { relativeTime } from "./utils";

const BookmarkIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MessageCard = ({ message }: { message: ChannelMessage }) => (
  <article className={cn(stackedPanelClass, "p-5 text-white/85")}>
    <header className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 siso-inner-card-strong text-sm font-semibold text-white">
        {message.author.avatarInitials}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-white">{message.author.name}</p>
          {message.author.isTeam ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-siso-orange">
              SISO Team
            </span>
          ) : null}
          {message.author.tier ? (
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-siso-text-muted">
              {message.author.tier}
            </span>
          ) : null}
          <span className="text-xs text-siso-text-muted">{relativeTime(message.timestamp)}</span>
        </div>
        {message.author.role ? <p className="text-xs text-siso-text-muted">{message.author.role}</p> : null}
      </div>
    </header>
    <p className="mt-4 text-sm leading-relaxed text-siso-text-primary">{message.content}</p>
    {message.tags?.length ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {message.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-siso-border/40 px-2 py-0.5 text-xs text-siso-text-muted">
            #{tag}
          </span>
        ))}
      </div>
    ) : null}
    <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-siso-text-muted">
      {message.reactions?.map((reaction) => (
        <button
          key={reaction.emoji}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1",
            reaction.highlighted ? "border-emerald-400/50 text-emerald-200" : "border-siso-border/40",
          )}
        >
          <span>{reaction.emoji}</span>
          {reaction.count}
        </button>
      ))}
      {message.replies ? (
        <button className="inline-flex items-center gap-1 rounded-full border border-siso-border/40 px-3 py-1">
          <Reply className="h-3.5 w-3.5" />
          {message.replies} replies
        </button>
      ) : null}
      <button className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/70 hover:text-white">
        <BookmarkIcon />
        Save thread
      </button>
    </footer>
  </article>
);
