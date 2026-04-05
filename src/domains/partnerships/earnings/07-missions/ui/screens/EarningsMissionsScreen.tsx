"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { cn } from "@/domains/shared/utils/cn";
import {
  primaryGradientButtonClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { UnlockMission } from "@/domains/partnerships/earnings/03-tier-progression/data/tierProgression";

type FilterKey = "all" | "trailblazer" | "builder" | "vanguard" | "apex" | "sovereign" | "global";

const tierTags: Record<FilterKey, string[]> = {
  all: [],
  trailblazer: ["Trailblazer"],
  builder: ["Builder"],
  vanguard: ["Vanguard"],
  apex: ["Apex"],
  sovereign: ["Sovereign"],
  global: ["Global"],
};

type EarningsMissionsScreenProps = {
  missionsInitial: UnlockMission[];
};

export function EarningsMissionsScreen({ missionsInitial }: EarningsMissionsScreenProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [missions, setMissions] = useState<UnlockMission[]>(missionsInitial);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const loadMore = async () => {
    if (hasLoadedMore) return;
    const { unlockMissions } = await import("@/domains/partnerships/earnings/03-tier-progression/data/tierProgression");
    setMissions(unlockMissions);
    setHasLoadedMore(true);
  };

  const filteredMissions = useMemo(() => {
    if (filter === "all") return missions;
    return missions.filter((m) => (m.tiers ? m.tiers.some((t) => tierTags[filter].includes(t)) : false));
  }, [filter, missions]);

  return (
    <section className="relative flex min-h-screen justify-center bg-siso-bg-primary text-siso-text-primary">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,#20140a,#050505)]"
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 text-siso-text-primary">
        <div className={cn(stackedPanelClass, "flex flex-wrap items-center justify-between gap-3 p-5 text-white/80")}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Unlock missions</p>
            <p className="text-xl font-semibold text-white">Do these to level up faster</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em]">
            {(["all", "trailblazer", "builder", "vanguard", "apex", "sovereign", "global"] as FilterKey[]).map((key) => (
              <Button
                key={key}
                size="sm"
                type="button"
                className={cn(
                  secondaryActionButtonClass,
                  "rounded-full px-4 py-2 text-xs",
                  filter === key ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
                )}
                onClick={() => setFilter(key)}
              >
                {key === "all" ? "All missions" : key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredMissions.map((mission) => (
            <SettingsGroupCallout
              key={mission.id}
              icon={<Target className="h-4 w-4" />}
              title={mission.title}
              subtitle={mission.description}
              showChevron={false}
            >
              <div className={cn(stackedPanelClass, "space-y-3 p-4 text-white/80")}>
                <Badge className="bg-siso-orange/20 text-siso-orange">{mission.reward}</Badge>
                <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
                  {mission.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                {mission.tiers ? (
                  <div className="flex flex-wrap gap-2 text-[11px] text-siso-text-muted">
                    {mission.tiers.map((t) => (
                      <span key={t} className="rounded-full border border-white/15 px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className={cn(primaryGradientButtonClass, "rounded-full px-4 text-[11px] uppercase tracking-[0.3em]")}
                  >
                    Start mission
                  </Button>
                  <Button
                    size="sm"
                    className={cn(secondaryActionButtonClass, "rounded-full px-4 text-[11px] uppercase tracking-[0.3em]")}
                  >
                    View rules
                  </Button>
                </div>
              </div>
            </SettingsGroupCallout>
          ))}
          {!hasLoadedMore && (
            <div className="flex justify-center">
              <Button
                size="sm"
                className={cn(primaryGradientButtonClass, "rounded-full px-5 text-[11px] uppercase tracking-[0.3em]")}
                onClick={loadMore}
              >
                Load more missions
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
