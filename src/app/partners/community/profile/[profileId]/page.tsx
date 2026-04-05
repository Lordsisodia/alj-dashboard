import type { Metadata } from "next";
import path from "node:path";
import { promises as fs } from "node:fs";
import { notFound } from "next/navigation";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Waves } from "@/components/ui/wave-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, UsersRound, MapPin, Clock3, Mail } from "lucide-react";
import { cn } from "@/domains/shared/utils/cn";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { PartnerProfile } from "@/domains/partnerships/community/shared/data/partnerDirectory";
import { getPartnerById } from "@/domains/partnerships/community/shared/application/community-service";

export const dynamic = 'force-dynamic';

type PartnerProfilePageParams = {
  profileId: string;
};

const PARTNER_DIRECTORY_DISK_PATH = path.join(process.cwd(), "public", "data", "community", "partner-directory.json");

async function readPartnersFromDisk(): Promise<PartnerProfile[]> {
  const file = await fs.readFile(PARTNER_DIRECTORY_DISK_PATH, "utf-8");
  return JSON.parse(file) as PartnerProfile[];
}

export async function generateStaticParams() {
  try {
      const partners = await readPartnersFromDisk();
      return partners.map((profile) => ({ profileId: profile.id }));
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Partner profile",
  description: "Explore community partner profiles.",
};

export default async function PartnerProfilePage(props: any) {
  const profileId = props?.params?.profileId;
  const profile = await getPartnerById(profileId);
  if (!profile) {
    notFound();
  }

  return (
    <section className="relative flex min-h-screen flex-col bg-siso-bg-primary text-siso-text-primary">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ filter: "blur(6px)", opacity: 0.9 }}>
        <Waves className="h-full w-full" strokeColor="#f8a75c" backgroundColor="#0b0b0f" pointerSize={0.35} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8">
        <ProfileHero profile={profile} />

        <SettingsGroupCallout icon={<UsersRound className="h-4 w-4" />} title="Snapshot" subtitle="Key signals & momentum" showChevron={false}>
          <StatsGrid profile={profile} />
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Focus & specialties" subtitle="Where this partner drives the most lift" showChevron={false}>
          <FocusAreas profile={profile} />
        </SettingsGroupCallout>

        {profile.recentWins?.length ? (
          <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Recent wins" subtitle="Proof points from the last quarter" showChevron={false}>
            <WinsList items={profile.recentWins} />
          </SettingsGroupCallout>
        ) : null}

        <SettingsGroupCallout icon={<Clock3 className="h-4 w-4" />} title="Availability & contact" subtitle="Best way to collaborate" showChevron={false}>
          <Availability profile={profile} />
        </SettingsGroupCallout>
      </div>
    </section>
  );
}

function ProfileHero({ profile }: { profile: PartnerProfile }) {
  return (
    <div className={cn(stackedPanelClass, "rounded-[28px] border border-white/15 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur")}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-2xl font-semibold text-white">
          {profile.avatarInitials}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{profile.name}</h1>
            <Badge className="bg-white/15 text-white/80">{profile.tier} tier</Badge>
            {profile.openToMentor ? <Badge className="bg-emerald-500/20 text-emerald-200">Mentor</Badge> : null}
            {profile.hiring ? <Badge className="bg-siso-orange/20 text-siso-orange">Hiring</Badge> : null}
          </div>
          <p className="text-sm text-white/70">{profile.headline}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/60">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {profile.timezone}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button className="rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA726] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-siso-bg-primary shadow-[0_12px_28px_rgba(0,0,0,0.4)] hover:from-[#ff6a33] hover:to-[#ffb347]" variant="default">
          Message
        </Button>
        <Button className="rounded-full border border-white/25 px-6 text-white/80" variant="outline">
          Invite to brief
        </Button>
      </div>
    </div>
  );
}

function StatsGrid({ profile }: { profile: PartnerProfile }) {
  const cards = [
    { label: "Wins", value: profile.wins.toString() },
    { label: "Clients", value: profile.clients.toString() },
    { label: "Response", value: profile.responseTime },
    { label: "Availability", value: profile.availability },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.label} className={cn(nestedCardClass, "px-4 py-3 text-sm border-white/15") }>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">{card.label}</p>
          <p className="text-xl font-semibold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function FocusAreas({ profile }: { profile: PartnerProfile }) {
  return (
    <div className={cn(nestedCardClass, "space-y-4 border-white/15 p-4 text-white") }>
      {profile.bio ? <p className="text-sm text-white/80">{profile.bio}</p> : null}
      <div className="grid gap-2 text-xs text-white/75 sm:grid-cols-2">
        {(profile.focusAreas ?? [profile.focus]).map((area) => (
          <div key={area} className="rounded-2xl border border-white/15 bg-siso-bg-tertiary px-3 py-2 uppercase tracking-[0.2em]">
            {area}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/20 bg-siso-bg-tertiary px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/80">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function WinsList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item} className={cn(nestedCardClass, "border-white/15 px-4 py-3 text-sm text-white/80") }>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Win {index + 1}</p>
          <p className="text-white">{item}</p>
        </div>
      ))}
    </div>
  );
}

function Availability({ profile }: { profile: PartnerProfile }) {
  return (
    <div className={cn(nestedCardClass, "border-white/15 p-4 text-sm text-white/80") }>
      <p>{profile.availabilityNote ?? "Open to new collaborations."}</p>
      {profile.contactMethods?.length ? (
        <div className="space-y-2">
          {profile.contactMethods.map((method) => (
            <div key={`${profile.id}-${method.label}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-siso-bg-tertiary px-3 py-2">
              <Mail className="h-4 w-4 text-white/60" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">{method.label}</span>
              <span className="font-semibold text-white">{method.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/60">Contact details coming soon.</p>
      )}
    </div>
  );
}
