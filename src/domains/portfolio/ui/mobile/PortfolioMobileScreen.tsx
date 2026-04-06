"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Folder, Sparkles, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import type { PortfolioClientSummary, PortfolioStats } from "@/domains/portfolio/types";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import { stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { cn } from "@/lib/utils";
import { PORTFOLIO_ROUTES } from "@/domains/portfolio/constants";

const DEFAULT_THUMB = "https://via.placeholder.com/512x320/111/fff?text=Portfolio";

export function PortfolioMobileScreen({ clients, stats }: { clients: PortfolioClientSummary[]; stats: PortfolioStats }) {
  const visibleClients = clients.filter((c) => c.metadata?.showInPortfolio !== false);
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const industryOptions = useMemo(() => {
    const allIndustries = new Set(
      visibleClients.map((client) => client.industry ?? client.metadata?.industry ?? "general"),
    );
    return ["all", ...Array.from(allIndustries)];
  }, [clients]);
  const filteredClients = useMemo(() => {
    if (industryFilter === "all") return visibleClients;
    return visibleClients.filter((client) => {
      const label = (client.industry ?? client.metadata?.industry ?? "general").toLowerCase();
      return label === industryFilter.toLowerCase();
    });
  }, [visibleClients, industryFilter]);
  const featured = filteredClients.filter((c) => c.metadata?.featured);

  return (
    <main className="bg-siso-bg-primary text-siso-text-primary min-h-screen relative overflow-hidden">
      <TierProgressBackdrop />
      <div className="space-y-6">
        <div className="relative z-10 px-4 pt-10 lg:pt-12">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <Link
                href="/partners/academy"
                aria-label="Back"
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <HighlightCard
              color="orange"
              title="Portfolio"
              description="Proof you can share now-mobile ready."
              metricValue={`${stats.totalProjects ?? featured.length} projects`}
              metricLabel="live library"
              buttonText="Open portfolio hub"
              buttonHref={
                featured[0]
                  ? PORTFOLIO_ROUTES.publicClient(featured[0].industry ?? "all", featured[0].id)
                  : PORTFOLIO_ROUTES.publicHub
              }
              icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
              className="w-full pl-12 text-left"
              fullWidth
              hideDivider
              hideFooter
              showCornerIcon={false}
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
            />

            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-10 lg:pb-12">
          <SettingsGroupCallout icon={<Folder className="h-4 w-4" />} title="Industries" subtitle="Filter proofs fast" showChevron={false}>
          <div className={cn(stackedPanelClass, "p-4 text-sm text-white/85")}>
            <CustomDropdown
              options={industryOptions.map((value) => ({
                label: value === "all" ? "All industries" : value,
                value,
              }))}
              value={industryFilter}
              onChange={(value) => setIndustryFilter((value as string) ?? "all")}
              searchable
              allowCustom={false}
            />
            <p className="mt-2 text-xs text-siso-text-muted">
              Showing {filteredClients.length} proof{filteredClients.length === 1 ? "" : "s"}.
            </p>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Featured proofs" subtitle="Swipe-worthy case studies" showChevron={false}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(featured.length ? featured : filteredClients).map((client, index) => (
              <PortfolioListCard key={client.id} client={client} priority={index === 0} />
            ))}
          </div>
        </SettingsGroupCallout>
      </div>
        </div>
    </main>
  );
}

function PortfolioListCard({ client, priority = false }: { client: PortfolioClientSummary; priority?: boolean }) {
  const cover = client.coverImage ?? DEFAULT_THUMB;
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "low";
  return (
    <Link
      href={PORTFOLIO_ROUTES.publicClient(client.industry ?? "all", client.id)}
      className={cn(stackedPanelClass, "block overflow-hidden border-white/20 p-0 transition hover:border-siso-orange/50")}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        <img src={cover} alt={client.name} className="h-full w-full object-cover" loading={loading} decoding="async" fetchPriority={fetchPriority} />
        <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white">
          {client.projectType ?? "Project"}
        </span>
      </div>
      <div className="space-y-1 p-3 text-white/85">
        <p className="text-sm font-semibold text-white">{client.name}</p>
        <p className="text-xs text-siso-text-muted line-clamp-2">{client.tagline ?? client.description}</p>
        <div className="flex items-center justify-between text-xs text-siso-text-muted pt-1">
          <span className="uppercase tracking-[0.12em] text-siso-text-muted">{client.industry}</span>
          <span className="inline-flex items-center gap-1 text-siso-orange">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
