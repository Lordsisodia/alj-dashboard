import type { Metadata } from "next";
import { HelpCenterScreen } from "@/domains/partnerships/community/08-help-center/ui";
import { listHelpCollections } from "@/domains/partnerships/community/shared/application/community-service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Help Center • SISO Partner Community",
  description: "Search guides, browse collections, or reach Partner Success.",
};

export default async function PartnersCommunityHelpPage() {
  const collections = await listHelpCollections();
  return (
    <HelpCenterScreen collections={collections} />
  );
}
