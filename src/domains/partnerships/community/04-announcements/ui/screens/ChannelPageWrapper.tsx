import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";
import { ChannelPage } from "@/domains/partnerships/community/shared/components";
import { channelNavDefaults } from "@/domains/partnerships/community/02-general-chat/ui";
import { AnnouncementsScreen } from "./AnnouncementsScreen";

export function AnnouncementsChannelPage() {
  return (
    <ChannelPage channel={communityChannels.announcements} initialNavState={channelNavDefaults} showFloatingNavButton={false}>
      <AnnouncementsScreen withShell={false} />
    </ChannelPage>
  );
}
