import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpCollectionScreen } from "@/domains/partnerships/community/08-help-center/ui";
import { findHelpCollection, listHelpCollections } from "@/domains/partnerships/community/shared/application/community-service";
import { MobileNavigationProvider } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Help Collection • SISO Partner Community",
};

export async function generateStaticParams() {
  try {
      const collections = await listHelpCollections();
      return collections.map((collection) => ({ collection: collection.slug }));
  } catch {
    return [];
  }
}

export default async function PartnersCommunityHelpCollectionPage(props: any) {
  const collectionSlug = props?.params?.collection;
  const collection = await findHelpCollection(collectionSlug);
  if (!collection) {
    notFound();
  }

  return (
    <MobileNavigationProvider
      initialState={{ activeTab: "messages", previousTab: "messages", isImmersiveMode: true }}
    >
      <HelpCollectionScreen collection={collection} />
    </MobileNavigationProvider>
  );
}
