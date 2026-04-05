import type { Metadata } from "next";
import { GeneralChannelPage } from "@/domains/partnerships/community/02-general-chat/ui";

export const metadata: Metadata = {
  title: "General Chat • SISO Partner Community",
  description: "Program-wide channel for quick wins, questions, and updates.",
};

export default function PartnersCommunityGeneralChatPage() {
  return <GeneralChannelPage />;
}
