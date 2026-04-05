import { Suspense } from "react";
import Link from "next/link";

import { HighlightCard } from "@/components/ui/card-5-static";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Handshake, Users, UserPlus, Paperclip, Medal, Flag } from "lucide-react";
import type { TeamMember } from "@/domains/partnerships/recruitment/03-sales-team/data/team/members";
import { cn } from "@/lib/utils";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const teamHighlights = [
  {
    title: "Active sales team",
    description: "Reps cleared to sell and paid overrides.",
    icon: <Handshake className="h-5 w-5" aria-hidden />,
  },
];

const livePartnerSummary = {
  metricValue: "18",
  metricLabel: "Live partners",
  description: "Cleared to sell and paid overrides.",
  buttonText: "Invite partner",
  href: "/partners/recruitment/prospects",
};

const quickHelpLinks = [
  { title: "Invite troubleshooting", description: "Checklist for compliance + wallet blockers.", href: "/partners/recruitment/prospects" },
  { title: "Academy playbook", description: "Remind reps which lessons unlock overrides.", href: "/partners/academy" },
  { title: "Wallet support", description: "Direct line to payouts + compliance review.", href: "/partners/earnings" },
];

const teamLeaderboard = [
  { name: "Avery Diaz", approvals: 6, overrides: 2, payouts: "$9.3K", approvalTime: "4.2 days" },
  { name: "Jordan Kim", approvals: 4, overrides: 1, payouts: "$5.1K", approvalTime: "5.4 days" },
  { name: "Marin Patel", approvals: 3, overrides: 1, payouts: "$4.2K", approvalTime: "3.8 days" },
];

export function RecruitmentTeamContent({ members }: { members: TeamMember[] }) {
  return (
    <>
      <section className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
        <TierProgressBackdrop className="h-full w-full" />

      <PartnersPageContainer width="wide" className="relative z-10 space-y-6 py-8">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <Link
                href="/partners/recruitment"
                aria-label="Back to recruitment dashboard"
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          <div className="grid gap-4 lg:grid-cols-1">
            {teamHighlights.map((card) => (
              <div key={card.title} className="relative">
                <HighlightCard
                  color="orange"
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  hideDivider
                  showCornerIcon={false}
                  titleClassName="uppercase tracking-[0.35em] text-white"
                  descriptionClassName="text-sm"
                  className="w-full max-w-none pl-12"
                />
                {/* Desktop ribbon flag */}
                <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
                  <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                    <Flag className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          <SettingsGroupCallout
            icon={<Handshake className="h-4 w-4" />}
            title="Live partners"
            subtitle="Roster insights + immediate invite actions"
            showChevron={false}
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <article className={cn(stackedPanelClass, "p-4")}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 siso-inner-card-strong text-siso-orange">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Live roster health</p>
                      <p className="text-xs text-white/70">Reps cleared to sell and collect overrides.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-semibold leading-none lg:text-5xl">{livePartnerSummary.metricValue}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{livePartnerSummary.metricLabel}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/70">
                  {livePartnerSummary.description} Keep the count fresh so recruiting knows when to rotate prospects.
                </p>
              </article>

              <article className={cn(stackedPanelClass, "p-4")}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 siso-inner-card-strong text-siso-orange">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Invite momentum</p>
                      <p className="text-xs text-white/70">Launch the standard invite kit in one tap.</p>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    className={cn(secondaryActionButtonClass, "w-full rounded-full border-white/25 text-white/90 lg:w-auto")}
                  >
                    <Link href={livePartnerSummary.href}>{livePartnerSummary.buttonText}</Link>
                  </Button>
                </div>
              </article>
            </div>
          </SettingsGroupCallout>

          <SettingsGroupCallout
            icon={<Medal className="h-4 w-4" />}
            title="Team leaderboard"
            subtitle="Top recruiters by approvals and overrides."
            showChevron={false}
          >
            <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/80")}>
              {teamLeaderboard.map((row, index) => (
                <div key={row.name} className={cn(nestedCardClass, "flex items-center justify-between px-4 py-3 text-white/85")}>
                  <div>
                    <p className="text-white">
                      {index + 1}. {row.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {row.approvals} approvals • {row.overrides} overrides
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/10 text-white">{row.payouts}</Badge>
                    <p className="text-[11px] text-white/60">Avg {row.approvalTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </SettingsGroupCallout>

          <SettingsGroupCallout icon={<Users className="h-4 w-4" />} title="Active sales team" subtitle="Every rep, their role, and current focus." showChevron={false}>
            <div className={cn(stackedPanelClass, "space-y-3 p-4")}>
              {members.map((member) => (
                <Link
                  key={member.id}
                  href={`/partners/recruitment/team/${member.id}`}
                  className={cn(
                    nestedCardClass,
                    "group flex flex-col gap-2 border-white/20 p-4 text-sm text-white/80 transition hover:border-white/40 lg:flex-row lg:items-center lg:justify-between",
                  )}
                >
                  <div>
                    <p className="text-lg font-semibold text-white group-hover:text-white">{member.name}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">{member.role}</p>
                  </div>
                  <div className="text-xs text-white/60">{member.activity}</div>
                  <Badge className="bg-white/10 text-white">{member.tier}</Badge>
                  <Badge variant="outline" className="border-white/25 text-white">
                    {member.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </SettingsGroupCallout>

          <SettingsGroupCallout icon={<Paperclip className="h-4 w-4" />} title="Quick help" subtitle="Shortcuts the team lead can drop into chat." showChevron={false}>
            <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/70")}>
              {quickHelpLinks.map((resource) => (
                <div key={resource.title} className={cn(nestedCardClass, "px-4 py-3")}>
                  <p className="text-white">{resource.title}</p>
                  <p className="text-xs text-white/60">{resource.description}</p>
                  <Link href={resource.href} className="text-[11px] uppercase tracking-[0.4em] text-siso-orange">
                    Open
                  </Link>
                </div>
              ))}
            </div>
          </SettingsGroupCallout>
        </PartnersPageContainer>
      </section>
    </>
  );
}
