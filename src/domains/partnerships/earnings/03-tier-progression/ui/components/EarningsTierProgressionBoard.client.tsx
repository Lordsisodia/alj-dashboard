"use client";

import { HighlightCard } from "@/components/ui/card-5-static";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import Progress from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, History, Flag } from "lucide-react";
import { EarningsHeroBackLink } from "@/domains/partnerships/earnings/shared/ui/components/EarningsHeroBackLink";
import { cn } from "@/domains/shared/utils/cn";
import {
  nestedCardClass,
  primaryGradientButtonClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import type {
  TierHistoryEntry,
  UnlockMission,
} from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";

type TierMetaState = {
  currentTier: string;
  nextTier: string;
  pointsToNext: number;
  estUpgradeDate: string;
  progressPct: number;
};

type EarningsTierProgressionBoardProps = {
  tierMeta: TierMetaState;
  tierHistory: TierHistoryEntry[];
  unlockMissions: UnlockMission[];
};

export function EarningsTierProgressionBoard({ tierMeta, tierHistory, unlockMissions }: EarningsTierProgressionBoardProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop />

      <PartnersPageContainer
        width="wide"
        className="relative z-10 flex flex-1 flex-col gap-6 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8"
      >
        <TierHero tierMeta={tierMeta} />
        <TierStatusCard tierMeta={tierMeta} />

        <TierBadges tierMeta={tierMeta} />

        <SettingsGroupCallout
          icon={<Target className="h-4 w-4" />}
          title="Upcoming unlock missions"
          subtitle="Complete these to fast-track your next tier"
          showChevron={false}
        >
          <div className="space-y-4">
            {unlockMissions.slice(0, 3).map((mission) => (
              <div key={mission.id} className={`${nestedCardClass} p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-white">{mission.title}</p>
                    <p className="text-xs text-siso-text-muted">{mission.description}</p>
                  </div>
                  <Badge className="bg-siso-orange/20 text-siso-orange">{mission.reward}</Badge>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">
                  {mission.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className={primaryGradientButtonClass}
                    onClick={() => {
                      // TODO: wire to mission start flow
                    }}
                  >
                    Start mission
                  </Button>
                  <Button size="sm" variant="secondary" className={secondaryActionButtonClass}>
                    View rules
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <Button
                asChild
                size="sm"
                className={cn(
                  secondaryActionButtonClass,
                  "rounded-full px-4 text-[11px] uppercase tracking-[0.3em] text-white/80"
                )}
              >
                <Link href="/partners/earnings/missions">View all missions</Link>
              </Button>
            </div>
          </div>
          {unlockMissions.length > 3 ? (
            <p className="text-center text-xs text-siso-text-muted">{unlockMissions.length - 3} more missions are available in the Missions tab.</p>
          ) : null}
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<History className="h-4 w-4" />}
          title="Tier history"
          subtitle="Every upgrade since joining"
          showChevron={false}
        >
          <div className={`${stackedPanelClass} space-y-4 p-4`}>
            {tierHistory.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 siso-inner-card-strong text-xs font-semibold text-white">
                  {entry.tier}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{entry.date}</p>
                  <p className="text-xs text-siso-text-muted">{entry.note}</p>
                </div>
              </div>
            ))}
            {tierHistory.length > 3 ? (
              <p className="text-xs text-siso-text-muted">Older tier upgrades are available in the full history view.</p>
            ) : null}
          </div>
        </SettingsGroupCallout>

        <div className="rounded-[26px] border border-siso-orange/60 bg-siso-orange/10 px-4 py-5 text-sm text-white/90">
          <p className="font-semibold uppercase tracking-[0.3em]">Need a review?</p>
          <p className="text-xs text-white/80">If you've met the requirements, request a manual tier review and we'll respond in 48 hours.</p>
          <Button asChild className={primaryGradientButtonClass} size="sm">
            <Link href="/partners/earnings/review">Ask for review</Link>
          </Button>
        </div>
      </PartnersPageContainer>
    </section>
  );
}

function TierHero({ tierMeta }: { tierMeta: TierMetaState }) {
  return (
    <div className="relative min-h-[128px]">
      <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
        <EarningsHeroBackLink />
      </div>
      <div className="relative">
        <HighlightCard
          color="orange"
          className="w-full max-w-none pl-12 pr-16"
          title="Tier progress"
          description={`Stay on track for ${tierMeta.nextTier} with live mission + earnings signals.`}
          hideDivider
          hideFooter
          fullWidth
          titleClassName="uppercase tracking-[0.35em] font-semibold text-[28px] leading-[1.2]"
          descriptionClassName="text-xs"
          icon={<Trophy className="h-5 w-5" />}
          metricValue=""
          metricLabel=""
          buttonText=""
          onButtonClick={() => {}}
          showCornerIcon={false}
        />
        <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
          <div className="absolute inset-0 flex items-center justify-center text-orange-500">
            <Flag className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TierStatusCard({ tierMeta }: { tierMeta: TierMetaState }) {
  const nextTierCopy = tierMeta.nextTier ? `Next: ${tierMeta.nextTier}` : "Top tier unlocked";

  return (
    <div className={`${stackedPanelClass} p-6 text-white`}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-white/10 siso-inner-card-strong p-3 text-siso-orange shadow-[0_15px_35px_rgba(0,0,0,0.45)]">
          <Trophy className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-siso-text-muted">Current tier</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <p className="font-['Lexend:_600',_sans-serif] text-[32px] leading-none">{tierMeta.currentTier}</p>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-siso-text-muted">
              {nextTierCopy}
            </span>
          </div>
          <p className="mt-3 text-sm text-siso-text-muted">
            Missions, revenue and NPS activity fuel your momentum to the next badge.
          </p>
        </div>
      </div>

      <div className={`${nestedCardClass} mt-5 p-4`}>
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35em] text-siso-text-muted">
          <span>Your progress</span>
          <span className="text-[10px] text-white/70 normal-case tracking-normal">{tierMeta.pointsToNext} pts to go</span>
        </div>
        <Progress value={tierMeta.progressPct} className="mt-3 h-2.5" />
        <p className="mt-2 text-sm text-white/90">
          {tierMeta.progressPct}% of the way to {tierMeta.nextTier}
        </p>
        <p className="text-xs text-siso-text-muted">{tierMeta.estUpgradeDate}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild variant="secondary" className={secondaryActionButtonClass}>
          <Link href="/partners/earnings/tiers">View benefits</Link>
        </Button>
        <Button asChild variant="secondary" className={`${secondaryActionButtonClass} text-siso-text-muted`}>
          <Link href="/partners/earnings/review">Ask for review</Link>
        </Button>
      </div>
    </div>
  );
}

function TierBadges({ tierMeta }: { tierMeta: TierMetaState }) {
  const tiers = [
    {
      name: "Trailblazer",
      commission: 20,
      xpRequired: 0,
      src: "/tiers/Trailblazer.svg",
      perks: ["Launch previews", "Weekly learn boost", "Standard SLA"],
      description: "Kickstart your journey with core access and faster learning boosts.",
      unlockHint: "Default tier. Start earning XP to unlock Builder at 1,000 XP.",
    },
    {
      name: "Builder",
      commission: 23,
      xpRequired: 1000,
      src: "/tiers/Builder.svg",
      perks: ["+2% payout boost", "Ops betas", "Quarterly coaching"],
      description: "Solidify your fundamentals with payouts and ops betas.",
      unlockHint: "Reach 3,000 XP to hit Vanguard. Close 2 wins or finish 3 courses to bridge the gap faster.",
    },
    {
      name: "Vanguard",
      commission: 26,
      xpRequired: 3000,
      src: "/tiers/Vanguard.svg",
      perks: ["+4% payout boost", "Growth betas", "Co-marketing"],
      description: "Lead the pack with growth betas and co-marketing eligibility.",
      unlockHint: "Target 10,000 XP for Apex. Stack verified wins and growth missions.",
    },
    {
      name: "Apex",
      commission: 28,
      xpRequired: 10000,
      src: "/tiers/Apex.svg",
      perks: ["+5% payout boost", "Roadmap vote", "Priority launches"],
      description: "Influence the roadmap and get priority launches.",
      unlockHint: "Push to 25,000 XP for Sovereign. Large deals + mentorship hours move you fastest.",
    },
    {
      name: "Sovereign",
      commission: 30,
      xpRequired: 25000,
      src: "/tiers/Sovereign.svg",
      perks: ["+6% payout boost", "Rev-share pilots", "Concierge"],
      description: "Top-tier privileges with revenue-share pilots and concierge help.",
      unlockHint: "You've reached the summit. Maintain activity to keep the crown.",
    },
  ];

  const initialIndex = Math.max(
    0,
    tiers.findIndex((tier) => tier.name === tierMeta.currentTier)
  );
  const [index, setIndex] = useState(initialIndex);
  const current = tiers[index];
  // TODO: replace with real user XP once wired to API
  const userXp = 1250;
  const nextTier = tiers[index + 1];
  const xpToNext = nextTier ? Math.max(0, nextTier.xpRequired - userXp) : 0;

  const canPrev = index > 0;
  const canNext = index < tiers.length - 1;

  return (
    <SettingsGroupCallout
      icon={<Trophy className="h-4 w-4" />}
      title="Tier badges"
      subtitle="Current artwork for each tier"
      showChevron={false}
    >
      <div className="flex flex-col gap-3">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl">
          <Image
            src={current.src}
            alt={`${current.name} badge`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-[11px] text-siso-text-muted">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-white">{current.xpRequired.toLocaleString()} XP+</span>
            <span className="rounded-full bg-siso-orange/15 px-2.5 py-1 text-siso-orange">{current.commission}% commission</span>
            {nextTier ? (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-white">
                {xpToNext.toLocaleString()} XP to {nextTier.name}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-white">Top tier unlocked</span>
            )}
          </div>
          <div className="text-xs text-siso-text-muted">{index + 1} / {tiers.length}</div>
        </div>

        {current.description && (
          <p className="text-sm text-white/85">{current.description}</p>
        )}
        {current.unlockHint && (
          <p className="text-xs text-siso-text-muted">{current.unlockHint}</p>
        )}

        {current.perks.length ? (
          <div className="flex flex-wrap gap-2 text-[11px] text-siso-text-muted">
            {current.perks.slice(0, 2).map((perk) => (
              <span key={perk} className="rounded-full border border-white/15 px-3 py-1">
                {perk}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <Button
            size="sm"
            className={cn(
              secondaryActionButtonClass,
              "rounded-full px-4 text-[11px] uppercase tracking-[0.3em]"
            )}
            disabled={!canPrev}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className={cn(
              primaryGradientButtonClass,
              "rounded-full px-4 text-[11px] uppercase tracking-[0.3em]"
            )}
            disabled={!canNext}
            onClick={() => setIndex((i) => Math.min(tiers.length - 1, i + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </SettingsGroupCallout>
  );
}
