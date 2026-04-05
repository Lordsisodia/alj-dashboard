import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";
import { ChannelPage } from "@/domains/partnerships/community/shared/components";
import { AllChannelsScreen } from "./AllChannelsScreen";

export function AllChannelsPage() {
  return (
    <ChannelPage
      channel={communityChannels.channels}
      initialNavState={{ activeDrawerSection: "community", activeTab: "campus", previousTab: "campus" }}
    >
      <AllChannelsScreen withShell={false} />
    </ChannelPage>
  );
}
