"use client";

import Link from "next/link";
import { Trophy, Sparkles, Award, ScrollText, ListChecks, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import Progress from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FloatingNavButton } from "@/domains/partnerships/_shared/ui/mobile/FloatingNavButton";
import { EarningsHeroBackLink } from "@/domains/partnerships/earnings/shared/ui/components/EarningsHeroBackLink";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { useState } from "react";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import type {
  BadgeDetail,
  CertificateSummary,
  AchievementFeedItem,
  NextUnlock,
} from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";

type AchievementTotals = {
  earned: number;
  total: number;
  nextBadge: string;
  nextBadgeProgress: number;
  seasonalBooster: string;
};

type EarningsAchievementsScreenProps = {
  badgeTotals: AchievementTotals;
  badgeCollectionInitial: BadgeDetail[];
  certificateSummary: CertificateSummary;
  achievementFeed: AchievementFeedItem[];
  nextUnlocks: NextUnlock[];
};

export function EarningsAchievementsScreen({
  badgeTotals,
  badgeCollectionInitial,
  certificateSummary,
  achievementFeed,
  nextUnlocks,
}: EarningsAchievementsScreenProps) {
  const [badges, setBadges] = useState<BadgeDetail[]>(badgeCollectionInitial);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const handleLoadMore = async () => {
    if (hasLoadedMore) return;
    const { badgeCollection } = await import("@/domains/partnerships/earnings/04-achievements/data/earningsAchievements");
    setBadges(badgeCollection);
    setHasLoadedMore(true);
  };

  const featuredBadges = badges.slice(0, 3);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <FloatingNavButton />
      <TierProgressBackdrop />

      <PartnersPageContainer width="wide" className="relative z-10 space-y-6 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8">
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <EarningsHeroBackLink />
          </div>
          <div className="relative">
            <HighlightCard
              color="orange"
              className="w-full max-w-none pr-16 pl-12 text-left"
              title="Achievements"
              description="Track badges, certificates, and unlocks without leaving earnings."
              titleClassName="uppercase tracking-[0.3em] font-semibold text-[24px] leading-[1.1]"
              descriptionClassName="text-xs"
              icon={<Trophy className="h-5 w-5 text-siso-orange" />}
              hideDivider
              hideFooter
              showCornerIcon={false}
              fullWidth
            />
            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
        <SettingsGroupCallout
          icon={<Sparkles className="h-4 w-4" />}
          title="Trophy case"
          subtitle="Tap through to manage badges and boosters"
          showChevron={false}
        >
          <div className={`${stackedPanelClass} grid gap-3 p-4 sm:grid-cols-2`}>
            <ControlStat
              label="Badges earned"
              value={`${badgeTotals.earned}/${badgeTotals.total}`}
              helper={`Next up: ${badgeTotals.nextBadge}`}
              href="/partners/earnings/badges"
            >
              <Progress value={(badgeTotals.earned / badgeTotals.total) * 100} className="mt-3" />
            </ControlStat>
            <CalloutCTA
              label="Full badge history"
              description="See earned, in-progress, and locked badges."
              buttonLabel="View badges"
              href="/partners/earnings/badges"
            />
          </div>
        </SettingsGroupCallout>

        {featuredBadges.length ? (
          <SettingsGroupCallout
            icon={<Award className="h-4 w-4" />}
            title="Featured badges"
            subtitle="Recently earned + in-progress"
            showChevron={false}
          >
            <div className={`${stackedPanelClass} space-y-2 p-4`}>
              {featuredBadges.map((badge) => (
                <BadgeQuickRow key={badge.id} badge={badge} />
              ))}
              {!hasLoadedMore && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2 w-full"
                  onClick={handleLoadMore}
                >
                  Load more badges
                </Button>
              )}
            </div>
          </SettingsGroupCallout>
        ) : null}

        <SettingsGroupCallout
          icon={<Award className="h-4 w-4" />}
          title="Certificates & credentials"
          subtitle={`Issued ${certificateSummary.issued} • In progress ${certificateSummary.inProgress}`}
          showChevron={false}
        >
          <div className={`${stackedPanelClass} space-y-3 p-4`}>
            <div className="space-y-2">
              {certificateSummary.preview.map((certificate) => (
                <CertificatePreview key={certificate.id} certificate={certificate} />
              ))}
            </div>
            <CalloutCTA
              label="Issued & downloads"
              description="Manage PDFs and shareable credential links."
              buttonLabel="View certificates"
              href="/partners/academy/certificates"
            />
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<ScrollText className="h-4 w-4" />}
          title="Recent achievements"
          subtitle="Automatic log of your wins"
          showChevron={false}
        >
          <div className={`${stackedPanelClass} space-y-2 p-3`}>
            {achievementFeed.map((item) => (
              <AchievementFeedRow key={item.id} item={item} />
            ))}
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<ListChecks className="h-4 w-4" />}
          title="Next unlocks"
          subtitle="Stay on pace for the next badge or certificate"
          showChevron={false}
        >
          <div className={`${stackedPanelClass} space-y-3 p-4`}>
            {nextUnlocks.map((unlock) => (
              <NextUnlockRow key={unlock.id} unlock={unlock} />
            ))}
          </div>
        </SettingsGroupCallout>
      </div>
      </PartnersPageContainer>
    </section>
  );
}

function ControlStat({
  label,
  value,
  helper,
  children,
  href,
}: {
  label: string;
  value: string;
  helper?: string;
  children?: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className={`${nestedCardClass} px-4 py-3 text-left transition`}>
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
      {helper ? <p className="text-xs text-white/70">{helper}</p> : null}
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
        {content}
      </Link>
    );
  }

  return content;
}

function CertificatePreview({
  certificate,
}: {
  certificate: CertificateSummary["preview"][number];
}) {
  return (
    <div className={`${nestedCardClass} flex items-center justify-between px-3 py-2 text-sm text-white/80`}>
      <div>
        <p className="font-semibold text-white">{certificate.title}</p>
        <p className="text-xs text-white/60">{certificate.status}</p>
      </div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">{certificate.issued ?? "Pending"}</p>
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
    <div className={`${nestedCardClass} flex items-center justify-between px-3 py-2 text-sm text-white/80`}>
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

function AchievementFeedRow({ item }: { item: AchievementFeedItem }) {
  return (
    <div className={`${nestedCardClass} flex items-center justify-between px-3 py-2 text-sm text-white/80`}>
      <div>
        <p className="font-semibold text-white">{item.title}</p>
        <p className="text-xs text-white/60">{item.detail}</p>
      </div>
      <div className="text-right text-xs text-white/50">
        <Badge className="bg-white/10 text-white/70">{item.tag}</Badge>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em]">{item.timestamp}</p>
      </div>
    </div>
  );
}

function NextUnlockRow({ unlock }: { unlock: NextUnlock }) {
  return (
    <div className={`${nestedCardClass} p-3`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{unlock.label}</p>
          <p className="text-xs text-white/60">{unlock.requirement}</p>
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">{unlock.reward}</span>
      </div>
      <Progress value={unlock.progress} className="mt-3" />
      <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/60">{unlock.progress}% • {unlock.eta}</p>
    </div>
  );
}

function CalloutCTA({
  label,
  description,
  buttonLabel,
  href,
}: {
  label: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className={`${stackedPanelClass} p-4 text-white/80`}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{label}</p>
      <p className="text-xs text-white/60">{description}</p>
      <Button asChild variant="secondary" className={`${secondaryActionButtonClass} mt-3 w-full text-base font-semibold`}>
        <Link href={href}>{buttonLabel}</Link>
      </Button>
    </div>
  );
}
