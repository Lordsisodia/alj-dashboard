import type { Metadata } from "next";
import { AllChannelsPage } from "@/domains/partnerships/community/05-all-channels/ui/screens/ChannelPageWrapper";

export const metadata: Metadata = {
  title: "All Channels • SISO Partner Community",
  description: "Browse every community channel with previews and guidelines.",
};

export default function PartnersCommunityAllChannelsPage() {
  return <AllChannelsPage />;
}
