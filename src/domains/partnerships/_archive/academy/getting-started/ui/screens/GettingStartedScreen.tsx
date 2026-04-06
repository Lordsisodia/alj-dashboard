// @ts-nocheck
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { ArrowLeft, Info, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Awards } from "@/components/ui/award";
import { HighlightCard } from "@/components/ui/card-5-static";
import { Button } from "@/components/ui/button";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { cn } from "@/lib/utils";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { ProgressSnapshot } from "@/domains/partnerships/academy/shared/application/progress-service";

type GettingStartedScreenProps = ProgressSnapshot & { paginationBasePath?: string };

export function GettingStartedScreen({
  level,
  tiers,
  xpFeed,
  certificates,
  paginationBasePath = "/partners/academy/my-progress",
}: GettingStartedScreenProps) {
  const currentTier = tiers.find((tier) => tier.id === level.currentTierId) ?? tiers[0];
  const nextTier = tiers.find((tier) => tier.id === level.nextTierId) ?? tiers[1];
  const tierPct = Math.round((level.currentPoints / (level.currentPoints + level.pointsToNextLevel)) * 100);
  const showPagination = xpFeed.totalPages > 1;
  const buildPageHref = (page: number) => (page <= 1 ? paginationBasePath : `${paginationBasePath}?page=${page}`);

  return (
    <main className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:py-12">
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
            title="My Progress"
            description="Climb tiers to unlock higher earnings and perks."
            metricValue={`Tier • Level ${level.currentLevel}`}
            metricLabel={`${level.currentPoints} pts • ${level.pointsToNextLevel} to Level ${level.nextLevel}`}
            icon={<Awards variant="badge" title="Tier" subtitle={`L${level.currentLevel}`} level="gold" showIcon />}
            className="w-full pl-12"
            hideDivider
            hideFooter
            showCornerIcon={false}
            titleClassName="uppercase tracking-[0.35em] text-white"
            descriptionClassName="text-sm"
          />
        </div>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Tier progress" subtitle="Your path to next tier" showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-3 px-4 py-4 text-sm text-siso-text-muted")}>
            <div className={cn(nestedCardClass, "relative overflow-hidden border-white/10 p-0")}>
              {currentTier.art ? (
                <Image src={currentTier.art} alt={`${currentTier.title} crest`} width={1200} height={260} className="h-40 w-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-transparent" />
            </div>

            <div className="space-y-1 text-base text-white">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                Current tier • {currentTier?.title ?? "Tier"} • {tierPct}%
              </p>
              <p className="font-semibold">{level.pointsToNextLevel} pts to {nextTier?.title ?? "next tier"}</p>
              <p className="text-xs text-siso-text-muted">Est. 2-3 wins or 1 course completion to level up</p>
            </div>

            <div className="h-3 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-siso-orange" style={{ width: `${Math.min(100, tierPct)}%` }} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-siso-text-muted">
              <Info className="h-3.5 w-3.5 text-siso-orange" />
              <span>Complete "Discovery Basics" or log a closed-won deal to add +200 pts instantly.</span>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className={cn(
                  secondaryActionButtonClass,
                  "w-full max-w-xs border-white/25 text-white/90 hover:text-white",
                )}
              >
                <Link href="/partners/earnings/tier-progression">View tiers & perks</Link>
              </Button>
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="XP activity" subtitle="Recent points you earned" showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-3 px-4 py-4 text-sm text-white/85")}>
            <div className="flex items-center gap-2 text-[11px] text-siso-text-muted">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">Past 7 days</span>
            </div>
            <div className="space-y-2">
              {xpFeed.items.length === 0 ? (
                <div className="rounded-2xl border border-white/10 px-4 py-6 text-center text-sm text-siso-text-muted">
                  No XP activity logged yet. Take an Academy course or log a win to earn points.
                </div>
              ) : (
                xpFeed.items.map((item) => (
                  <div key={item.id} className={cn(nestedCardClass, "flex items-center justify-between px-3 py-2")}>
                    <div className="space-y-1">
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-siso-text-muted">
                        <span className="rounded-full bg-white/[0.08] px-2 py-[2px] uppercase tracking-[0.08em]">{item.source}</span>
                        <span>{item.when}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-siso-orange">+{item.xp} XP</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {showPagination ? (
              <div className="flex items-center justify-between gap-2 pt-2 text-xs text-siso-text-muted">
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/80 disabled:border-white/5 disabled:text-white/30"
                  disabled={xpFeed.page <= 1}
                >
                  <Link href={buildPageHref(xpFeed.page - 1)} prefetch>
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Link>
                </Button>
                <span>
                  Page {xpFeed.page} / {xpFeed.totalPages}
                </span>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/80 disabled:border-white/5 disabled:text-white/30"
                  disabled={xpFeed.page >= xpFeed.totalPages}
                >
                  <Link href={buildPageHref(xpFeed.page + 1)} prefetch>
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ) : null}
            <Button
              asChild
              variant="secondary"
              size="sm"
              className={cn(
                secondaryActionButtonClass,
                "w-full sm:w-auto border-white/25 text-white/90 hover:text-white",
              )}
            >
              <Link href="/partners/academy/xp-breakdown">View XP activity</Link>
            </Button>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Certificates & badges" subtitle="Milestones you've hit" showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-4 p-4 text-white/85")}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className={cn(nestedCardClass, "p-4 text-white")}>
                <p className="text-xs uppercase tracking-[0.3em] text-siso-text-muted">Certificates</p>
                <p className="text-3xl font-bold">{certificates.count}</p>
                <p className="text-sm text-siso-text-muted">Course certificates earned</p>
              </div>
              <div className={cn(nestedCardClass, "p-4 text-white")}>
                <p className="text-xs uppercase tracking-[0.3em] text-siso-text-muted">Badges</p>
                <p className="text-3xl font-bold">{certificates.badges}</p>
                <p className="text-sm text-siso-text-muted">Unique achievements unlocked</p>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className={cn(
                secondaryActionButtonClass,
                "w-full sm:w-auto border-white/25 text-white/90 hover:text-white",
              )}
            >
              <Link href="/partners/academy/certificates">View certificates</Link>
            </Button>
          </div>
        </SettingsGroupCallout>
      </div>
    </main>
  );
}
