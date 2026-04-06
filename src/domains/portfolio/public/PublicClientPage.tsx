// @ts-nocheck
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HighlightCard } from "@/components/ui/card-5-static";
import { cn } from "@/domains/shared/utils/cn";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, Timer, Layers, Users, CheckCircle2, Star, Images, Target, ListChecks, TrendingUp, Plug, BadgeDollarSign, Calculator, Home } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { InfoButton } from "@/components/ui/info-button";
import {
  Utensils,
  MousePointerClick,
  PhoneCall,
  Server,
  Network,
  Search,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import type { PortfolioClient } from "../types";
import type { Industry } from "../types/industry.types";
import { trackPortfolioEvent } from "./analytics";
import { PORTFOLIO_ROUTES } from "../constants";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { PartnershipsWaveBackdrop } from "@/domains/shared/ui/backgrounds/PartnershipsWaveBackdrop";

function formatCurrency(value?: number | null) {
  if (!value || value <= 0) return "Custom";
  return `$${value.toLocaleString()}`;
}

export type PublicClientPageProps = {
  client: PortfolioClient;
  industry: Omit<Industry, "icon">;
  related: PortfolioClient[];
  isLoading?: boolean;
  error?: string | null;
};

export function PublicClientPage({ client, industry, related, isLoading = false, error = null }: PublicClientPageProps) {
  const router = useRouter();
  const [info, setInfo] = useState<{ title: string; content: string; payload?: Record<string, any> } | null>(null);
  const sectionIds = ["overview", "features", "kpis", "gallery", "timeline", "stack", "faq"] as const;
  type SectionId = (typeof sectionIds)[number];
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const topSectionIds = sectionIds.slice(0, 4);
  const bottomSectionIds = sectionIds.slice(4);
  if (!client) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-siso-text-muted">
        Client not found.
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-amber-100">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-6">{error}</div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12 space-y-6 text-white">
        <div className="h-[320px] animate-pulse rounded-3xl bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-48 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </main>
    );
  }

  const handlePrimaryCTA = () => {
    trackPortfolioEvent("cta_click", { surface: "client", cta: "view_live", clientId: client.id });
    if (client.liveUrl) {
      window.open(client.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSecondaryCTA = () => {
    trackPortfolioEvent("cta_click", { surface: "client", cta: "request_similar", clientId: client.id });
    router.push("/partners");
  };

  const handleRelatedClick = (project: PortfolioClient) => {
    trackPortfolioEvent("project_click", { surface: "client_related", clientId: project.id, industry: project.industry });
    router.push(PORTFOLIO_ROUTES.publicClient(industry.slug, project.id));
  };

  useEffect(() => {
    const onInfo = (e: Event) => {
      const ev = e as CustomEvent<{ title: string; content: string; payload?: Record<string, unknown> }>;
      setInfo({ title: ev.detail.title, content: ev.detail.content, payload: ev.detail.payload });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfo(null);
    };
    window.addEventListener("siso:info", onInfo as any);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("siso:info", onInfo as any);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const stats = [
    { label: "Price band", value: formatCurrency(client.pricing?.marketValue) },
    { label: "Delivery", value: client.timeline?.durationDays ? `${client.timeline.durationDays} days` : "2-week sprint" },
    { label: "Team", value: client.teamSize ? `${client.teamSize} specialists` : "Lean pod" },
    { label: "Model", value: client.engagementModel ?? "Fixed bid" },
  ].filter(Boolean);

  const blurb = client.description || client.tagline || `${client.name} is a ${client.industry.toLowerCase()} build delivered by ORACLE.`;
  const objectives = (client.solutionHighlights?.length ? client.solutionHighlights : client.problemStatements)?.slice(0, 3) || [
    "Ship fast with a production-ready experience in days, not months.",
    "Automate the repetitive flows so the team can focus on the core journey.",
    "Launch with clean analytics and uptime baked in from day one.",
  ];
  const audience = client.marketAnalysis?.targetAudience || `${client.industry} teams and their end customers.`;
  const useCases = (client.features?.key?.length ? client.features.key : client.features?.technical)?.slice(0, 3) || [
    "Track progress and habits with streaks and reminders.",
    "Provide a clean dashboard for coaching and accountability.",
    "Handle onboarding, payments, and basic support flows out of the box.",
  ];

  const kpis = client.results?.kpis ?? [];
  const deliverySpeed = client.results?.deliverySpeed ?? (client.timeline?.durationDays ? `${client.timeline.durationDays} days` : null);
  const satisfaction = client.results?.clientSatisfaction ? `${client.results.clientSatisfaction.toFixed(1)}★` : null;

  const resultsHighlights = [
    satisfaction
      ? {
          label: "Client satisfaction",
          value: satisfaction,
          delta: "Post-launch rating",
        }
      : null,
  ].filter((item): item is { label: string; value: string; delta?: string } => Boolean(item));

  const hasResultsContent = resultsHighlights.length || kpis.length;

  // Build gallery cards. Prefer explicit mediaMeta if provided; fallback to orientation guess.
  const mediaMeta = (client as any).mediaMeta as
    | Array<{ src: string; role?: string; label?: string; caption?: string }>
    | undefined;

  const galleryImages =
    mediaMeta && mediaMeta.length
      ? mediaMeta
      : (
          [
            ...(client.media?.screenshots?.desktop ?? []),
            ...(client.media?.screenshots?.mobile ?? []),
            ...(client.media?.screenshots?.features ?? []),
          ]
        )
          .filter(Boolean)
          .map((src, idx) => {
            const isPortrait = /mobile|phone|portrait/i.test(src);
            return {
              src,
              role: isPortrait ? "mobile" : idx === 0 ? "hero" : "desktop",
              label: isPortrait ? "Mobile flow" : idx === 0 ? "Desktop hero" : "Desktop view",
            };
          });

  const galleryCards = (galleryImages || []).map((item, idx) => {
    const role = item.role ?? "desktop";
    const isPortrait = role === "mobile";
    const label = item.label ?? (isPortrait ? "Mobile flow" : role === "hero" ? "Desktop hero" : "Desktop view");
    const colSpan =
      role === "hero"
        ? "md:col-span-12 lg:col-span-12"
        : isPortrait
          ? "md:col-span-4 lg:col-span-4"
          : "md:col-span-6 lg:col-span-6";
    const aspect =
      role === "hero"
        ? "aspect-[16/9]"
        : isPortrait
          ? "aspect-[9/16]"
          : "aspect-[16/10]";

    const caption = (item as any).caption as string | undefined;
    return { src: item.src, label, caption, colSpan, aspect, idx };
  });

  return (
    <main className="main-scroll-container scrollbar-hide relative overflow-hidden min-h-screen bg-siso-primary-solid text-white">
      <div className="absolute inset-0 z-0 bg-[var(--siso-bg-primary)]" />
      <PartnershipsWaveBackdrop
        className="pointer-events-none absolute inset-0 z-[1] opacity-85"
        strokeColor="#ffb45c"
        waveOpacity={0.9}
        waveBlurPx={4}
        overlayBlurPx={1}
        overlayClassName="bg-gradient-to-b from-black/8 via-black/20 to-black/35"
        radialTop="#1a1410"
        radialBase="var(--siso-bg-primary)"
        wavesClassName="h-[130%] w-full"
      />
      <div className="relative z-10">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative flex flex-col gap-3 px-4 pb-6 pt-4 md:pb-10 md:pt-10">
          <Breadcrumb className="text-white">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white">
                  <Home size={14} strokeWidth={2} aria-hidden="true" className="text-white" />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/80" />
              <BreadcrumbItem>
                <BreadcrumbLink href={PORTFOLIO_ROUTES.publicHub} className="text-white">Portfolio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/80" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{client.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="w-full">
            <HighlightCard
              color="orange"
              title="Internal tools & R&D"
              description=""
              hideDivider
              hideFooter
              showCornerIcon={false}
              fullWidth
              className="w-full border border-siso-orange/40 shadow-[0_24px_50px_rgba(0,0,0,0.55)] px-5 sm:px-6 md:px-8"
              titleClassName="text-[13px] uppercase tracking-[0.34em] text-white/85"
            >
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)] leading-tight">
                  {client.name}
                </h1>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
                  {client.tagline ?? client.description}
                </p>

                {client.liveUrl ? (
                  <div className="pt-1">
                    <Button
                      size="lg"
                      className="bg-[var(--siso-gradient-primary)] hover:bg-[var(--siso-gradient-hover)] text-siso-bg-primary font-semibold px-5 shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
                      onClick={handlePrimaryCTA}
                    >
                      View live site <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </HighlightCard>
          </div>
        </div>
      </section>

      {/* Section chips (mobile sticky) */}
      <div className="sticky top-0 z-20 bg-transparent backdrop-blur px-4 pb-2 pt-1">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="grid grid-cols-4 gap-2 justify-items-center">
            {topSectionIds.map((id) => {
              const labelMap: Record<SectionId, string> = {
                overview: "Overview",
                features: "Features",
                kpis: "Results",
                gallery: "Gallery",
                timeline: "Timeline",
                stack: "Stack",
                faq: "FAQ",
              };
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap transition w-full text-center",
                    active ? "border-white/40 bg-white/10 text-white" : "border-white/15 bg-white/5 text-white hover:text-white"
                  )}
                  type="button"
                >
                  {labelMap[id]}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {bottomSectionIds.map((id) => {
              const labelMap: Record<SectionId, string> = {
                overview: "Overview",
                features: "Features",
                kpis: "Results",
                gallery: "Gallery",
                timeline: "Timeline",
                stack: "Stack",
                faq: "FAQ",
              };
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap transition w-full text-center",
                    active ? "border-white/40 bg-white/10 text-white" : "border-white/15 bg-white/5 text-white hover:text-white"
                  )}
                  type="button"
                >
                  {labelMap[id]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render selected section */}
      {activeSection === "overview" && (
        <section className="container mx-auto px-4 mt-6 mb-10 relative z-10">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-5 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3 text-white">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Key stats</p>
                <p className="text-xs text-white/85">Industry standard versus ORACLE delivery</p>
              </div>
            </div>

            {/* Narrative callout */}
            <div className="rounded-2xl border border-white/10 bg-white/8 backdrop-blur-sm p-4 md:p-5 space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-siso-orange">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-white/90 font-semibold">Project snapshot</p>
                  <p className="text-sm text-siso-text leading-relaxed">
                    {blurb}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-siso-orange/15 text-siso-orange">
                      <Target className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em]">Objectives</p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-siso-text">
                    {objectives.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-siso-orange/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em]">Audience & use cases</p>
                  </div>
                  <div className="text-sm text-siso-text">{audience}</div>
                  <ul className="space-y-1.5 text-sm text-siso-text">
                    {useCases.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Features */}
      {activeSection === "features" && (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-8">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-5 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3 text-white">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Features</p>
                <p className="text-xs text-white/85">What shipped for this build. Tap "i" to see details.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(client.features?.key ?? [])
                .concat(client.features?.technical ?? [], client.features?.integrations ?? [])
                .map((feature) => {
                  const desc = client.features?.descriptions?.[feature];
                  const cost = client.features?.costs?.[feature];
                  const tokens = client.features?.tokens?.[feature];
                  const howItWorks = (client as any)?.features?.howItWorks?.[feature] as string[] | undefined;
                  const impact = (client as any)?.features?.impact?.[feature] as string[] | undefined;
                  const integrations = (client as any)?.features?.integrationDetails?.[feature] as string[] | undefined;
                  const status = (client as any)?.features?.status?.[feature] as string | undefined;
                  const iconMap: Record<string, JSX.Element> = {
                    "Menu showcase": <Utensils className="w-3.5 h-3.5" />,
                    "Online reservations": <MousePointerClick className="w-3.5 h-3.5" />,
                    "Contact system": <PhoneCall className="w-3.5 h-3.5" />,
                    "Headless menu CMS": <Server className="w-3.5 h-3.5" />,
                    "Slot-based booking API": <Network className="w-3.5 h-3.5" />,
                    "Structured data for SEO": <Search className="w-3.5 h-3.5" />,
                    "Stripe Checkout": <CreditCard className="w-3.5 h-3.5" />,
                    "Twilio SMS": <MessageCircle className="w-3.5 h-3.5" />,
                  };
                  const icon = iconMap[feature] ?? <Sparkles className="w-3.5 h-3.5" />;
                  const infoCopy = desc || "More detail coming soon.";
                  return (
                    <div
                      key={feature}
                      className="rounded-xl border border-white/10 bg-siso-tertiary-solid px-3 py-2 text-sm text-white flex items-center gap-2"
                    >
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80"
                        style={{ backgroundColor: "var(--siso-bg-hover)" }}
                      >
                        {icon}
                      </span>
                      <span className="flex-1">{feature}</span>
                      <InfoButton
                        label={feature}
                        content={infoCopy}
                        payload={{
                          cost,
                          tokens,
                          howItWorks,
                          impact,
                          integrations,
                          status,
                        }}
                        className="h-5 w-5"
                      />
                    </div>
                  );
                })}
              {!(client.features?.key?.length || client.features?.technical?.length || client.features?.integrations?.length) ? (
                <div className="rounded-xl border border-dashed border-white/20 bg-siso-tertiary-solid px-3 py-2 text-sm text-white/80">
                  Features coming soon.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* KPIs / Results */}
      {activeSection === "kpis" && hasResultsContent ? (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-10">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-6 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3 text-white">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Results</p>
                <p className="text-xs text-white/85">Proof points from this launch.</p>
              </div>
            </div>

            {/* Inner layer (double callout) */}
            <div
              className="rounded-2xl border border-white/10 p-4 md:p-5 space-y-4 shadow-[0_14px_32px_rgba(0,0,0,0.32)]"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="grid gap-3 md:grid-cols-[1.2fr,0.9fr]">
                <div className="grid gap-3 sm:grid-cols-2">
                  {resultsHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.28)] bg-white/5"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/85">{item.label}</p>
                      <p className="text-xl font-semibold text-white leading-tight">{item.value}</p>
                      {item.delta ? <p className="text-xs text-white/80 mt-0.5">{item.delta}</p> : null}
                    </div>
                  ))}
                  {!resultsHighlights.length ? (
                    <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
                      Metrics coming soon.
                    </div>
                  ) : null}
                </div>

                <div
                  className="rounded-xl border border-white/10 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.28)] bg-white/5 flex flex-col gap-2"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/85">Business impact</p>
                  <p className="text-sm text-white leading-snug">
                    {client.results?.businessImpact ?? "Impact narrative coming soon."}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-white/80">
                    {deliverySpeed ? (
                      <span
                        className="rounded-full border border-white/15 px-3 py-1"
                        style={{ backgroundColor: "var(--siso-bg-hover)" }}
                      >
                        {deliverySpeed} delivery
                      </span>
                    ) : null}
                    {kpis[0]?.value ? (
                      <span
                        className="rounded-full border border-white/15 px-3 py-1"
                        style={{ backgroundColor: "var(--siso-bg-hover)" }}
                      >
                        {kpis[0].value}
                      </span>
                    ) : null}
                    {satisfaction ? (
                      <span
                        className="rounded-full border border-white/15 px-3 py-1"
                        style={{ backgroundColor: "var(--siso-bg-hover)" }}
                      >
                        {satisfaction} feedback
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {kpis.length ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-xl border border-white/10 px-3 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.26)] bg-white/5"
                    >
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/85">{kpi.label}</p>
                      <p className="text-lg font-semibold text-white leading-tight">{kpi.value}</p>
                      {kpi.delta ? <p className="text-xs text-white/80">{kpi.delta}</p> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
                  KPI details coming soon.
                </div>
              )}

              {/* Moved summary cards from Overview into Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Price */}
                <div
                  className="h-full rounded-2xl border border-white/10 px-4 py-3 space-y-2"
                  style={{ backgroundColor: "var(--siso-bg-tertiary)" }}
                >
                  <div className="flex items-center justify-between text-white">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white">Price</p>
                    <InfoButton
                      label="Why this price"
                      content="We run an AI-first delivery stack: 90% of build steps are automated by specialized agents, humans review the outputs, and we avoid bespoke rebuilds. Less human cost → lower price without cutting quality."
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/90">Industry</p>
                      <p className="text-sm font-semibold text-white line-through">
                        {formatCurrency(client.pricing?.marketValue)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/8 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white">ORACLE</p>
                      <p className="text-base font-semibold text-white">
                        {client.pricing?.sisoPrice ? formatCurrency(client.pricing?.sisoPrice) : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div
                  className="h-full rounded-2xl border border-white/10 px-4 py-3 space-y-2"
                  style={{ backgroundColor: "var(--siso-bg-tertiary)" }}
                >
                  <div className="flex items-center justify-between text-white">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white">Delivery</p>
                    <InfoButton
                      label="Why this delivery speed"
                      content="Multiple AI agents work in parallel (design, build, QA), supervised by humans. That cuts handoffs and accelerates shipping-faster without cutting corners."
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/90">Industry</p>
                      <p className="text-sm font-semibold text-white">{client.pricing?.marketValue ? "~14 days" : "-"}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/8 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white">ORACLE</p>
                      <p className="text-base font-semibold text-white">{client.timeline?.durationDays ? `${client.timeline.durationDays} days` : "-"}</p>
                    </div>
                  </div>
                </div>

                {/* AI efficiency */}
                <div className="h-full rounded-2xl border border-white/10 bg-siso-tertiary-solid px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-siso-text-muted">AI efficiency</p>
                    <InfoButton
                      label="How we reduce effort"
                      content="Specialized agents handle design, build, QA in parallel; humans review and approve. That removes ~80% of manual effort without cutting quality."
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-siso-text-muted">Agent-built</p>
                      <p className="text-base font-semibold text-white">~78%</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/8 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white">Human hours saved</p>
                      <p className="text-base font-semibold text-white">~46h</p>
                    </div>
                  </div>
                </div>

                {/* Future KPIs to track */}
                <div className="h-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 space-y-2 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.3em]">Next KPIs to track</p>
                    <InfoButton
                      label="Suggested KPIs"
                      content="Pick the ones that resonate: activation, match rate, churn, LCP, lead-to-sign."
                      className="h-5 w-5"
                    />
                  </div>
                  <ul className="space-y-1 text-sm text-white/85 list-disc list-inside">
                    <li>Activation rate (week 1)</li>
                    <li>Match success rate</li>
                    <li>Time-to-match</li>
                    <li>Payment success on first attempt</li>
                    <li>Support tickets / 1k users</li>
                    <li>Churn / 30-60-90 retention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {activeSection === "gallery" && (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-8">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-5 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Images className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">Gallery</p>
                <p className="text-xs text-white/85">Screens from the flow-desktop hero plus mobile booking.</p>
              </div>
            </div>

            {galleryCards.length ? (
              <div className="rounded-2xl border border-white/10 p-3 md:p-4 space-y-3" style={{ backgroundColor: "var(--siso-bg-tertiary)" }}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                  {galleryCards.map((item) => (
                    <div
                      key={item.src + item.idx}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border border-white/10 bg-siso-tertiary-solid shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex flex-col",
                        item.colSpan
                      )}
                    >
                      <div className={cn("relative w-full", item.aspect)}>
                        <img
                          src={item.src}
                          alt={`${client.name} screen ${item.idx + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                          {item.label}
                        </div>
                      </div>
                      {item.caption ? (
                        <div className="px-3 py-2 border-t border-white/10 text-xs text-white/80">
                          {item.caption}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-siso-tertiary-solid p-6 text-siso-text-muted">
                Gallery assets coming soon.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timeline */}
      {activeSection === "timeline" ? (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-10">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-6 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Timeline</p>
                <p className="text-xs text-siso-text-muted">How we shipped this in {client.timeline?.durationDays ?? "-"} days.</p>
              </div>
            </div>
            {client.timeline?.phases?.length ? (
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-3 bottom-3 w-[1px] bg-white/20" aria-hidden />
                <div className="space-y-4">
                  {client.timeline.phases.map((phase, idx) => (
                    <div key={phase.name} className="relative pl-2">
                      <span className="absolute -left-3 top-3 h-2.5 w-2.5 rounded-full bg-siso-orange shadow-[0_0_0_6px_rgba(255,167,38,0.12)] ring-4 ring-white/8" aria-hidden />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-white/85">{phase.name}</p>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">Step {idx + 1}</span>
                        </div>
                        <p className="text-white font-semibold leading-snug">{phase.description}</p>
                        {phase.duration ? <p className="text-sm text-white/75">{phase.duration}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-siso-tertiary-solid p-6 text-white/85 text-center">
                Timeline breakdown coming soon.
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Tech Stack */}
      {activeSection === "stack" && (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-10">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-6 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Tech stack</p>
                <p className="text-xs text-siso-text-muted">What we used to ship this build.</p>
              </div>
            </div>
            {(() => {
              const tech = client.techStack ?? {};
              const frontend = tech.frontend ?? [];
              const backend = tech.backend ?? [];
              const dataInfra = [...(tech.database ?? []), ...(tech.hosting ?? [])];
              const tools = tech.tools ?? [];
              const rows: { label: string; items: string[] }[] = [
                { label: "Frontend", items: frontend },
                { label: "Backend", items: backend },
                { label: "Data & Infra", items: dataInfra },
                { label: "Tools", items: tools },
              ].filter((r) => r.items.length);
              return (
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row.label} className="rounded-2xl border border-white/10 bg-siso-tertiary-solid px-4 py-3 space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-siso-text-muted">{row.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {row.items.map((stack) => (
                          <Badge key={stack} className="bg-white/10 border-white/10 text-white/80 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.08em]">
                            {stack}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* FAQ */}
      {activeSection === "faq" && client.faq?.length ? (
        <section className="container mx-auto px-4 mt-6 mb-10 pb-12">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.35)] p-4 md:p-6 space-y-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 text-siso-orange flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">FAQ</p>
                <p className="text-xs text-siso-text-muted">Quick answers for this build.</p>
              </div>
            </div>
            <div className="space-y-2">
              {client.faq.map((item, idx) => (
                <div
                  key={`faq-${idx}`}
                  className="siso-inner-card rounded-2xl border border-white/10 bg-siso-tertiary-solid px-4 py-3"
                >
                  <details className="group">
                    <summary className="cursor-pointer text-white text-sm font-semibold list-none flex items-center justify-between">
                      <span>{item.question}</span>
                      <span className="text-siso-text-muted text-xs ml-2 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-siso-text-secondary mt-2 text-sm leading-relaxed">{item.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container mx-auto px-4 pb-14">
          <div
            className="rounded-[26px] border border-white/10 shadow-[0_18px_35px_rgba(0,0,0,0.45)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ backgroundColor: "var(--siso-bg-secondary)" }}
          >
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-siso-text-muted">Ready to build</p>
            <h3 className="text-2xl font-semibold text-white">Want a booking experience like this?</h3>
            <p className="text-siso-text-secondary text-sm mt-1">Ship your booking flow in ~2 weeks with your stack and brand.</p>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="bg-[#ffa726] hover:bg-[#ffb74d] text-black font-semibold px-5 shadow-[0_10px_30px_rgba(255,167,38,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 border border-transparent"
              onClick={handleSecondaryCTA}
            >
              Start a build <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      </div>

      {info ? (
        (() => {
          const fallbackHow = [
            "AI agents build the flow end-to-end",
            "Human review + QA on critical paths",
            "Deployed to the production stack",
          ];
          const fallbackImpact = [
            "Faster launch with fewer handoffs",
            "Lower manual effort for the team",
            "More reliable experience for end users",
          ];
          const howItems = Array.isArray(info.payload?.howItWorks) && info.payload?.howItWorks.length ? info.payload.howItWorks : fallbackHow;
          const impactItems = Array.isArray(info.payload?.impact) && info.payload?.impact.length ? info.payload.impact : fallbackImpact;
          const integrations = Array.isArray(info.payload?.integrations) ? info.payload.integrations : [];

          return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0"
            aria-label="Dismiss info overlay"
            onClick={() => setInfo(null)}
          />
          <div
            className="w-full max-w-md rounded-t-2xl border p-4 shadow-2xl relative z-10"
            style={{
              background: "#0b0b0b",
              borderColor: "rgba(255,167,38,0.32)",
              boxShadow: "0 -12px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--siso-orange)]">
                  <Star size={16} />
                </span>
                <h3 className="text-[15px] font-semibold text-siso-text-primary">{info.title}</h3>
              </div>
              <button
                onClick={() => setInfo(null)}
                className="text-siso-text-muted hover:text-white transition text-sm"
                type="button"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-[13px] leading-snug text-neutral-300">
              <p className="text-sm text-white/90">{info.content}</p>

              {/* quick chips */}
              <div className="flex flex-wrap gap-2 text-[12px]">
                {info.payload?.cost ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/90">
                    <BadgeDollarSign className="h-3.5 w-3.5" />
                    {String(info.payload.cost)}
                  </span>
                ) : null}
                {info.payload?.tokens ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/90">
                    <Calculator className="h-3.5 w-3.5" />
                    {String(info.payload.tokens)} tokens
                  </span>
                ) : null}
                {info.payload?.status ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/90">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {String(info.payload.status)}
                  </span>
                ) : null}
              </div>

              {/* How it works */}
              {howItems.length ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90 text-[12px] uppercase tracking-[0.2em]">
                    <ListChecks className="h-4 w-4" />
                    <span>How it works</span>
                  </div>
                  <ul className="space-y-1 text-[13px] text-white/90">
                    {howItems.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-siso-orange/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* User impact */}
              {impactItems.length ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90 text-[12px] uppercase tracking-[0.2em]">
                    <TrendingUp className="h-4 w-4" />
                    <span>User impact</span>
                  </div>
                  <ul className="space-y-1 text-[13px] text-white/90">
                    {impactItems.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Integrations */}
              {integrations.length ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90 text-[12px] uppercase tracking-[0.2em]">
                    <Plug className="h-4 w-4" />
                    <span>Integrations</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[13px] text-white/90">
                    {integrations.map((item: string, idx: number) => (
                      <span key={idx} className="rounded-full border border-white/12 bg-white/5 px-2 py-1">{item}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quality note */}
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.25em] text-siso-text-muted mb-1">Quality note</p>
                <p className="text-sm text-white/90">AI agents handle the heavy lifting; humans review outputs to keep quality high.</p>
              </div>
            </div>

            <button
              className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white"
              style={{ background: "var(--siso-gradient-primary)" }}
              onClick={() => setInfo(null)}
              type="button"
            >
              Got it
            </button>
          </div>
        </div>
          );
        })()
      ) : null}
    </main>
  );
}
