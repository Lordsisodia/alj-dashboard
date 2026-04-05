import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicIndustryPage } from "@/domains/portfolio/public/PublicIndustryPage";
import { allClients } from "@/domains/portfolio/data";
import { getIndustryBySlug, industries } from "@/domains/portfolio/data/industries";

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }));
}

type RouteParams = Promise<{ industry: string }>;

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  if (!industry) {
    return { title: "Portfolio industry" };
  }
  return {
    title: industry.seoMetadata.title,
    description: industry.seoMetadata.description,
    openGraph: {
      title: industry.seoMetadata.title,
      description: industry.seoMetadata.description,
      url: `https://www.siso.agency/portfolio/${industry.slug}`,
    },
  };
}

export default async function PortfolioIndustryPage(props: any) {
  const { industry: slug } = await Promise.resolve(props?.params);
  const industry = getIndustryBySlug(slug);
  if (!industry) {
    notFound();
  }
  const projects = allClients.filter(
    (client) => client.metadata.showInPortfolio !== false && client.industry === industry.id,
  );
  const { icon: _icon, ...industrySerializable } = industry;
  return <PublicIndustryPage industry={industrySerializable} projects={projects} />;
}
