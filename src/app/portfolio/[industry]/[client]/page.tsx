import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicClientPage } from "@/domains/portfolio/public/PublicClientPage";
import { allClients } from "@/domains/portfolio/data";
import { getIndustryBySlug, getIndustryById } from "@/domains/portfolio/data/industries";

export function generateStaticParams() {
  return allClients.map((client) => {
    const industry = getIndustryById(client.industry);
    return {
      industry: industry?.slug ?? client.industry,
      client: client.id,
    };
  });
}

type RouteParams = Promise<{ industry: string; client: string }>;

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { industry: industrySlug, client: clientId } = await params;
  const client = allClients.find((c) => c.id === clientId);
  if (!client) {
    return { title: "Portfolio project" };
  }
  return {
    title: `${client.name} • Case study`,
    description: client.tagline ?? client.description,
    openGraph: {
      title: `${client.name} Case Study`,
      description: client.tagline ?? client.description,
      url: `https://www.siso.agency/portfolio/${industrySlug}/${client.id}`,
    },
  };
}

export default async function PortfolioClientPage(props: any) {
  const { industry: industrySlug, client: clientId } = await Promise.resolve(props?.params);
  const client = allClients.find((c) => c.id === clientId && c.metadata.showInPortfolio !== false);
  if (!client) {
    notFound();
  }
  const industryFromSlug = getIndustryBySlug(industrySlug);
  const industry = industryFromSlug?.id === client.industry ? industryFromSlug : getIndustryById(client.industry);
  if (!industry) {
    notFound();
  }
  const related = allClients
    .filter((c) => c.id !== client.id && c.metadata.showInPortfolio !== false && c.industry === client.industry)
    .slice(0, 3);
  const { icon: _icon, ...industrySerializable } = industry;
  return <PublicClientPage client={client} industry={industrySerializable} related={related} />;
}
