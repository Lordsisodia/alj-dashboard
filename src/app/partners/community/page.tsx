import { Suspense } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Megaphone, Hash, MessageSquareText, UsersRound, LifeBuoy, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "../../../domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Waves } from "@/components/ui/wave-background";
import { Button } from "@/components/ui/button";
import { cn } from "@/domains/shared/utils/cn";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

type CommunityEntry = { title: string; meta: string; action?: string };

type MessagesStats = {
  unread: number;
  mentions: number;
  drafts: number;
  trend: number[];
};

type PartnersStats = {
  totalProfiles: number;
  openToMentor: number;
  hiring: number;
  avgResponseHours: number;
  availabilityPercent: number;
};

type HelpCenterStats = {
  openTickets: number;
  avgReplyHours: number;
  resolvedToday: number;
  backlog: number;
  categories: Array<{ label: string; count: number }>;
};

type CommunityCardDefinition = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  progress?: { value: number; label: string; helper?: string };
  entries?: CommunityEntry[];
  subtitle?: string;
  variant?: "default" | "messages" | "partners" | "help";
  messageStats?: MessagesStats;
  partnerStats?: PartnersStats;
  helpStats?: HelpCenterStats;
  ctaLabel?: string;
};

const roomCards: CommunityCardDefinition[] = [
  {
    id: "general-chat",
    title: "General Chat",
    description: "Program-wide broadcast for quick updates and daily check-ins.",
    href: "/partners/community/channels/general-chat",
    progress: { value: 72, label: "Threads resolved", helper: "Maintained <15m SLA" },
    entries: [
      { title: "Cam Rivera • PropTech pilot handoff", meta: "24 replies • 6m ago", action: "Jump in" },
      { title: "Studio standup", meta: "Starts 9:00 AM PT", action: "Prep" },
    ],
  },
  {
    id: "wins",
    title: "Wins",
    description: "Celebrate deals, lessons, and replicable plays.",
    href: "/partners/community/channels/wins",
    progress: { value: 67, label: "Weekly goal", helper: "6 wins target" },
    entries: [
      { title: "£62k SaaS build • PropTech", meta: "Hook: White-label leasing" },
      { title: "Bank pilot • Rev split", meta: "Deck shared • 12 reactions" },
    ],
  },
  {
    id: "announcements",
    title: "Announcements",
    description: "Official updates, release notes, and program alerts.",
    href: "/partners/community/announcements",
    progress: { value: 86, label: "Acknowledged", helper: "Tap to confirm" },
    entries: [
      { title: "Phase 4 release window", meta: "Rollout Nov 25 • Required", action: "Review" },
      { title: "Hub downtime notice", meta: "Maintenance Nov 27 01:00 UTC" },
    ],
  },
];

const dedicatedCards: CommunityCardDefinition[] = [
  {
    id: "messages",
    title: "Messages",
    description: "Direct threads, DMs, and mobile composer.",
    href: "/partners/community/messages",
    icon: MessageSquareText,
    subtitle: "Keep up with DMs, club threads, and composer drafts.",
    variant: "messages",
    ctaLabel: "See Messages",
    messageStats: {
      unread: 5,
      mentions: 2,
      drafts: 1,
      trend: [6, 4, 7, 3, 5, 8, 4],
    },
    entries: [
      { title: "Ava Malik", meta: "Need GTM doc • 3m ago", action: "Reply" },
      { title: "Draft • Pricing deck", meta: "Auto-saved 07:45" },
    ],
  },
  {
    id: "all-partners",
    title: "All Partners",
    description: "Discover studios, badges, and availability.",
    href: "/partners/community/all-partners",
    icon: UsersRound,
    subtitle: "Sort by tier, focus, and collaboration signals.",
    variant: "partners",
    ctaLabel: "See All Partners",
    partnerStats: {
      totalProfiles: 58,
      openToMentor: 12,
      hiring: 7,
      avgResponseHours: 3,
      availabilityPercent: 64,
    },
    entries: [
      { title: "Noor Films", meta: "Studio • Open to mentor", action: "View" },
      { title: "Atlas Ops", meta: "Hiring • Async friendly" },
    ],
  },
  {
    id: "help-center",
    title: "Help Center",
    description: "FAQ, troubleshooting, and support inbox.",
    href: "/partners/community/help",
    icon: LifeBuoy,
    subtitle: "Log tickets or find self-serve guides instantly.",
    variant: "help",
    ctaLabel: "See Help Center",
    helpStats: {
      openTickets: 3,
      avgReplyHours: 4,
      resolvedToday: 6,
      backlog: 1,
      categories: [
        { label: "Billing", count: 2 },
        { label: "Workflows", count: 1 },
        { label: "Product", count: 2 },
      ],
    },
    entries: [
      { title: "Billing audit request", meta: "In progress • ETA 2h", action: "Track" },
      { title: "Workflow template pack", meta: "New article today" },
    ],
  },
];

