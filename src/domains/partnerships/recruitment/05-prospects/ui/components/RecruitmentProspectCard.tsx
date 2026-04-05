"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCcw, ShieldCheck } from "lucide-react";
import type { RecruitmentProspect } from "../screens/types";
import { cn } from "@/lib/utils";
import {
  nestedCardClass,
  primaryGradientButtonClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const complianceCopy: Record<RecruitmentProspect["complianceStatus"], { label: string; tone: string }> = {
  pending: { label: "Compliance pending", tone: "text-amber-200 bg-amber-400/10 border-amber-200/40" },
  cleared: { label: "Compliance cleared", tone: "text-emerald-200 bg-emerald-400/10 border-emerald-300/40" },
  blocked: { label: "Needs attention", tone: "text-red-200 bg-red-500/10 border-red-300/40" },
};

const stageCopy: Record<RecruitmentProspect["segment"], { label: string; token: string }> = {
  potential: { label: "Potential", token: "--siso-stage-prospect" },
  onboarding: { label: "Onboarding", token: "--siso-stage-qualified" },
  active: { label: "Active", token: "--siso-stage-negotiation" },
  dormant: { label: "Dormant", token: "--siso-stage-lost" },
};

const revenueFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function RecruitmentProspectCard({ prospect }: { prospect: RecruitmentProspect }) {
  const complianceTone = complianceCopy[prospect.complianceStatus];
  const stageTone = stageCopy[prospect.segment];
  const progressPct = Math.round(prospect.progress * 100);

  return (
    <article className={cn(stackedPanelClass, "flex flex-col gap-4 p-6 text-white")}>
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Recruit</p>
        <h3 className="text-2xl font-semibold">{prospect.candidateName}</h3>
        <p className="text-sm text-white/70">{prospect.email}</p>
      </header>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge className="rounded-2xl bg-white/10 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.3em]">
          {prospect.tier}
        </Badge>
        <Badge
          className="flex items-center gap-1.5 rounded-2xl border border-white/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white"
          style={{ borderColor: `color-mix(in srgb, var(${stageTone.token}) 60%, rgba(255,255,255,0.2))`, color: `var(${stageTone.token})` }}
        >
          {stageTone.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
        <div className={cn(nestedCardClass, "border-white/20 px-4 py-3")}>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Deals closed</p>
          <p className="text-2xl font-semibold text-white">{prospect.dealsClosed}</p>
        </div>
        <div className={cn(nestedCardClass, "border-white/20 px-4 py-3")}>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Revenue</p>
          <p className="text-2xl font-semibold text-white">{revenueFormatter.format(prospect.revenueToDate)}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Activation progress</p>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={progressPct} className="h-2 flex-1 bg-white/10" />
          <span className="text-sm font-semibold text-white">{progressPct}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge className={`flex items-center gap-2 rounded-2xl border px-3 py-1 ${complianceTone.tone}`}>
          <ShieldCheck className="h-3 w-3" />
          {complianceTone.label}
        </Badge>
      </div>

      <div className="mt-auto flex items-center justify-end">
        <Button
          asChild
          className={cn(
            primaryGradientButtonClass,
            "w-full justify-center rounded-full text-[11px] font-semibold uppercase tracking-[0.3em]"
          )}
        >
          <Link href={`/partners/recruitment/prospects/${prospect.id}`}>Open profile</Link>
        </Button>
      </div>
    </article>
  );
}
