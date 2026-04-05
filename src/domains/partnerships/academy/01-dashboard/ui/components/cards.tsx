// @ts-nocheck
import { ArrowRight, Flag } from "lucide-react";
import Link from "next/link";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import type { DashboardCard } from "../../domain/types";
import { cn } from "@/lib/utils";
import { dashboardCards, dashboardHero } from "../../data/dashboard";
import { ACADEMY_ROUTES } from "../../constants/routes";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export const academyDashboardCards = dashboardCards;

export function AcademyDashboardHero() {
  return (
    <div className="relative">
      <HighlightCard
        color="orange"
        title={dashboardHero.title}
        description={dashboardHero.description}
        metricValue=""
        metricLabel=""
        icon={dashboardHero.icon}
        hideDivider
        hideFooter
        showCornerIcon={false}
        titleClassName="uppercase tracking-[0.35em] text-white"
        descriptionClassName="text-sm"
        fullWidth
        className="w-full max-w-none"
      />

      {/* Desktop ribbon flag */}
      <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
        <div className="absolute inset-0 flex items-center justify-center text-orange-500">
          <Flag className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

const clampPercent = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

export function AcademyDashboardCard(card: DashboardCard) {
  return (
    <SettingsGroupCallout icon={card.icon} title={card.title} subtitle={card.description} showChevron={false}>
      <div className={cn(stackedPanelClass, "flex flex-col gap-3 p-4 text-white/85")}>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full border border-white/15 siso-inner-card-strong px-3 py-1 text-[11px] text-white/80">
            {card.stat}
          </span>
        </div>
        {renderWidget(card)}
      </div>
      <AcademyCalloutButton href={card.href} label={card.ctaLabel ?? `Open ${card.title.toLowerCase()}`} />
    </SettingsGroupCallout>
  );
}

function AcademyCalloutButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      asChild
      size="sm"
      variant="secondary"
      className={cn(
        secondaryActionButtonClass,
        "mt-2 w-full rounded-full border-white/25 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 hover:text-white",
      )}
    >
      <Link href={href} className="inline-flex items-center justify-center gap-2">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function renderWidget(card: DashboardCard) {
  if (!card.widget) return null;
  switch (card.widget.type) {
    case "progress":
      return (
        <div className={cn(nestedCardClass, "space-y-2 p-3 text-sm text-siso-text-muted")}>
          <div className="flex items-center justify-between text-xs">
            <span>Current tier</span>
            <span className="text-white font-semibold">{card.widget.tier}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500"
              style={{ width: `${clampPercent(card.widget.percent)}%` }}
            />
          </div>
          <p className="text-[11px] text-siso-text-muted">
            {card.widget.ptsToNext} pts to {card.widget.nextTier} ({card.widget.percent}%)
          </p>
        </div>
      );
    case "courses":
      return (
        <div className={cn(nestedCardClass, "space-y-2 p-3 text-sm text-siso-text-muted")}>
          {(
            [
              { label: "Available", value: card.widget.available },
              { label: "In progress", value: card.widget.inProgress },
              { label: "Completed", value: card.widget.completed },
            ] as const
          ).map((row) => (
            <div key={row.label} className="flex items-center justify-between text-xs">
              <span>{row.label}</span>
              <span className="text-white font-semibold">{row.value}</span>
            </div>
          ))}
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500"
              style={{
                width: `${clampPercent(
                  Math.round((card.widget.completed / Math.max(card.widget.available, 1)) * 100),
                )}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-siso-text-muted">
            {card.widget.completed} of {card.widget.available} complete
          </p>
        </div>
      );
    case "spotlight":
      return (
        <div className={cn(nestedCardClass, "p-3 text-sm text-siso-text-muted")}>
          <div className="flex items-center justify-between text-xs">
            <span>Next lesson</span>
            <span className="text-white font-semibold">{card.widget.lesson}</span>
          </div>
          <p className="text-xs text-siso-text-muted">{card.widget.duration}</p>
        </div>
      );
    default:
      return null;
  }
}

// Exported for tests
export const __private = { clampPercent };
