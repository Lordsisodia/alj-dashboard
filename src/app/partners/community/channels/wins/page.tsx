import type { Metadata } from "next";
import { WinsChannelPage } from "@/domains/partnerships/community/03-wins/ui";
import { communityChannels } from "@/domains/partnerships/community/shared/data/channelPresets";

const channel = communityChannels.wins;

export const metadata: Metadata = {
  title: "Wins • SISO Partner Community",
  description: channel.description,
};

export default function PartnersCommunityWinsPage() {
  return <WinsChannelPage />;
}
