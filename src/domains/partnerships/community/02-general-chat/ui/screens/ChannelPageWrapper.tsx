import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";
import { ChannelPage } from "@/domains/partnerships/community/shared/components";
import { GeneralChatScreen, channelNavDefaults } from "./GeneralChatScreen";

export function GeneralChannelPage() {
  return (
    <ChannelPage
      channel={communityChannels.general}
      initialNavState={channelNavDefaults}
      showFloatingNavButton={false}
    >
      <GeneralChatScreen withShell={false} />
    </ChannelPage>
  );
}
