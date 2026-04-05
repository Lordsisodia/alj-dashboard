import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticleScreen } from "@/domains/partnerships/community/08-help-center/ui";
import type { HelpArticle } from "@/domains/partnerships/community/08-help-center/domain";
import { findHelpArticle, listHelpCollections } from "@/domains/partnerships/community/shared/application/community-service";
import { MobileNavigationProvider } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Help Article • SISO Partner Community",
};

export async function generateStaticParams() {
  try {
      const collections = await listHelpCollections();
      return collections.flatMap((collection) =>
        collection.articles.map((article: HelpArticle) => ({
          collection: collection.slug,
          article: article.slug,
        })),
      );
  } catch {
    return [];
  }
}

export default async function PartnersCommunityHelpArticlePage(props: any) {
  const collection = props?.params?.collection;
  const article = props?.params?.article;
  const result = await findHelpArticle(collection, article);
  if (!result.collection || !result.article) {
    notFound();
  }

  return (
    <MobileNavigationProvider
      initialState={{ activeTab: "messages", previousTab: "messages", isImmersiveMode: true }}
    >
      <HelpArticleScreen collection={result.collection} article={result.article} />
    </MobileNavigationProvider>
  );
}
