import type { Metadata } from "next";
import { AllPartnersChannelPage } from "@/domains/partnerships/community/07-all-partners/ui";

export const metadata: Metadata = {
  title: "All Partners • SISO Partner Community",
  description: "Search the full partner roster, find mentors, and start conversations.",
};

export default async function PartnersCommunityAllPartnersPage() {
  return <AllPartnersChannelPage />;
}
