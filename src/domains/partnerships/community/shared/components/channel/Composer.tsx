 "use client";

import { Paperclip, SmilePlus, SendHorizontal, Lock, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nestedCardClass, stackedPanelClass, primaryGradientButtonClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import type { AnalyticsHandler } from "./types";

interface ComposerProps {
  access: CommunityChannelPreset["access"];
  composer: CommunityChannelPreset["composer"];
  channelId: string;
  onAnalytics?: AnalyticsHandler;
}

export function Composer({ access, composer, channelId, onAnalytics }: ComposerProps) {
  const locked = access === "read-only";
  const track = (event: string, payload?: Record<string, unknown>) =>
    onAnalytics?.(event, { channelId, ...payload });

  return (
    <div className={cn(stackedPanelClass, "p-5 bg-siso-bg-secondary/70")}>
      <div className="flex items-center gap-2 text-sm font-semibold text-siso-text-secondary">
        {locked ? <Lock className="h-4 w-4 text-amber-300" /> : <UsersRound className="h-4 w-4 text-emerald-300" />}
        {locked ? "Posting locked" : "Start a new thread"}
      </div>
      <div className={cn(nestedCardClass, "mt-3 border border-white/15 bg-transparent p-0")}>
        <textarea
          placeholder={composer.placeholder}
          disabled={locked}
          aria-label="Channel message composer"
          className="h-28 w-full resize-none rounded-2xl bg-transparent p-4 text-sm placeholder:text-siso-text-muted focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-siso-text-muted">
            <button
              aria-label="Attach file"
              className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white"
              disabled={locked}
              onClick={() => track("channel_attach_file")}
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              aria-label="Add emoji"
              className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white"
              disabled={locked}
              onClick={() => track("channel_add_emoji")}
            >
              <SmilePlus className="h-4 w-4" />
            </button>
          </div>
          <Button
            className={primaryGradientButtonClass}
            size="sm"
            disabled={locked}
            aria-label="Share message"
            onClick={() => track("channel_share_message")}
          >
            <SendHorizontal className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      {locked && composer.lockedCopy ? (
        <p className="mt-3 text-sm text-siso-text-muted">{composer.lockedCopy}</p>
      ) : null}
      {!locked && composer.helperText ? (
        <p className="mt-3 text-xs text-siso-text-muted">{composer.helperText}</p>
      ) : null}
    </div>
  );
}
