import Link from "next/link";
import { ArrowLeftRight, Star, ListChecks } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Progress from "@/components/ui/progress";
import { FloatingNavButton } from "@/domains/partnerships/_shared/ui/mobile/FloatingNavButton";
import type {
  BadgeDetail,
  NextUnlock,
} from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";
import { EarningsHeroBackLink } from "@/domains/partnerships/earnings/shared/ui/components/EarningsHeroBackLink";
import { cn } from "@/domains/shared/utils/cn";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

type BadgeSummary = {
  earned: number;
  total: number;
  nextBadge: string;
  nextBadgeProgress: number;
  seasonalBooster: string;
};

type EarningsBadgesScreenProps = {
  badgeTotals: BadgeSummary;
  badgeCollection: BadgeDetail[];
  nextUnlocks: NextUnlock[];
};

export function EarningsBadgesScreen({ badgeTotals, badgeCollection, nextUnlocks }: EarningsBadgesScreenProps) {
  const inProgressBadges = badgeCollection.filter((badge) => badge.status === "in-progress");
  const lockedBadges = badgeCollection.filter((badge) => badge.status === "locked");
  const recentBadges = badgeCollection.filter((badge) => badge.status !== "locked").slice(0, 5);

  return (
    <section className="relative flex min-h-screen flex-col bg-siso-bg-primary text-siso-text-primary">
      <FloatingNavButton />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,#20140a,#050505)]"
        style={{ opacity: 0.9 }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8">
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <EarningsHeroBackLink ariaLabel="Back to earnings dashboard" />
          </div>
          <HighlightCard
            color="orange"
            className="w-full pr-16 pl-12"
            title="My badges"
            description="See everything you've unlocked plus what to tackle next."
            titleClassName="uppercase tracking-[0.35em] text-white"
            descriptionClassName="text-sm"
            hideDivider
            hideFooter
            showCornerIcon={false}
          />
        </div>

        <BadgeSummaryCallout badgeTotals={badgeTotals} />

        <SettingsGroupCallout
          icon={<ArrowLeftRight className="h-4 w-4" />}
          title="In progress"
          subtitle="Badges you're actively chasing"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-2 p-4")}>
            {inProgressBadges.map((badge) => (
              <BadgeDetailRow key={badge.id} badge={badge} showProgress />
            ))}
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Star className="h-4 w-4" />}
          title="My badges"
          subtitle="Recently earned or in-progress"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-2 p-4")}>
            {recentBadges.map((badge) => (
              <BadgeQuickRow key={badge.id} badge={badge} />
            ))}
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<ListChecks className="h-4 w-4" />}
          title="Locked badges & unlock tips"
          subtitle="Tie requirements directly to upcoming missions"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-3 p-4")}>
            {lockedBadges.map((badge) => (
              <BadgeDetailRow key={badge.id} badge={badge} compact />
            ))}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {nextUnlocks.map((unlock) => (
                <div key={unlock.id} className={cn(nestedCardClass, "p-3 text-sm text-white/80")}>
                  <p className="text-sm font-semibold text-white">{unlock.label}</p>
                  <p className="text-xs text-white/60">{unlock.requirement}</p>
                  <Progress value={unlock.progress} className="mt-2" />
                  <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/60">{unlock.progress}% • {unlock.eta}</p>
                </div>
              ))}
            </div>
            <CalloutCTA
              label="Need ideas?"
              description="Spin up courses to unlock the next credential track."
              buttonLabel="See recommended courses"
              href="/partners/academy/courses"
            />
          </div>
        </SettingsGroupCallout>
      </div>
    </section>
  );
}

function BadgeDetailRow({ badge, showProgress, compact }: { badge: BadgeDetail; showProgress?: boolean; compact?: boolean }) {
  if (showProgress) {
    return (
      <div className={cn(nestedCardClass, "p-3 text-sm text-white/80")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-white">{badge.name}</p>
            <p className="text-xs text-white/70">{badge.description}</p>
          </div>
          <Badge className="border border-white/15 bg-white/10 text-xs uppercase tracking-[0.2em] text-white/70">
            {badge.reward}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/70">
            {badge.category}
          </span>
          <span className="text-white/60">{badge.criteria}</span>
        </div>
        <div className="mt-3">
          <Progress value={badge.progress ?? 0} />
          <div className="mt-1 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/60">
            <span>{badge.progress ?? 0}% complete</span>
            {badge.unlockedAt ? <span>{badge.unlockedAt}</span> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(nestedCardClass, "p-3 text-sm text-white/80")}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">{badge.name}</p>
          <p className="text-xs text-white/60">{badge.description}</p>
        </div>
        <div className="text-right text-xs text-white/60">
          {badge.unlockedAt ? `Unlocked ${badge.unlockedAt}` : badge.reward}
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-white/60">
          <span>{badge.category}</span>
          <span>• {badge.criteria}</span>
        </div>
      )}
      {showProgress && (
        <div className="mt-3">
          <Progress value={badge.progress ?? 0} />
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/60">{badge.progress ?? 0}% complete</p>
        </div>
      )}
    </div>
  );
}

function CalloutCTA({ label, description, buttonLabel, href }: { label: string; description: string; buttonLabel: string; href: string }) {
  return (
    <div className={cn(nestedCardClass, "flex flex-col gap-2 p-3 text-white/80")}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{label}</p>
        <p className="text-xs text-white/60">{description}</p>
      </div>
      <Button
        asChild
        size="sm"
        variant="secondary"
        className={cn(secondaryActionButtonClass, "w-full rounded-full text-xs font-semibold uppercase tracking-[0.3em]")}
      >
        <Link href={href}>{buttonLabel}</Link>
      </Button>
    </div>
  );
}

function BadgeSummaryCallout({ badgeTotals }: { badgeTotals: BadgeSummary }) {
  return (
    <div className={cn(stackedPanelClass, "p-4")}>
      <div className={cn(nestedCardClass, "p-5 text-white/80")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold text-white">
              {badgeTotals.earned}/{badgeTotals.total}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Earned overall</p>
          </div>
          <div className="text-right text-xs text-white/60">
            <p className="uppercase tracking-[0.3em]">Next: {badgeTotals.nextBadge}</p>
            <p>{badgeTotals.nextBadgeProgress}% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeQuickRow({ badge }: { badge: BadgeDetail }) {
  const statusColor =
    badge.status === "earned"
      ? "bg-emerald-400/20 text-emerald-200"
      : badge.status === "in-progress"
        ? "bg-amber-400/20 text-amber-200"
        : "bg-white/10 text-white/60";

  return (
    <div className={cn(nestedCardClass, "flex items-center justify-between px-3 py-2 text-sm text-white/80")}>
      <div>
        <p className="font-semibold text-white">{badge.name}</p>
        <p className="text-xs text-white/60">{badge.category}</p>
      </div>
      <div className="text-right text-xs">
        <Badge className={`${statusColor} border border-white/10 px-2 py-0`}>{badge.status.replace("-", " ")}</Badge>
        {badge.status === "in-progress" ? (
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/50">{badge.progress ?? 0}%</p>
        ) : badge.unlockedAt ? (
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/50">{badge.unlockedAt}</p>
        ) : null}
      </div>
    </div>
  );
}
