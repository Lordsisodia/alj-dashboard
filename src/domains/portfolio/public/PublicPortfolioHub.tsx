"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Eye, FolderOpen, Star, TrendingUp, Users } from "lucide-react";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import AnimatedNumberCountdown from "@/domains/portfolio/components/shared/CountdownNumber";
import { PortfolioStatsSection } from "../components/PortfolioStatsSection";
import { industries, getIndustryById } from "../data/industries";
import type { PortfolioClient, PortfolioStats } from "../types";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import { trackPortfolioEvent } from "./analytics";
import { PORTFOLIO_ROUTES } from "../constants";
import { mapClientToPublicProject } from "../lib";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const LAUNCH_DATE = new Date(Date.UTC(2024, 11, 10));

export type PublicPortfolioHubProps = {
  clients: PortfolioClient[];
  stats: PortfolioStats;
  initialIndustry?: string | null;
  isLoading?: boolean;
  error?: string | null;
};

const SkeletonCard = () => <div className="h-32 animate-pulse rounded-2xl bg-white/5" />;

export function PublicPortfolioHub({
  clients,
  stats,
  initialIndustry = "all",
  isLoading = false,
  error = null,
}: PublicPortfolioHubProps) {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [showSizeInfo, setShowSizeInfo] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setSelectedIndustry(initialIndustry ?? "all");
  }, [initialIndustry]);

  const industryOptions = useMemo(
    () => [{ value: "all", label: "All projects" }, ...industries.map((i) => ({ value: i.slug, label: i.name }))],
    [],
  );

  const visibleClients = useMemo(
    () => clients.filter((client) => client.metadata?.showInPortfolio !== false),
    [clients],
  );

  const industryFilteredClients = useMemo(() => {
    if (!selectedIndustry || selectedIndustry === "all") {
      return visibleClients;
    }
    return visibleClients.filter((client) => client.industry === selectedIndustry);
  }, [visibleClients, selectedIndustry]);

  const handleProjectClick = (client: PortfolioClient) => {
    const industry = getIndustryById(client.industry);
    const slug = industry?.slug ?? client.industry;
    trackPortfolioEvent("project_click", { surface: "hub", clientId: client.id, industry: slug });
    router.push(PORTFOLIO_ROUTES.publicClient(slug, client.id));
  };

  const projectCards = industryFilteredClients.map((client) => {
    const industry = getIndustryById(client.industry);
    const headerImage =
      client.media?.screenshots?.desktop?.[0] || client.media?.hero || industry?.headerImage ||
      "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80";
    const rating = client.rating ?? client.results?.clientSatisfaction ?? 4.9;
    const sisoPrice = client.pricing?.sisoPrice ?? client.pricing?.min ?? client.pricing?.marketValue ?? null;
    const competitorPrice = client.pricing?.marketValue ?? client.pricing?.max ?? null;
    const value = sisoPrice ?? competitorPrice;
    const featureChips = (client.features?.key ?? client.features?.technical ?? client.features?.integrations ?? []).slice(0, 3);

    const savingsPercent = competitorPrice && sisoPrice
      ? Math.max(0, Math.round(((competitorPrice - sisoPrice) / competitorPrice) * 100))
      : null;

    const totalFeatures = (client.features?.key?.length || 0) + (client.features?.technical?.length || 0);
    const projectSize = totalFeatures >= 8 ? "Large" : totalFeatures >= 4 ? "Medium" : "Small";
    const sizeTone = projectSize === "Large" ? "text-red-300" : projectSize === "Medium" ? "text-amber-200" : "text-emerald-200";

    const tokensEstimate = (() => {
      const tokenEntries = client.features?.tokens ? Object.values(client.features.tokens) : [];
      if (!tokenEntries.length) return null;
      const parsed = tokenEntries
        .map((val) => {
          const str = String(val).toLowerCase();
          const match = str.match(/([\d.,]+)\s*(k|m)?/);
          if (!match) return 0;
          const base = parseFloat(match[1].replace(/,/g, ""));
          const suffix = match[2];
          if (suffix === "m") return base * 1_000_000;
          if (suffix === "k") return base * 1_000;
          return base;
        })
        .filter(Boolean);
      if (!parsed.length) return null;
      return parsed.reduce((acc, n) => acc + n, 0);
    })();

    const fallbackTokens = projectSize === "Large" ? 120_000 : projectSize === "Medium" ? 60_000 : 25_000;
    const tokensDisplay = tokensEstimate ?? fallbackTokens;

    const formatMoney = (amount?: number | null) => {
      if (amount == null) return "Custom";
      const currency = client.pricing?.currency === "USD" ? "$" : client.pricing?.currency === "EUR" ? "€" : "£";
      return `${currency}${amount.toLocaleString()}`;
    };

    return {
      client,
      industry,
      headerImage,
      rating,
      value,
      featureChips,
      sisoPrice,
      competitorPrice,
      savingsPercent,
      projectSize,
      sizeTone,
      tokensDisplay,
      formatMoney,
    };
  });

  const handleIndustrySelect = (slug: string) => {
    const nextSlug = selectedIndustry === slug ? "all" : slug;
    setSelectedIndustry(nextSlug);
    trackPortfolioEvent("industry_select", { slug: nextSlug });
    const url =
      nextSlug === "all"
        ? PORTFOLIO_ROUTES.publicHub
        : `${PORTFOLIO_ROUTES.publicHub}?${PORTFOLIO_ROUTES.query.industry}=${nextSlug}`;
    router.push(url, { scroll: false });
  };

  return (
    <main className="portfolio-hub main-scroll-container text-white relative overflow-visible bg-transparent md:bg-siso-bg-primary/70">
      <TierProgressBackdrop className="absolute inset-0 -z-10" />
      {error ? (
        <div className="bg-amber-500/10 text-amber-100 border border-amber-500/40 px-4 py-3 text-center">
          {error}
        </div>
      ) : null}

      <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden py-12 md:py-16 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 z-10 px-4"
        >
          <Badge variant="outline" className="border-siso-orange/40 text-siso-orange bg-siso-orange/10">
            Founded on Dec 10, 2024
          </Badge>

          <div className="flex flex-col items-center gap-1.5 md:gap-3">
            {now ? (
              <AnimatedNumberCountdown
                startDate={LAUNCH_DATE}
                endDate={now}
                className="gap-1 text-lg sm:text-xl md:text-3xl scale-75 sm:scale-85 md:scale-95"
                numberClassName="text-white"
                labelClassName="text-xs sm:text-sm text-white/80"
              />
            ) : null}
          </div>

          <GradientText
            colors={["#FF5722", "#FFA726", "#FF5722"]}
            animationSpeed={5}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[116px] font-extrabold tracking-tight"
          >
            PORTFOLIO
          </GradientText>
          <p className="text-base sm:text-lg md:text-xl text-siso-text max-w-3xl mx-auto leading-snug tracking-tight">
            See how we transform businesses across industries.
          </p>

          {/* Removed top stat pills per request */}
        </motion.div>

      </section>

      <div className="container mx-auto px-4 relative z-10">
        <PortfolioStatsSection stats={stats} />
      </div>

      <div className="w-full px-4 sm:px-6 relative z-20 mt-4">
        <div className="mx-auto max-w-5xl md:max-w-6xl rounded-[22px] border border-siso-border bg-siso-bg-secondary shadow-[0_18px_38px_-24px_rgba(0,0,0,0.6)] px-4 sm:px-6 py-4 sm:py-5 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1a1a] text-siso-orange border border-white/10 shadow-inner">
              <FolderOpen className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">Filter projects</p>
              <p className="text-xs text-siso-text-muted">See all work or focus on an industry</p>
            </div>
          </div>

          <div className="w-full relative z-30">
            <CustomDropdown
              options={industryOptions}
              value={selectedIndustry ?? "all"}
              onChange={(value) => handleIndustrySelect(value)}
              placeholder="All projects"
              searchable
              allowCustom={false}
              className="w-full"
            />
            <p className="mt-2 text-[11px] text-siso-text-muted">
              Showing {industryFilteredClients.length} project{industryFilteredClients.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>
      </div>

      {/* Industry callout cards (with solid inner card + image header) */}
      <section className="py-10 md:py-16 container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <GradientText
            colors={["#FF5722", "#FFA726", "#FF5722"]}
            animationSpeed={5}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          >
            Browse Projects
          </GradientText>
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Explore what we can launch for you-starting with a flagship build.
          </p>
        </motion.div>

        {error ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-6 text-center text-amber-100">
            {error}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {projectCards.map(({ client, industry, headerImage, rating, value, featureChips, sisoPrice, competitorPrice, savingsPercent, projectSize, sizeTone, tokensDisplay, formatMoney }) => (
              <motion.div
                key={client.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.18 } }}
                className="group cursor-pointer"
                onClick={() => handleProjectClick(client)}
              >
                <div className="relative h-full overflow-hidden rounded-[26px] border border-siso-orange/40 bg-siso-bg-secondary shadow-[0_18px_38px_-24px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:border-siso-orange/70">
                  <div className="relative z-0 h-48 sm:h-52 overflow-hidden">
                    <img
                      src={headerImage}
                      alt={client.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-transparent" />
                  </div>

                  <div className="px-3 pb-3 relative z-10 -mt-6 sm:-mt-7">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.38)]">
                      <div className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-siso-orange">
                              {industry?.icon ? <industry.icon className="h-5 w-5" /> : <FolderOpen className="h-5 w-5" />}
                            </span>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">{client.name}</p>
                              <p className="text-xs text-siso-text-muted leading-snug line-clamp-2">{client.tagline ?? client.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-right">
                            <Badge variant="outline" className="border-white/15 bg-white/10 text-[11px] font-semibold text-white flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-siso-orange" /> {rating?.toFixed(1) ?? "4.9"}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-white/85">
                          <div className="rounded-lg border border-white/5 bg-black/20 p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] uppercase tracking-[0.28em] text-siso-text-muted">Pricing</p>
                              {savingsPercent !== null ? (
                                <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-400/25">Save {savingsPercent}%</span>
                              ) : null}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] text-siso-text-muted">Our price</span>
                                <span className="font-semibold text-white">{formatMoney(sisoPrice)}</span>
                              </div>
                              <div className="flex items-center justify-between line-through text-siso-text-muted">
                                <span className="text-[12px]">Competitor</span>
                                <span className="font-semibold">{formatMoney(competitorPrice)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-white/5 bg-black/15 p-3 space-y-1.5">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-siso-text-muted">Project size</p>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-white">{projectSize}</p>
                                <span
                                  role="button"
                                  aria-label="Project size criteria"
                                  className="inline-flex items-center text-siso-text-muted hover:text-white cursor-pointer"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setShowSizeInfo(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </span>
                              </div>
                              <span
                                className={`whitespace-nowrap text-[11px] font-semibold ${sizeTone} bg-white/8 border border-white/10 px-2.5 py-1 rounded-full`}
                              >
                                {tokensDisplay >= 1_000_000
                                  ? `${Math.round(tokensDisplay / 1_000_000)}m tokens`
                                  : tokensDisplay >= 10_000
                                    ? `${Math.round(tokensDisplay / 1_000)}k tokens`
                                    : `${Math.round(tokensDisplay).toLocaleString()} tokens`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {featureChips.length ? (
                          <div className="rounded-xl border border-siso-orange/50 bg-siso-orange/10 p-3 space-y-2 text-sm text-white/90 shadow-[0_8px_22px_-14px_rgba(255,120,70,0.45)]">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-siso-orange/90">Features</p>
                            <ul className="space-y-2 text-white/90 text-sm" aria-label="Key features">
                              {featureChips.map((feat) => (
                                <li key={feat} className="grid grid-cols-[auto_1fr] gap-2 items-start">
                                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FFA726] shadow-[0_0_0_3px_rgba(255,120,70,0.25)]" />
                                  <span className="leading-snug">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-siso-orange hover:text-siso-orange/80"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleProjectClick(client);
                          }}
                        >
                          View project
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="relative py-12 md:py-20 bg-siso-bg-primary/90 overflow-hidden">
        {/* keep animation visible: keep backdrop above section background but below content */}
        <TierProgressBackdrop className="absolute inset-0 z-0 opacity-55" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,87,34,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(255,167,38,0.10),transparent_36%),linear-gradient(120deg,rgba(0,0,0,0.35),rgba(0,0,0,0.45))]" />

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-5xl mx-auto border border-siso-border bg-siso-bg-secondary shadow-[0_24px_70px_-28px_rgba(0,0,0,0.75)] overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_15%_10%,rgba(255,87,34,0.18),transparent_36%),radial-gradient(circle_at_85%_5%,rgba(255,167,38,0.14),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(255,87,34,0.10),transparent_42%)]" />

              <CardContent className="p-6 sm:p-10 lg:p-12 relative z-10 space-y-8 text-white">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="space-y-3 max-w-3xl">
                    <Badge className="bg-white/10 text-siso-text-secondary border border-white/10 text-[11px] tracking-[0.28em] px-3 py-1 uppercase">
                      Partner Program
                    </Badge>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                      Earn 30% on every client you bring
                    </h3>
                    <p className="text-base sm:text-lg text-siso-text-muted leading-relaxed">
                      Earn <span className="font-semibold text-white">20%</span> on every project you refer. Lead a pod? Add <span className="font-semibold text-white">10%</span> override when your team closes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.6)]">
                    <Users className="w-6 h-6 text-siso-orange" />
                    <span className="font-semibold text-white text-sm">No quotas</span>
                    <span className="text-xs text-siso-text-muted">Share when it fits</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.6)]">
                    <Award className="w-6 h-6 text-siso-orange" />
                    <span className="font-semibold text-white text-sm">Lifetime payouts</span>
                    <span className="text-xs text-siso-text-muted">Earn on every renewal</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.6)]">
                    <Star className="w-6 h-6 text-siso-orange" />
                    <span className="font-semibold text-white text-sm">We close for you</span>
                    <span className="text-xs text-siso-text-muted">You keep the upside</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.6)]">
                    <Clock className="w-6 h-6 text-siso-orange" />
                    <span className="font-semibold text-white text-sm">Fast payouts</span>
                    <span className="text-xs text-siso-text-muted">Weekly disbursements</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => {
                      trackPortfolioEvent("cta_click", { surface: "hub", cta: "partner_program" });
                      router.push("/partners");
                    }}
                    className="w-full sm:w-auto bg-[linear-gradient(135deg,#FF5722_0%,#FFA726_100%)] text-siso-bg-primary font-semibold px-8 py-4 h-auto rounded-xl shadow-[0_16px_40px_-18px_rgba(255,120,70,0.95)] hover:brightness-105 active:translate-y-[1px] transition"
                  >
                    Become a Partner
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 h-auto px-7 py-4"
                    onClick={() => {
                      trackPortfolioEvent("cta_click", { surface: "hub", cta: "partner_program_learn" });
                      router.push("/partners#faq");
                    }}
                  >
                    See program details
                  </Button>
                  <p className="text-xs sm:text-sm text-siso-text-muted text-center sm:text-left w-full sm:w-auto">
                    Join 100+ partners already earning with ORACLE
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      {showSizeInfo && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-[2px]" onClick={() => setShowSizeInfo(false)} />
          <div className="fixed inset-x-4 bottom-6 z-[100] rounded-3xl border border-siso-border bg-siso-bg-secondary/95 p-4 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.75)] backdrop-blur animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-siso-text-muted">Project size guide</p>
                <p className="text-lg font-semibold text-white">How we size builds</p>
              </div>
              <button
                type="button"
                aria-label="Close size guide"
                className="h-9 w-9 rounded-full border border-white/10 text-white/80 hover:text-white"
                onClick={() => setShowSizeInfo(false)}
              >
                ×
              </button>
            </div>
            <ul className="space-y-2 text-sm text-siso-text">
              <li className="flex items-start justify-between gap-3">
                <span className="font-semibold text-white">Small</span>
                <span className="text-siso-text-muted">≈ 50m tokens</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="font-semibold text-white">Medium</span>
                <span className="text-siso-text-muted">≈ 200m tokens</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="font-semibold text-white">Large</span>
                <span className="text-siso-text-muted">1b+ tokens</span>
              </li>
            </ul>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
