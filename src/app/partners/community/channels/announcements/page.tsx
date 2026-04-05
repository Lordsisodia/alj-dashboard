import type { Metadata } from "next";
import { AnnouncementsChannelPage } from "@/domains/partnerships/community/04-announcements/ui";

export const metadata: Metadata = {
  title: "Announcements • SISO Partner Community",
  description: "Official SISO updates, release notes, and program alerts.",
};

export default function PartnersCommunityChannelAnnouncementsPage() {
  return <AnnouncementsChannelPage />;
}
