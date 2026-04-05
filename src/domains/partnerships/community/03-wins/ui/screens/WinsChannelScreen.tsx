import {
  CommunityChannelScreen,
  type CommunityChannelScreenConfig,
} from "@/domains/partnerships/community/02-general-chat/ui";
import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";

const channel = communityChannels.wins;

const winsChannelConfig: CommunityChannelScreenConfig = {
  channelId: "wins",
  threadName: "Wins",
  avatarLabel: "WN",
  hero: {
    icon: <channel.icon className="h-4 w-4" />,
    title: "Celebrate wins",
    subtitle: channel.description,
    body: "Share the before/after, outcome, and lessons. Posting unlocks once you reach Active tier after the intro challenge.",
    pill: "Read-only",
  },
  highlightsSubtitle: "Channel pulse",
  guidelinesSubtitle: "Win-sharing best practices",
  quickLinksSubtitle: "Helpful shortcuts",
  pinnedSubtitle: "Pinned reminders",
  composerMode: "locked",
  backgroundVariant: "waves",
  showFloatingNavButton: false,
};

export function WinsChannelScreen({ withShell = true }: { withShell?: boolean } = {}) {
  return <CommunityChannelScreen config={winsChannelConfig} withShell={withShell} />;
}
