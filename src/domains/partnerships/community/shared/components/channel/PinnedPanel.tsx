 "use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import { nestedCardClass, stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { relativeTime } from "./utils";

export const PinnedPanel = ({ pinned }: { pinned: CommunityChannelPreset["pinned"] }) => {
  if (!pinned.length) return null;
  return (
    <div className={cn(stackedPanelClass, "p-5")}> 
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Info className="h-4 w-4" />
        Pinned Highlights
      </div>
      <div className="mt-4 space-y-4">
        {pinned.map((pin) => (
          <div key={pin.id} className={cn(nestedCardClass, "p-4")}> 
            <p className="text-sm font-semibold text-white">{pin.title}</p>
            <p className="mt-1 text-xs text-siso-text-muted">{pin.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-siso-text-muted">
              <span>{pin.author}</span>
              <span>•</span>
              <span>{relativeTime(pin.timestamp)}</span>
            </div>
            {pin.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {pin.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-siso-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
