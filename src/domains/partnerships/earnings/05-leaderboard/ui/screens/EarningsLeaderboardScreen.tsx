import Link from "next/link";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Sparkles, Flag } from "lucide-react";
import { cn } from "@/domains/shared/utils/cn";
import { EarningsHeroBackLink } from "@/domains/partnerships/earnings/shared/ui/components/EarningsHeroBackLink";
import {
  nestedCardClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { LeaderboardEntry } from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";

const leaderboardHighlights = [
  { label: "Avg boost", value: "+14%" },
  { label: "Win streak leader", value: "9 days" },
  { label: "New entries", value: "3" },
];

type EarningsLeaderboardScreenProps = {
  leaders: LeaderboardEntry[];
};

export function EarningsLeaderboardScreen({ leaders }: EarningsLeaderboardScreenProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop className="h-full w-full" />
      <PartnersPageContainer width="wide" className="relative z-10 space-y-6 py-8">
        <div className="relative">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <EarningsHeroBackLink />
            </div>
            <HighlightCard
              color="orange"
              className="w-full max-w-none pr-16 pl-12 text-left"
              title="Leaderboard"
              description="See who’s leading payouts, points, and boosters this season."
              hideDivider
              hideFooter
              titleClassName="uppercase tracking-[0.32em] font-semibold text-[24px] leading-[1.1]"
              descriptionClassName="text-xs"
              icon={<Trophy className="h-5 w-5 text-siso-orange" />}
              metricValue=""
              metricLabel=""
              buttonText=""
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

        <div className="relative flex w-full flex-col gap-6 pb-[calc(env(safe-area-inset-bottom,0px)+96px)]">
        <SettingsGroupCallout
          icon={<Medal className="h-4 w-4" />}
          title="Top partners"
          subtitle="Refreshed hourly"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-4 p-4 text-sm text-white/80")}>
            <div className={cn(nestedCardClass, "flex flex-col gap-3 p-3")}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Overall standings</p>
                  <p className="text-[11px] text-white/75">Rolling 30-day payouts with booster impact</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                  <Badge
                    variant="outline"
                    className="border-white/20 px-3 py-1 text-[10px] tracking-[0.2em] text-white siso-inner-card-strong"
                  >
                    Overall
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/15 px-3 py-1 text-[10px] tracking-[0.2em] text-white/80 siso-inner-card"
                  >
                    30d window
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {leaderboardHighlights.map((item) => (
                  <div key={item.label} className={cn(nestedCardClass, "flex items-center gap-2 px-3 py-2 text-xs text-white/80")}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-siso-orange" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/55">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
            {leaders.map((entry) => (
              <LeaderboardRow key={entry.rank} entry={entry} highlight={entry.name.toLowerCase() === "you"} />
            ))}
           </div>
         </div>
        </SettingsGroupCallout>
        </div>
      </PartnersPageContainer>
    </section>
  );
}

function LeaderboardRow({ entry, highlight }: { entry: LeaderboardEntry; highlight?: boolean }) {
  const medal = getMedal(entry.rank);
  const insights = entry.insights ?? [];
  const streakInsight = insights.find((insight) => insight.label.toLowerCase() === "streak");
  const winsInsight = insights.find((insight) => insight.label.toLowerCase() === "wins");
  const normalizedName = entry.name.toLowerCase();
  const slugFromName = normalizedName.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const targetProfileId = entry.profileId ?? slugFromName;
  const profileHref = normalizedName === "you"
    ? "/partners/(mobile)/profile"
    : `/partners/community/profile/${targetProfileId || "all"}`;
  return (
    <div
      className={cn(
        nestedCardClass,
        "space-y-2 px-4 py-3 text-sm text-white/80",
        highlight && "border-siso-orange/60 text-white",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {medal ? (
            <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-black", medal.className)}>
              {medal.label}
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">{entry.rank}</span>
          )}
          <div>
            <p className="font-semibold text-white">{entry.name}</p>
            <p className="text-xs text-white/70">{entry.metricLabel}</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 text-white">
          <span className="text-lg font-semibold leading-none">{entry.metricValue}</span>
          <span className="text-xs text-emerald-300">{entry.trend}</span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {streakInsight ? <InlineInsight label={streakInsight.label} value={streakInsight.value} highlight={highlight} /> : null}
        {winsInsight ? <InlineInsight label={winsInsight.label} value={winsInsight.value} highlight={highlight} /> : null}
      </div>
      <Link
        href={profileHref}
        className={cn(
          "flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors",
          "hover:text-white",
        )}
      >
        <span className="h-px w-8 flex-1 bg-white/20" aria-hidden />
        View profile
        <span className="h-px w-8 flex-1 bg-white/20" aria-hidden />
      </Link>
    </div>
  );
}

function InlineInsight({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between rounded-xl border border-white/10 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.18em]",
        "siso-inner-card-strong text-white/70",
        highlight && "border-white/40 bg-white/10 text-white",
      )}
    >
      <span className="text-white/55">{label}</span>
      <span className="font-semibold tracking-[0.04em] text-white">{value}</span>
    </div>
  );
}

function getMedal(rank: number) {
  switch (rank) {
    case 1:
      return { label: "1", className: "bg-gradient-to-br from-yellow-300 to-amber-400" };
    case 2:
      return { label: "2", className: "bg-gradient-to-br from-gray-200 to-gray-400" };
    case 3:
      return { label: "3", className: "bg-gradient-to-br from-amber-800 to-orange-600" };
    default:
      return null;
  }
}