export default function CommunityDashboardPage() {
  return (
    <section className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ filter: "blur(5px)", opacity: 0.5, height: "115%" }}>
        <Suspense
          fallback={<div className="h-full w-full bg-[radial-gradient(circle_at_top,#1a120b,#040404)] opacity: 0.5" aria-hidden="true" />}
        >
          <Waves className="h-full w-full" strokeColor="#f8a75c" backgroundColor="transparent" pointerSize={0.3} />
        </Suspense>
      </div>

      <PartnersPageContainer className="relative z-10 space-y-6 py-8">
        <div className="relative">
          <div className="relative">
            <HighlightCard
              color="orange"
              title="Community Dashboard"
              description="See the social pulse, pinned guidelines, and quick ways to ask for help."
              icon={<Megaphone className="h-5 w-5 text-siso-orange" aria-hidden />}
              hideDivider
              hideFooter
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
              className="w-full max-w-none text-left"
              fullWidth
              showCornerIcon={false}
            />
            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative space-y-6 pb-4">
          <SettingsGroupCallout
            icon={<Hash className="h-4 w-4" />}
            title="Community Spaces"
            subtitle="Each card jumps into a live room or directory."
            showChevron={false}
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {roomCards.map((card) => (
                <CommunityWidgetCard key={card.id} card={card} />
              ))}
            </div>
            <div className="mt-4">
              <Button
                asChild
                variant="secondary"
                className={cn(
                  secondaryActionButtonClass,
                  "w-full rounded-full text-xs font-semibold uppercase tracking-[0.3em] text-white/90 hover:text-white",
                )}
              >
                <Link href="/partners/community/all-partners">See All Partners</Link>
              </Button>
            </div>
          </SettingsGroupCallout>

          {dedicatedCards.map((card) => {
            if (card.variant === "messages" && card.messageStats) {
              const Icon = card.icon ?? MessageSquareText;
              return (
                <SettingsGroupCallout
                  key={card.id}
                  icon={<Icon className="h-4 w-4" />}
                  title={card.title}
                  subtitle={card.subtitle ?? card.description}
                  showChevron={false}
                >
                  <MessagesWidgetCard card={card as CommunityCardDefinition & { messageStats: MessagesStats }} />
                  <CalloutButton href={card.href} label={card.ctaLabel ?? "See Messages"} />
                </SettingsGroupCallout>
              );
            }
            if (card.variant === "partners" && card.partnerStats) {
              const Icon = card.icon ?? UsersRound;
              return (
                <SettingsGroupCallout
                  key={card.id}
                  icon={<Icon className="h-4 w-4" />}
                  title={card.title}
                  subtitle={card.subtitle ?? card.description}
                  showChevron={false}
                >
                  <PartnersWidgetCard card={card as CommunityCardDefinition & { partnerStats: PartnersStats }} />
                  <CalloutButton href={card.href} label={card.ctaLabel ?? "See All Partners"} />
                </SettingsGroupCallout>
              );
            }
            if (card.variant === "help" && card.helpStats) {
              const Icon = card.icon ?? LifeBuoy;
              return (
                <SettingsGroupCallout
                  key={card.id}
                  icon={<Icon className="h-4 w-4" />}
                  title={card.title}
                  subtitle={card.subtitle ?? card.description}
                  showChevron={false}
                >
                  <HelpCenterWidgetCard card={card as CommunityCardDefinition & { helpStats: HelpCenterStats }} />
                  <CalloutButton href={card.href} label={card.ctaLabel ?? "See Help Center"} />
                </SettingsGroupCallout>
              );
            }
            const Icon = card.icon ?? UsersRound;
            return (
              <SettingsGroupCallout
                key={card.id}
                icon={<Icon className="h-4 w-4" />}
                title={card.title}
                subtitle={card.subtitle ?? card.description}
                showChevron={false}
              >
                <CommunityWidgetCard card={card} />
              </SettingsGroupCallout>
            );
          })}
        </div>
      </PartnersPageContainer>
    </section>
  );
}

