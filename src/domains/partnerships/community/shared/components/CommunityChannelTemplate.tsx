import { cn } from "@/lib/utils";
import { type CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import {
  AnnouncementCard,
  ChannelHero,
  Composer,
  GuidelinePanel,
  MessageCard,
  PinnedPanel,
  QuickLinkPanel,
} from "./channel";
import type { AnalyticsHandler } from "./channel";

interface CommunityChannelTemplateProps {
  channel: CommunityChannelPreset | null;
  isLoading?: boolean;
  error?: string | null;
  onAnalytics?: AnalyticsHandler;
}

export function CommunityChannelTemplate({
  channel,
  isLoading = false,
  error = null,
  onAnalytics,
}: CommunityChannelTemplateProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary flex items-center justify-center px-4">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-amber-100 text-center">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary" role="status" aria-busy="true" aria-live="polite">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
          <div className="flex-1 space-y-4">
            <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
          <aside className="w-full max-w-xl space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </aside>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary flex items-center justify-center px-4">
        <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-center text-siso-text-muted">
          Channel not available right now.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
        <section className="flex-1 space-y-6">
          <ChannelHero channel={channel} />
          {channel.announcement ? (
            <AnnouncementCard
              title={channel.announcement.title}
              body={channel.announcement.body}
              pill={channel.announcement.pill}
            />
          ) : null}
          <Composer
            access={channel.access}
            composer={channel.composer}
            channelId={channel.id}
            onAnalytics={onAnalytics}
          />
          <div className="space-y-4">
            {channel.messages.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-siso-text-muted">
                No messages yet. Start the conversation.
              </div>
            ) : (
              channel.messages.map((message) => <MessageCard key={message.id} message={message} />)
            )}
          </div>
        </section>

        <aside className="w-full max-w-xl space-y-6">
          <PinnedPanel pinned={channel.pinned} />
          <GuidelinePanel guidelines={channel.guidelines} />
          <QuickLinkPanel links={channel.quickLinks} />
        </aside>
      </div>
    </div>
  );
}
