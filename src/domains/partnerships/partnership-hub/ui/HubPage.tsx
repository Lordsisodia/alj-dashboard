// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, CheckSquare, Bell, SlidersHorizontal, Flag, Play, CreditCard, Target } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import { getPipelineOverview } from "@/domains/partnerships/pipeline-ops/shared/application/pipelineOpsService";
import { getWalletSnapshot, getTierProgressSnapshot } from "@/domains/partnerships/earnings/01-dashboard/application/dashboard-data";
import { getWorkspaceTasks } from "@/domains/partnerships/workspace/application/useWorkspacePanels";

type SectionCard = {
  title: string;
  description: string;
  href: string;
  tag?: string;
  stat?: string;
  note?: string;
  icon?: React.ReactNode;
};

function PillButton({
  icon,
  label,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:border-white/25 transition">
      {icon}
      {label}
    </span>
  );
  if (href) {
    return (
      <Link href={href} className="flex">
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="flex">
      {content}
    </button>
  );
}

function HubCallout({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[26px] border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-siso-bg-hover text-siso-orange">
            {icon}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-siso-text-primary">{title}</p>
            {subtitle ? <p className="text-xs text-siso-text-muted leading-snug max-w-[60ch]">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      {children ? <div className="px-4 pb-4">{children}</div> : null}
    </section>
  );
}

export function HubPage() {
  const [showPwa, setShowPwa] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [stats, setStats] = useState({
    prospects: 0,
    deals: 0,
    invites: 0,
    wallet: "$0",
    tierProgress: 0,
    tasks: 0,
    taskTitles: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const pipeline = await getPipelineOverview();
        const earnings = getWalletSnapshot();
        const tier = getTierProgressSnapshot();
        const workspace = getWorkspaceTasks();
        setStats({
          prospects: pipeline.prospects?.length ?? 0,
          deals: pipeline.activeDeals?.length ?? 0,
          invites: pipeline.recruitment?.length ?? 0,
          wallet: earnings.walletSummary.balance ?? "$0",
          tierProgress: tier.tierMeta?.progressPct ?? 0,
          tasks: workspace.tasks?.length ?? 0,
          taskTitles: workspace.tasks?.slice(0, 3).map((t) => t.title) ?? [],
        });
      } catch {
        // keep defaults
      }
    })();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop />
      <PartnersPageContainer className="relative z-10 w-full space-y-6 pb-12 pt-6">
        <div className="relative">
          <HighlightCard
            color="orange"
            title="Partnership Hub"
            description="Jump to every partner surface from one place-mobile-first, ready for home screen."
            hideDivider
            hideFooter
            titleClassName="uppercase tracking-[0.35em] text-white"
            descriptionClassName="text-sm text-white/80"
            fullWidth
            showCornerIcon={false}
            className="shadow-xl shadow-black/20 w-full max-w-none"
          />

          {/* Onboarding helper pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <PillButton
              icon={<Play className="h-4 w-4 text-[#FFA726]" />}
              label="60s tour"
              onClick={() => setShowTour(true)}
            />
            <PillButton
              icon={<Target className="h-4 w-4 text-[#FFA726]" />}
              label="Start here"
              href="/partners/academy/getting-started"
            />
            <PillButton
              icon={<CreditCard className="h-4 w-4 text-[#FFA726]" />}
              label="Set payout"
              href="/partners/earnings/wallet"
            />
          </div>

          {/* Desktop-only ribbon flag */}
          <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
            <div className="absolute inset-0 flex items-center justify-center text-orange-500">
              <Flag className="w-4 h-4" />
            </div>
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-2">
          {showPwa ? (
            <HubCallout
              icon={<Download className="h-4 w-4" />}
              title="Install the app (PWA)"
              subtitle="Add SISO to your home screen for instant launch and offline caching."
            >
              <div className="space-y-3 rounded-2xl border border-white/10 bg-siso-bg-hover px-4 py-3 text-sm text-siso-text-secondary">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-siso-text-muted">iPhone (Safari)</p>
                  <ol className="space-y-1 list-decimal list-inside text-siso-text-secondary">
                    <li>Tap the <span className="font-semibold">Share</span> icon in Safari.</li>
                    <li>Scroll and tap <span className="font-semibold">Add to Home Screen</span>.</li>
                    <li>Confirm "SISO" and tap <span className="font-semibold">Add</span>.</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-siso-text-muted">Android (Chrome)</p>
                  <ol className="space-y-1 list-decimal list-inside text-siso-text-secondary">
                    <li>Tap the <span className="font-semibold">⋮</span> menu (top right).</li>
                    <li>Select <span className="font-semibold">Add to Home screen</span>.</li>
                    <li>Confirm "SISO" and tap <span className="font-semibold">Add</span>.</li>
                  </ol>
                </div>
                <p className="text-xs text-siso-text-muted">You'll get faster launch, offline caching for wallet & tasks, and a full-screen app.</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-siso-text-muted underline decoration-dotted underline-offset-4 hover:text-siso-text-primary"
                    onClick={() => setShowPwa(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </HubCallout>
          ) : (
            <div className="hidden md:block" />
          )}

          <HubCallout
            icon={<CheckSquare className="h-4 w-4" />}
            title="Onboarding checklist"
            subtitle="Finish setup to unlock faster payouts and partner perks."
          >
            <div className="grid gap-2">
              {[
                { label: "Add SISO to home screen (PWA)", done: false, href: "/partners" },
                { label: "Watch welcome walkthrough", done: false, href: "/partners/academy/getting-started" },
                { label: "Complete profile extras (bio, links, expertise)", done: false, href: "/partners/settings/profile" },
                { label: "Submit your first client", done: false, href: "/partners/pipeline-ops/submit-client" },
                { label: "Join #announcements channel", done: true, href: "/partners/community/announcements" },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-siso-bg-hover px-3 py-2 text-sm text-siso-text-secondary"
                >
                  <span className={item.done ? "line-through text-siso-text-muted" : undefined}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-white/15 px-2 py-1 text-[11px] text-siso-text-muted hover:text-white hover:border-white/30"
                    >
                      Open
                    </Link>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                        item.done ? "bg-emerald-500/80 text-white" : "border border-siso-border-primary text-white/70"
                      }`}
                      aria-hidden
                    >
                      {item.done ? "✓" : ""}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </HubCallout>
        </section>

        {showTour ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-siso-bg-secondary shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Play className="h-4 w-4 text-[#FFA726]" />
                  60s tour • What to do first
                </div>
                <button
                  type="button"
                  className="text-white/60 hover:text-white"
                  onClick={() => setShowTour(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="bg-black aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                  title="Partner tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 space-y-2 text-sm text-white/80">
                <p>• Open Pipeline: add your first referral.</p>
                <p>• Start Here: unlock more features as you progress.</p>
                <p>• Set payouts: we pay out 30% on closed deals.</p>
              </div>
            </div>
          </div>
        ) : null}

        <section className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: "Academy",
              description: "Lessons, spotlight, and proof assets to send prospects.",
              href: "/partners/academy",
              stat: "Continue: Training Spotlight",
              note: "2 lessons left this week",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "academy",
            },
            {
              title: "Client pipeline",
              description: "Prospects, active deals, and recruitment funnels.",
              href: "/partners/pipeline-ops",
              stat: `${stats.prospects} prospects · ${stats.deals} active deals`,
              note: "Newest prospect added 2h ago",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "pipeline",
            },
            {
              title: "Recruitment",
              description: "Invite and track partners; manage overrides.",
              href: "/partners/recruitment",
              stat: `${stats.invites} invites in flight`,
              note: "1 pending acceptance",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "recruitment",
            },
            {
              title: "Earnings",
              description: "Wallet, payouts, tier progress, challenges.",
              href: "/partners/earnings",
              stat: `${stats.wallet} wallet · ${stats.tierProgress}% to next tier`,
              note: "Next payout scheduled Nov 25",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "earnings",
            },
            {
              title: "Community",
              description: "Announcements, messages, wins, and help center.",
              href: "/partners/community",
              stat: "5 unread · 2 mentions",
              note: "New announcement posted today",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "community",
            },
            {
              title: "Workspace",
              description: "Tasks, notes, files, calendar.",
              href: "/partners/workspace",
              stat: `${stats.tasks} open tasks`,
              note: "Today's filter ready",
              tag: "Coming soon",
              icon: <ArrowUpRight className="h-4 w-4" />,
              slug: "workspace",
            },
            {
              title: "Notifications",
              description: "Tune alerts and delivery preferences.",
              href: "/partners/settings/notifications",
              stat: "Push + email enabled",
              note: "Quiet hours off",
              icon: <Bell className="h-4 w-4" />,
              slug: "notifications",
            },
            {
              title: "Settings",
              description: "Theme, language, devices, and integrations.",
              href: "/partners/settings/general",
              stat: "Devices 3 · Integrations 2 connected",
              note: "Language: English (US)",
              icon: <SlidersHorizontal className="h-4 w-4" />,
              slug: "settings",
            },
          ].map((item) => (
            <QuickCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
              tag={item.tag}
              stat={item.stat}
              note={item.note}
              slug={item.slug}
              statsSnapshot={stats}
            />
          ))}
        </section>
      </PartnersPageContainer>
    </div>
  );
}

function QuickCard({
  title,
  description,
  href,
  icon,
  tag,
  stat,
  note,
  slug,
  statsSnapshot,
}: {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  tag?: string;
  stat?: string;
  note?: string;
  slug: string;
  statsSnapshot: {
    prospects: number;
    deals: number;
    invites: number;
    wallet: string | number;
    tierProgress: number;
    tasks: number;
    taskTitles: string[];
  };
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[26px] border border-white/10 bg-siso-bg-secondary p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-[1px] hover:border-white/20 hover:bg-siso-bg-tertiary"
    >
      <div className="flex items-center gap-2 text-siso-text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-siso-bg-hover text-siso-orange">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-siso-text-primary">{title}</p>
          <p className="text-xs text-siso-text-muted leading-snug line-clamp-2">{description}</p>
        </div>
        {tag ? (
          <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-siso-text-muted">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-siso-bg-hover px-3 py-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          {stat ? <span className="rounded-full bg-siso-bg-primary px-3 py-1 text-xs font-semibold text-siso-text-secondary">{stat}</span> : null}
          {note ? <span className="rounded-full bg-siso-bg-primary px-3 py-1 text-[11px] text-siso-text-muted">{note}</span> : null}
        </div>
        <CardDetail slug={slug} stats={statsSnapshot} />
      </div>

      <div className="mt-3 flex">
        <span className="inline-flex items-center gap-1 rounded-full bg-siso-bg-hover px-3 py-2 text-xs font-semibold text-siso-text-primary transition group-hover:text-siso-text-primary group-hover:bg-siso-bg-active">
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function CardDetail({
  slug,
  stats,
}: {
  slug: string;
  stats: { prospects: number; deals: number; invites: number; wallet: string | number; tierProgress: number; tasks: number; taskTitles: string[] };
}) {
  const bar = (percent: number, label: string) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-siso-text-muted">
        <span>{label}</span>
        <span className="text-siso-text-primary">{Math.round(percent)}%</span>
      </div>
      <div className="h-2 rounded-full bg-siso-bg-primary/80">
        <div className="h-2 rounded-full bg-gradient-to-r from-[var(--siso-red)] to-[var(--siso-orange)]" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );

  switch (slug) {
    case "pipeline":
      return (
        <div className="space-y-2">
          {bar((stats.deals / Math.max(1, stats.prospects + stats.deals)) * 100, "Deals in motion")}
          <div className="h-3 w-full overflow-hidden rounded-full bg-siso-bg-primary">
            <div
              className="h-full bg-gradient-to-r from-[var(--siso-stage-prospect)] to-[var(--siso-stage-qualified)]"
              style={{ width: `${Math.min(100, (stats.prospects / Math.max(1, stats.prospects + stats.deals)) * 100)}%` }}
            />
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-siso-bg-primary">
            <div
              className="h-full bg-gradient-to-r from-[var(--siso-stage-proposal)] to-[var(--siso-stage-negotiation)]"
              style={{ width: `${Math.min(100, (stats.deals / Math.max(1, stats.prospects + stats.deals)) * 100)}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
            <span className="rounded-full bg-siso-bg-primary px-2 py-1">Prospects: {stats.prospects}</span>
            <span className="rounded-full bg-siso-bg-primary px-2 py-1">Active deals: {stats.deals}</span>
          </div>
        </div>
      );
    case "earnings":
      return (
        <div className="space-y-2">
          {bar(stats.tierProgress, "Tier progress")}
          <p className="text-xs text-siso-text-muted">Wallet includes pending and released payouts.</p>
        </div>
      );
    case "workspace":
      return (
        <div className="space-y-2">
          {bar(Math.min(100, (stats.tasks / 8) * 100), "Tasks ready")}
          <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
            {stats.taskTitles.map((t) => (
              <span key={t} className="rounded-full bg-siso-bg-primary px-2 py-1">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-siso-text-muted">Today's filter bundles tasks, notes, files.</p>
        </div>
      );
    case "community":
      return (
        <div className="space-y-2">
          <p className="text-xs text-siso-text-muted">Unread and mentions across announcements and messages.</p>
        </div>
      );
    case "academy":
      return (
        <div className="space-y-2">
          {bar(65, "Spotlight progress")}
          <p className="text-xs text-siso-text-muted">Pick up where you left off or jump to Portfolio proofs.</p>
        </div>
      );
    case "recruitment":
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
            <span className="rounded-full bg-siso-bg-primary px-2 py-1">Invites: {stats.invites}</span>
            <span className="rounded-full bg-siso-bg-primary px-2 py-1">Pending: 1</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-siso-bg-primary">
            <div className="h-full bg-gradient-to-r from-[var(--siso-stage-prospect)] via-[var(--siso-stage-qualified)] to-[var(--siso-stage-won)]" style={{ width: "62%" }} />
          </div>
          <p className="text-xs text-siso-text-muted">Invite approval velocity and queue health.</p>
        </div>
      );
    case "notifications":
      return (
        <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Push</span>
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Email</span>
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Quiet hours: Off</span>
        </div>
      );
    case "settings":
      return (
        <div className="flex flex-wrap gap-2 text-xs text-siso-text-muted">
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Devices: 3</span>
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Integrations: 2</span>
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Language: EN-US</span>
          <span className="rounded-full bg-siso-bg-primary px-2 py-1">Theme: Dark</span>
        </div>
      );
    default:
      return null;
  }
}

export default HubPage;
