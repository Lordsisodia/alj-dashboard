import { Suspense } from "react";
import Link from "next/link";

import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Clock3, Target, Layers, Gauge, PieChart, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  nestedCardClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const heroCard = {
  title: "Partner performance",
  description: "Invite flow, approvals, and revenue momentum in one view.",
};

const performanceTrend = [
  { label: "Oct 21", month: "Oct", day: "21", revenue: 24000, payouts: 11000, approvals: 11 },
  { label: "Oct 28", month: "Oct", day: "28", revenue: 27500, payouts: 13000, approvals: 13 },
  { label: "Nov 04", month: "Nov", day: "04", revenue: 26000, payouts: 14800, approvals: 12 },
  { label: "Nov 11", month: "Nov", day: "11", revenue: 31000, payouts: 16200, approvals: 15 },
  { label: "Nov 18", month: "Nov", day: "18", revenue: 35500, payouts: 18000, approvals: 18 },
];

const keyMetrics = [
  {
    label: "Revenue booked (30d)",
    value: "$182K",
    delta: "+18% vs prior 30d",
    helper: "18 approvals closed",
    icon: <DollarSign className="h-4 w-4" aria-hidden />,
  },
  {
    label: "Payout queue",
    value: "$52K",
    delta: "12 pending overrides",
    helper: "Avg 4.3d to clear",
    icon: <Gauge className="h-4 w-4" aria-hidden />,
  },
  {
    label: "Invite → approval rate",
    value: "62%",
    delta: "+4pp vs Oct",
    helper: "Goal ≥60%",
    icon: <TrendingUp className="h-4 w-4" aria-hidden />,
  },
  {
    label: "Avg invite → approval time",
    value: "9.2 days",
    delta: "-1.1d vs goal",
    helper: "Target 10d",
    icon: <Clock3 className="h-4 w-4" aria-hidden />,
  },
];

const insightItems = [
  {
    title: "Top source",
    detail: "Member referrals drove 58% of approvals; paid social fell to 17%.",
  },
  {
    title: "Revenue per approval",
    detail: "$10.1K avg first-year overrides; +6% after playbook refresh.",
  },
  {
    title: "Aging payouts",
    detail: "3 approvals pending payout >7 days — nudge finance to clear queue.",
  },
];

const channelMix = [
  { label: "Member referrals", percent: 58, helper: "72 approvals • $205K rev", token: "--siso-stage-won" },
  { label: "Paid social", percent: 17, helper: "18 approvals • $42K rev", token: "--siso-stage-negotiation" },
  { label: "Events", percent: 15, helper: "16 approvals • $38K rev", token: "--siso-stage-proposal" },
  { label: "Communities", percent: 10, helper: "12 approvals • $30K rev", token: "--siso-stage-qualified" },
];

export function RecruitmentPerformanceContent() {
  return (
    <section className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop className="h-full w-full" />

      <PartnersPageContainer width="wide" className="relative z-10 space-y-6 py-8">
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <Link
              href="/partners/recruitment"
              aria-label="Back to recruitment dashboard"
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative">
            <HighlightCard
              color="orange"
              title={heroCard.title}
              description={heroCard.description}
              icon={<BarChart3 className="h-5 w-5" aria-hidden />}
              hideDivider
              showCornerIcon={false}
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
              fullWidth
              className="w-full max-w-none pl-12"
            />
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <SettingsGroupCallout
          icon={<TrendingUp className="h-4 w-4" />}
          title="Revenue & approvals"
          subtitle="Four-week trend across invites, approvals, and payout-ready revenue"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "p-4 text-white/85")}>
            <PerformanceChart />
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Target className="h-4 w-4" />} title="Key analytics" subtitle="Conversion, payout, and timing signals to monitor" showChevron={false}>
          <div className="grid gap-4 lg:grid-cols-2">
            {keyMetrics.map((metric) => (
              <article key={metric.label} className={cn(stackedPanelClass, "p-4 text-sm text-white/85")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <span className="rounded-2xl border border-white/15 siso-inner-card-strong p-2 text-siso-orange">
                      {metric.icon}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">{metric.label}</p>
                      <p className="text-[11px] text-white/50">{metric.helper}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-white">{metric.value}</p>
                    <p className="text-xs text-white/60">{metric.delta}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SettingsGroupCallout>

        <div className="grid gap-4 lg:grid-cols-2">
          <SettingsGroupCallout icon={<Layers className="h-4 w-4" />} title="Insights" subtitle="Signals to share with sales leadership" showChevron={false}>
            <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/80")}>
              {insightItems.map((item) => (
                <div key={item.title} className={cn(nestedCardClass, "p-4")}>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </SettingsGroupCallout>

          <SettingsGroupCallout icon={<PieChart className="h-4 w-4" />} title="Channel mix" subtitle="Where approvals and revenue originated" showChevron={false}>
            <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/80")}>
              {channelMix.map((channel) => (
                <div key={channel.label} className={cn(nestedCardClass, "p-4")}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        aria-hidden
                        style={{ backgroundColor: `var(${channel.token})` }}
                      />
                      <p className="font-semibold text-white">{channel.label}</p>
                    </div>
                    <p className="text-base font-semibold text-white">{channel.percent}%</p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full"
                      style={{
                        width: `${channel.percent}%`,
                        backgroundColor: `var(${channel.token})`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/60">{channel.helper}</p>
                </div>
              ))}
            </div>
          </SettingsGroupCallout>
        </div>
      </PartnersPageContainer>
    </section>
  );
}

function PerformanceChart() {
  const maxRevenue = Math.max(...performanceTrend.map((point) => point.revenue), 1);
  const chartHeight = 160;

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        {performanceTrend.map((point) => {
          const revenueHeight = Math.max((point.revenue / maxRevenue) * chartHeight, 20);
          const payoutHeight = Math.max((point.payouts / maxRevenue) * chartHeight, 12);
          return (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/80">
                {point.approvals}
              </span>
              <div className="flex items-end gap-1">
                <span
                  className="w-6 rounded-full"
                  style={{
                    height: `${revenueHeight}px`,
                    background: "linear-gradient(180deg, rgba(255,87,34,0.2) 0%, rgba(255,167,38,0.9) 100%)",
                  }}
                />
                <span
                  className="w-3 rounded-full"
                  style={{
                    height: `${payoutHeight}px`,
                    backgroundColor: "var(--siso-stage-won)",
                  }}
                />
              </div>
              <div className="text-center text-sm text-white">
                <p className="text-lg font-semibold leading-none">{point.day}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{point.month}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            aria-hidden
            style={{ background: "linear-gradient(135deg, rgba(255,87,34,0.6), rgba(255,167,38,0.9))" }}
          />
          <span>Revenue booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            aria-hidden
            style={{ backgroundColor: "var(--siso-stage-won)" }}
          />
          <span>Payout-ready overrides</span>
        </div>
      </div>
    </div>
  );
}
