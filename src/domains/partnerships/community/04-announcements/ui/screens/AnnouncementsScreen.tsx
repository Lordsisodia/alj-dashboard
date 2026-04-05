import { Megaphone } from "lucide-react";
import {
  CommunityChannelScreen,
  type CommunityChannelScreenConfig,
} from "@/domains/partnerships/community/02-general-chat/ui";

const announcementsConfig: CommunityChannelScreenConfig = {
  channelId: "announcements",
  threadName: "Announcements",
  avatarLabel: "AN",
  hero: {
    icon: <Megaphone className="h-4 w-4" />,
    title: "Program announcements",
    subtitle: "Official SISO updates, release notes, and program alerts.",
    body: "Only the SISO team can post here. Follow up in General Chat if you need clarity.",
    pill: "Team only",
  },
  highlightsSubtitle: "Signal from HQ",
  guidelinesSubtitle: "How to acknowledge updates",
  quickLinksSubtitle: "Docs & changelog",
  pinnedSubtitle: "Pinned updates",
  composerMode: "locked",
  backgroundVariant: "waves",
  showFloatingNavButton: false,
  detailsHeroShowCornerIcon: false,
  detailsHeroTitleClassName: "uppercase tracking-[0.3em] font-semibold text-xl",
};

export function AnnouncementsScreen({ withShell = true }: { withShell?: boolean } = {}) {
  return <CommunityChannelScreen config={announcementsConfig} withShell={withShell} />;
}
