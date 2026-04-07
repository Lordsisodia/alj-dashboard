"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { Button } from "@/components/ui/button";
import { type PartnerProfile } from "@/domains/partnerships/community/shared/data/partnerDirectory";
import { Badge } from "@/components/ui/badge";
import { Sparkles, UsersRound, Filter, Globe, Clock3, Flag } from "lucide-react";
import { cn } from "@/domains/shared/utils/cn";
import { PartnersPageShell } from "@/domains/partnerships/community/shared/components/CommunityPageShell";

const filterOptions = [
  { id: "all", label: "All partners" },
  { id: "active", label: "Active now" },
  { id: "mentors", label: "Mentors" },
  { id: "hiring", label: "Hiring" },
];

export function AllPartnersScreen({ partners, withShell = true }: { partners: PartnerProfile[]; withShell?: boolean }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = search
        ? [
          partner.name,
          partner.focus,
          partner.location,
          partner.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase())
        : true;

      const matchesFilter = (() => {
        switch (filter) {
          case "active":
            return partner.availability === "active";
          case "mentors":
            return Boolean(partner.openToMentor);
          case "hiring":
            return Boolean(partner.hiring);
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });
  }, [filter, partners, search]);

  const mentors = partners.filter((partner) => partner.openToMentor).length;
  const hiring = partners.filter((partner) => partner.hiring).length;

  const content = (
    <section className="relative flex min-h-screen flex-col bg-siso-bg-primary text-siso-text-primary">
      <TierProgressBackdrop />

      <div className="space-y-6">
        <div className="relative z-10 px-4 pt-8">
          <HeroPanel />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)]">

        <SettingsGroupCallout
          icon={<Filter className="h-4 w-4" />}
          title="Search the roster"
          subtitle="Find collaborators by tier, timezone, or focus"
          showChevron={false}
        >
          <div className="space-y-3 rounded-[22px] border border-white/10 siso-inner-card p-4">
            <label className="relative block">
              <span className="sr-only">Search partners</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try 'commerce mentor' or 'LATAM'"
                className="w-full rounded-2xl border border-white/15 bg-siso-bg-tertiary px-4 py-2 text-sm text-white placeholder:text-siso-text-muted focus:border-siso-orange focus:outline-none focus:ring-2 focus:ring-siso-orange/25"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-siso-text-muted">
                <Filter className="h-4 w-4" />
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] transition",
                    filter === option.id
                      ? "border-siso-orange bg-siso-orange/20 text-white"
                      : "border-white/20 text-siso-text-muted hover:border-white/40",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<UsersRound className="h-4 w-4" />}
          title="All partners"
          subtitle={`${filteredPartners.length} profiles • ${hiring} hiring • ${mentors} open to mentor`}
          showChevron={false}
        >
          <div className="grid gap-4">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
            {filteredPartners.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 siso-inner-card px-4 py-10 text-center text-sm text-siso-text-muted">
                No partners match that filter yet.
              </div>
            ) : null}
          </div>
        </SettingsGroupCallout>
      </div>
      </div>
    </section>
  );

  if (!withShell) {
    return content;
  }

  return (
    <PartnersPageShell initialState={{ activeDrawerSection: "community" }}>
      {content}
    </PartnersPageShell>
  );
}

function HeroPanel() {
  return (
    <div className="relative">
      <HighlightCard
        color="orange"
        className="w-full max-w-none pr-16 pl-12 text-left"
        title="Partner directory"
        description="Browse every operator in the program, see their focus areas, and jump into a DM."
        hideDivider
        hideFooter
        metricValue=""
        metricLabel=""
        buttonText=""
        onButtonClick={() => { }}
        icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
        titleClassName="uppercase tracking-[0.35em] font-semibold text-[28px] leading-[1.2]"
        descriptionClassName="text-xs"
        showCornerIcon={false}
        fullWidth
      />
      <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
        <div className="absolute inset-0 flex items-center justify-center text-orange-500">
          <Flag className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: PartnerProfile }) {
  return (
    <div className="rounded-[24px] border border-white/10 siso-inner-card p-4 shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition hover:border-white/20">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold text-white">
          {partner.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-white">{partner.name}</p>
            {partner.openToMentor ? (
              <Badge className="rounded-full border border-emerald-400/40 bg-emerald-500/10 text-[10px] uppercase tracking-[0.3em] text-emerald-100">
                Mentor
              </Badge>
            ) : null}
            {partner.hiring ? (
              <Badge className="rounded-full border border-siso-orange/50 bg-siso-orange/15 text-[10px] uppercase tracking-[0.3em] text-siso-orange">
                Hiring
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-siso-text-muted">{partner.focus}</p>
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-white/90">{partner.headline}</p>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatCard label="Wins" value={`${partner.wins}`} />
        <StatCard label="Clients" value={`${partner.clients}`} />
        <StatCard label="Revenue" value={partner.totalRevenue} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/75">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-siso-bg-tertiary px-3 py-1">
          <Globe className="h-3.5 w-3.5 text-white/60" />
          {partner.location}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-siso-bg-tertiary px-3 py-1">
          <Clock3 className="h-3.5 w-3.5 text-white/60" />
          {partner.timezone}
        </span>
      </div>

      <div className="mt-4 flex w-full items-center gap-2">
        <Button
          className="h-11 flex-1 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA726] text-[11px] font-semibold uppercase tracking-[0.3em] text-siso-bg-primary shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:from-[#ff6a33] hover:to-[#ffb347]"
          variant="default"
        >
          Message
        </Button>
        <Button
          variant="ghost"
          className="h-11 flex-1 rounded-full border border-white/20 px-5 text-white/85 hover:text-white"
          asChild
        >
          <Link href={`/partners/community/profile/${partner.id}`}>View profile</Link>
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2 text-left">
      <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
