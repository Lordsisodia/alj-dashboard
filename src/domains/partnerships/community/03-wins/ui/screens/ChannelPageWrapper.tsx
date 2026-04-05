import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";
import { ChannelPage } from "@/domains/partnerships/community/shared/components";
import { channelNavDefaults } from "@/domains/partnerships/community/02-general-chat/ui";
import { WinsChannelScreen } from "./WinsChannelScreen";

export function WinsChannelPage() {
  return (
    <ChannelPage channel={communityChannels.wins} initialNavState={channelNavDefaults} showFloatingNavButton={false}>
      <WinsChannelScreen withShell={false} />
    </ChannelPage>
  );
}
