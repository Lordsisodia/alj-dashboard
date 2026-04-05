import Link from "next/link";
import { ArrowUpRight, LifeBuoy, Send, Users2, CheckCircle2, Circle, Sparkles, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

const submitClientStats = {
  currentDraft: {
    name: "Aurora Mobility",
    stage: "Commercials",
    progress: 72,
    updatedAt: "Updated 3h ago",
    checklist: [
      { id: "terms", label: "Commercial terms", done: true },
      { id: "pricing", label: "Pricing breakdown", done: false },
      { id: "sow", label: "Attach SOW PDF", done: false },
    ],
    nextRequirement: "Add pricing breakdown & attach SOW PDF",
  },
};

const prospectsStats = {
  total: 48,
  new24h: 3,
  unattended: 7,
  stageBreakdown: [
    { label: "Prospecting", count: 14, token: "--siso-stage-prospect" },
    { label: "Qualified", count: 11, token: "--siso-stage-qualified" },
    { label: "Proposal", count: 9, token: "--siso-stage-proposal" },
    { label: "Negotiation", count: 8, token: "--siso-stage-negotiation" },
    { label: "Won", count: 4, token: "--siso-stage-won" },
    { label: "Lost", count: 2, token: "--siso-stage-lost" },
  ],
  topAction: {
    company: "Northwind Retail",
    action: "Send pricing breakdown + demo invite",
    due: "Today",
  },
};

type SubmitCallout = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Send;
  type: "submit";
  cta: string;
};

type ProspectsCallout = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Users2;
  type: "prospects";
  cta: string;
  cards: Array<{ label: string; heading: string; description: string; meta?: string }>;
};

const pipelineCallouts: Array<SubmitCallout | ProspectsCallout> = [
  {
    id: "submit",
    title: "Submit client",
    subtitle: "Route new opportunities to SISO with full commercial context.",
    href: "/partners/pipeline-ops/submit-client",
    icon: Send,
    type: "submit" as const,
    cta: "Open submit client",
  },
  {
    id: "prospects",
    title: "Prospects",
    subtitle: "Work your queue, log nudges, and move leads into motion.",
    href: "/partners/pipeline-ops/prospects",
    icon: Users2,
    type: "prospects" as const,
    cta: "Open prospects",
    cards: [
      {
        label: "Total in funnel",
        heading: `${prospectsStats.total}`,
        description: "Prospects actively tracked",
        meta: `+${prospectsStats.new24h} new in 24h`,
      },
      {
        label: "Untouched",
        heading: `${prospectsStats.unattended}`,
        description: "Haven't been nudged in 7d",
      },
      {
        label: prospectsStats.stageBreakdown[0].label,
        heading: `${prospectsStats.stageBreakdown[0].count}`,
        description: "Largest stage volume",
      },
      {
        label: "Win rate",
        heading: "63%",
        description: "Rolling 30d win rate",
      },
    ],
  },
];

export function PipelineOpsDashboardScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop className="h-full w-full" />
      <PartnersPageContainer className="relative z-10 space-y-6 pt-10 pb-12">
        <div className="relative">
          <div className="relative">
            <HighlightCard
              color="orange"
              title={"Client\u00A0Pipeline Dashboard"}
              description="Centralize your client pipeline, referrals, and deal health in one place."
              icon={<Send className="h-5 w-5 text-siso-orange" />}
              showCornerIcon={false}
              hideDivider
              fullWidth
              className="w-full max-w-none text-left"
              titleClassName="uppercase tracking-[0.3em] text-white text-[1.15rem] leading-6 sm:text-[1.35rem]"
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

        <div className="relative flex w-full flex-col gap-6">
          {pipelineCallouts.map((callout) => {
            const Icon = callout.icon;
            if (callout.type === "submit") {
              return (
                <SettingsGroupCallout
                  key={callout.id}
                  icon={<Icon className="h-4 w-4" />}
                  title={callout.title}
                  subtitle={callout.subtitle}
                  showChevron={false}
                >
                  <article className={cn(stackedPanelClass, "space-y-4 p-5 text-sm text-white/85")}>
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Current draft</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold">{submitClientStats.currentDraft.name}</span>
                        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/70">
                          {submitClientStats.currentDraft.stage}
                        </span>
                        <span className="text-[11px] text-white/60">{submitClientStats.currentDraft.updatedAt}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/60">
                        <span>Form completion</span>
                        <span>{submitClientStats.currentDraft.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10" aria-label="Current draft completion" role="img">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500"
                          style={{ width: `${submitClientStats.currentDraft.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {submitClientStats.currentDraft.checklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-xs text-white/80">
                          {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Circle className="h-4 w-4 text-white/40" />}
                          <span className={item.done ? "line-through text-white/60" : undefined}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-siso-text-muted">Next up: {submitClientStats.currentDraft.nextRequirement}</p>
                  </article>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className={cn(
                      secondaryActionButtonClass,
                      "mt-4 w-full rounded-full border-white/25 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 hover:text-white",
                    )}
                  >
                    <Link href={callout.href} aria-label="Resume current submit client draft">
                      Resume draft
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </SettingsGroupCallout>
              );
            }

            if (callout.type === "prospects") {
              return (
                <SettingsGroupCallout
                  key={callout.id}
                  icon={<Icon className="h-4 w-4" />}
                  title={callout.title}
                  subtitle={callout.subtitle}
                  showChevron={false}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {callout.cards.map((card) => (
                      <article key={card.label} className={cn(nestedCardClass, "space-y-2 p-4 text-white/90")}>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">{card.label}</p>
                        <p className="text-2xl font-semibold text-white">{card.heading}</p>
                        <p className="text-sm text-siso-text-muted">{card.description}</p>
                        {card.meta ? <p className="text-xs text-amber-200">{card.meta}</p> : null}
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/70">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      Top action: {prospectsStats.topAction.company}
                    </div>
                    <Button asChild size="sm" variant="secondary" className={cn(secondaryActionButtonClass, "border-white/25 text-xs uppercase")}>
                      <Link href={callout.href}>Open prospects</Link>
                    </Button>
                  </div>
                </SettingsGroupCallout>
              );
            }

            return null;
          })}
        </div>

        <SettingsGroupCallout
          icon={<LifeBuoy className="h-4 w-4" />}
          title="Need help?"
          subtitle="Book a pipeline review or share blockers with Deal Desk."
          showChevron={false}
        >
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <Button asChild size="sm" variant="outline" className="border-white/20 text-white">
              <Link href="/partners/pipeline-ops/submit-client">Talk to Deal Desk</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="text-white/80">
              <Link href="/partners/community/help/pipeline-ops">Open help center</Link>
            </Button>
          </div>
        </SettingsGroupCallout>
      </PartnersPageContainer>
    </main>
  );
}