function CommunityWidgetCard({ card }: { card: CommunityCardDefinition }) {
  return (
    <Link
      href={card.href}
      className={cn(
        nestedCardClass,
        "group relative flex h-full flex-col border-white/15 p-4 text-left transition hover:border-white/30",
      )}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{card.title}</p>
          <p className="text-xs text-siso-text-muted">{card.subtitle ?? card.description}</p>
        </div>

        {card.progress ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/70">
              <span>{card.progress.label}</span>
              <span className="font-semibold text-white">{card.progress.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400"
                style={{ width: `${Math.min(card.progress.value, 100)}%` }}
              />
            </div>
            {card.progress.helper ? (
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{card.progress.helper}</p>
            ) : null}
          </div>
        ) : null}

        {card.entries?.length ? (
          <div className="space-y-2">
            {card.entries.slice(0, 3).map((entry) => (
              <div
                key={`${card.id}-${entry.title}`}
                className="rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2 text-sm text-white/80"
              >
                <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                <div className="flex items-center justify-between text-[11px] text-siso-text-muted">
                  <span>{entry.meta}</span>
                  {entry.action ? <span className="text-siso-orange">{entry.action}</span> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
          Open channel
        </div>
      </div>
    </Link>
  );
}

function MessagesWidgetCard({ card }: { card: CommunityCardDefinition & { messageStats: MessagesStats } }) {
  const { unread, mentions, drafts, trend } = card.messageStats;
  const maxValue = Math.max(...trend, 1);
  const followUps = Math.max(mentions - 1, 0);
  const stats = [
    { label: "Unread", value: unread, helper: "Need action" },
    { label: "Mentions", value: mentions },
    { label: "Drafts", value: drafts },
    { label: "Follow-ups", value: followUps, helper: "Due" },
  ];

  return (
    <div className={`${stackedPanelClass} p-4`}>
      <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
        {stats.map((stat) => (
          <StatTile key={`${card.id}-${stat.label}`} label={stat.label} value={stat.value} helper={stat.helper} emphasize={stat.label === "Unread"} />
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Volume past 7 days</p>
        <div className="mt-2 flex h-16 items-end gap-1">
          {trend.map((value, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`${card.id}-trend-${idx}`}
              className="flex-1 rounded-full bg-gradient-to-t from-orange-400/30 via-orange-300/60 to-orange-200"
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {card.entries?.length ? (
        <div className="mt-4 space-y-2">
          {card.entries.slice(0, 2).map((entry) => (
            <div
              key={`${card.id}-${entry.title}`}
              className="rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2 text-sm text-white/80"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                {entry.action ? <span className="text-[10px] uppercase tracking-[0.3em] text-siso-orange">{entry.action}</span> : null}
              </div>
              <p className="text-[11px] text-siso-text-muted">{entry.meta}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatTile({ label, value, helper, emphasize }: { label: string; value: number; helper?: string; emphasize?: boolean }) {
  return (
    <div
      className={cn(
        nestedCardClass,
        "px-3 py-2 text-white",
        emphasize ? "border-white/15" : "border-white/10",
        emphasize ? "text-white" : "text-white/80",
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
      {helper ? <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">{helper}</p> : null}
    </div>
  );
}

function CalloutButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      asChild
      variant="secondary"
      className={cn(
        secondaryActionButtonClass,
        "mt-4 w-full rounded-full border-white/25 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 hover:text-white",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

function PartnersWidgetCard({ card }: { card: CommunityCardDefinition & { partnerStats: PartnersStats } }) {
  const { totalProfiles, openToMentor, hiring, avgResponseHours, availabilityPercent } = card.partnerStats;

  return (
    <div className={`${stackedPanelClass} p-4`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Profiles live</p>
          <p className="text-4xl font-semibold text-white">{totalProfiles}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
          <StatTile label="Open to mentor" value={openToMentor} />
          <StatTile label="Hiring" value={hiring} />
          <StatTile label="Avg response" value={avgResponseHours} helper="hrs" />
          <StatTile label="Availability" value={availabilityPercent} helper="%" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/60">
          <span>Availability map</span>
          <span className="font-semibold text-white">{availabilityPercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400"
            style={{ width: `${Math.min(availabilityPercent, 100)}%` }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Partners marked available this week</p>
      </div>

      {card.entries?.length ? (
        <div className="mt-4 space-y-2">
          {card.entries.slice(0, 2).map((entry) => (
            <div
              key={`${card.id}-${entry.title}`}
              className="rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2 text-sm text-white/80"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                {entry.action ? <span className="text-[10px] uppercase tracking-[0.3em] text-siso-orange">{entry.action}</span> : null}
              </div>
              <p className="text-[11px] text-siso-text-muted">{entry.meta}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HelpCenterWidgetCard({ card }: { card: CommunityCardDefinition & { helpStats: HelpCenterStats } }) {
  const { openTickets, avgReplyHours, resolvedToday, backlog, categories } = card.helpStats;

  return (
    <div className={`${stackedPanelClass} p-4`}>
      <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
        <StatTile label="Open tickets" value={openTickets} emphasize />
        <StatTile label="Avg reply" value={avgReplyHours} helper="hrs" />
        <StatTile label="Resolved today" value={resolvedToday} />
        <StatTile label="Backlog" value={backlog} />
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Queue by category</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/80">
          {categories.map((category) => (
            <span
              key={`${card.id}-${category.label}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 siso-inner-card-strong px-3 py-1"
            >
              <span className="text-white/70">{category.label}</span>
              <span className="font-semibold text-white">{category.count}</span>
            </span>
          ))}
        </div>
      </div>

      {card.entries?.length ? (
        <div className="mt-4 space-y-2">
          {card.entries.slice(0, 2).map((entry) => (
            <div
              key={`${card.id}-${entry.title}`}
              className="rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2 text-sm text-white/80"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                {entry.action ? <span className="text-[10px] uppercase tracking-[0.3em] text-siso-orange">{entry.action}</span> : null}
              </div>
              <p className="text-[11px] text-siso-text-muted">{entry.meta}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
