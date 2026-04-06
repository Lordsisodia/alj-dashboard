import type { Metadata } from "next";
import { Suspense } from "react";
import { allClients } from "@/domains/portfolio/data";
import { calculatePortfolioStats } from "@/domains/portfolio/lib/calculate-stats";
import { PublicPortfolioHub } from "@/domains/portfolio/public/PublicPortfolioHub";

export const metadata: Metadata = {
  title: "Portfolio - AI-Powered Websites & PWAs | ORACLE",
  description:
    "Browse our public showcase of AI-built websites, PWAs, and SaaS products across every industry.",
  openGraph: {
    title: "ORACLE Portfolio",
    description: "Proof you can share now-mobile ready and desktop polished.",
    url: "https://www.siso.agency/portfolio",
  },
};

type SearchParams = Promise<{ industry?: string }>;

export default function PortfolioPage({ searchParams }: { searchParams?: SearchParams }) {
  return (
    <Suspense fallback={null}>
      <PortfolioContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PortfolioContent({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const stats = calculatePortfolioStats();
  const initialIndustry = params?.industry ?? "all";

  return <PublicPortfolioHub clients={allClients} stats={stats} initialIndustry={initialIndustry} />;
}
