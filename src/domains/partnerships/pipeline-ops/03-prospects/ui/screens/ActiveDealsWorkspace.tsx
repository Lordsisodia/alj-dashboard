import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import type { DealSummary } from "@/domains/partnerships/pipeline-ops/shared/domain/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, Briefcase, DollarSign, Sparkles, Target } from "lucide-react";
import { ActiveDealsBoard } from "../components/ActiveDealsBoard.client";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export interface ActiveDealsWorkspaceProps {
  initialDeals: DealSummary[];
}

export function ActiveDealsWorkspace({ initialDeals }: ActiveDealsWorkspaceProps) {
  const deals = initialDeals ?? [];
  const pipelineValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const commissionValue = Math.round(pipelineValue * 0.2);
  const attentionDeals = deals.filter((deal) => deal.health !== "on_track");

  return (
    <div className="space-y-6 px-4 pb-12 pt-8 text-white lg:px-8">
      <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Active Deals" subtitle="Filtered value, commission, and risk at a glance" showChevron={false}>
        <div className="rounded-3xl border border-white/10 bg-siso-bg-secondary/80 px-4 py-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <HeroStat label="Pipeline" value={formatCurrency(pipelineValue)} helper="Filtered total" icon={Briefcase} />
            <HeroStat label="Expected commission" value={formatCurrency(commissionValue)} helper="20% base est." icon={DollarSign} />
            <HeroStat label="At risk" value={`${attentionDeals.length}`} helper="Deals flagged" icon={Target} />
          </div>
          <p className="mt-4 text-xs text-white/60">Commission assumes 20% base; high-impact deals can reach 30% pending ops approval.</p>
        </div>
      </SettingsGroupCallout>

      <ActiveDealsBoard deals={deals} />

      {attentionDeals.length > 0 ? (
        <SettingsGroupCallout
          icon={<AlertTriangle className="h-4 w-4 text-amber-300" />}
          title="Needs attention"
          subtitle="Deals flagged as risk or stalled"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/85")}>
            {attentionDeals.map((deal) => (
              <div key={deal.id} className={cn(nestedCardClass, "p-3")}>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="font-semibold text-white">{deal.company}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-white/60">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: `var(${deal.health === "risk" ? "--siso-stage-proposal" : "--siso-stage-negotiation"})` }}
                    />
                    {formatStage(deal.stage)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  {deal.health === "risk" ? "7+ days idle" : deal.health === "stalled" ? "14+ days stalled" : "Check status"}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                  <span>{deal.owner}</span>
                  <span>{formatCurrency(deal.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </SettingsGroupCallout>
      ) : null}
    </div>
  );
}

function HeroStat({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-white/60">{helper}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatStage(stage: string) {
  return stage
    .split("_")
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : ""))
    .join(" ")
    .trim();
}
