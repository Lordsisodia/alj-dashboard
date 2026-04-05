import type { ThreadOverview } from "../DirectoryOverlay";
import { cn } from "@/domains/shared/utils/cn";

interface ThreadRowProps {
  thread: ThreadOverview;
  isActive: boolean;
  onSelect: () => void;
}

export function ThreadRow({ thread, isActive, onSelect }: ThreadRowProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-left transition shadow-[0_10px_24px_rgba(0,0,0,0.28)]",
        isActive
          ? "bg-gradient-to-br from-siso-orange/12 via-siso-orange/8 to-siso-orange/4 text-siso-text-primary border border-siso-orange/35"
          : "text-siso-text-secondary bg-white/4 border border-white/10 hover:border-white/18",
      )}
      onClick={onSelect}
    >
      <div
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-inner",
          isActive ? "bg-siso-orange/35 text-siso-orange" : "bg-siso-bg-tertiary text-siso-text-muted",
        )}
      >
        {thread.name.charAt(0)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-sm font-semibold">
          {thread.name}
          {thread.badge ? <span className="ml-1 text-xs text-siso-orange">{thread.badge}</span> : null}
        </p>
        <p className="truncate text-xs text-siso-text-muted">{thread.preview}</p>
      </div>
      {thread.unreadCount ? (
        <span className="rounded-full bg-siso-red/20 px-2 py-1 text-xs text-siso-red">{thread.unreadCount}</span>
      ) : null}
    </button>
  );
}
