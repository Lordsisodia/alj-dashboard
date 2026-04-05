// @ts-nocheck
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, UserRound, Target, Globe, Linkedin, Instagram, Link2, Sparkles } from "lucide-react";
import { SettingsDetailLayout } from "@/domains/partnerships/settings/shared/components/SettingsDetailLayout";
import { HighlightCard } from "@/components/ui/card-5";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfoButton } from "@/components/ui/info-button";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileIdentityCallout } from "../components/ProfileIdentityCallout";
import { PartnershipDetailsCallout } from "../components/PartnershipDetailsCallout";
import { ProfessionalDetailsCallout } from "../components/ProfessionalDetailsCallout";
import { certificationOptions, languageOptions, timelineOptions } from "../components/profile-options";

export function ProfileSettingsView() {
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");

  // Profile identity state
  const [age, setAge] = useState("");

  // SISO Partnership details state
  const [sisoJoinMonth, setSisoJoinMonth] = useState("");
  const [sisoJoinYear, setSisoJoinYear] = useState("");

  // Professional details state
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [geographicAvailability, setGeographicAvailability] = useState("");

  // Skills & expertise state
  const [specializations, setSpecializations] = useState("");
  const [sisoCertifications, setSisoCertifications] = useState("");
  const [languages, setLanguages] = useState("");

  // Social media state
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Revenue goals state
  const [revenueGoalAmount, setRevenueGoalAmount] = useState("");
  const [revenueTimeline, setRevenueTimeline] = useState("");

  const bioCharactersLeft = useMemo(() => 200 - bio.length, [bio]);

  return (
    <SettingsDetailLayout title="" description="" wrapContent={false} backHref={null} compactHeader hideHeader srTitle="Profile Settings">
      <div className="space-y-6 pb-32 text-siso-text-primary">
        {/* Profile Header Card */}
        <div className="relative">
          <Link
            href="/partners/settings"
            className="absolute inset-y-0 left-5 z-10 inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
            aria-label="Back to settings"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <HighlightCard
            color="orange"
            className="w-full max-w-none pl-12 text-left"
            title="Profile"
            description="Shape the story partners see when they tap your card."
            icon={<UserRound className="h-5 w-5" />}
            metricValue=""
            metricLabel=""
            buttonText=""
            onButtonClick={() => {}}
            fullWidth
            hideDivider
            hideFooter
            titleClassName="uppercase tracking-[0.35em] font-semibold text-[28px] leading-[1.2]"
            descriptionClassName="text-xs"
          />
        </div>

        <ProfileIdentityCallout
          status={status}
          onStatusChange={setStatus}
          age={age}
          onAgeChange={setAge}
          bio={bio}
          onBioChange={setBio}
          bioCharactersLeft={bioCharactersLeft}
        />
        <PartnershipDetailsCallout
          sisoJoinMonth={sisoJoinMonth}
          onSisoJoinMonthChange={setSisoJoinMonth}
          sisoJoinYear={sisoJoinYear}
          onSisoJoinYearChange={setSisoJoinYear}
        />
        <ProfessionalDetailsCallout
          professionalTitle={professionalTitle}
          setProfessionalTitle={setProfessionalTitle}
          businessName={businessName}
          setBusinessName={setBusinessName}
          businessType={businessType}
          setBusinessType={setBusinessType}
          industry={industry}
          setIndustry={setIndustry}
          yearsOfExperience={yearsOfExperience}
          setYearsOfExperience={setYearsOfExperience}
          companySize={companySize}
          setCompanySize={setCompanySize}
          geographicAvailability={geographicAvailability}
          setGeographicAvailability={setGeographicAvailability}
        />
        <SkillsExpertiseDoubleCallout
          specializations={specializations}
          setSpecializations={setSpecializations}
          sisoCertifications={sisoCertifications}
          setSisoCertifications={setSisoCertifications}
          languages={languages}
          setLanguages={setLanguages}
        />
        <SocialMediaDoubleCallout
          linkedInUrl={linkedInUrl}
          setLinkedInUrl={setLinkedInUrl}
          instagramUrl={instagramUrl}
          setInstagramUrl={setInstagramUrl}
          websiteUrl={websiteUrl}
          setWebsiteUrl={setWebsiteUrl}
        />
        <RevenueGoalsDoubleCallout
          revenueGoalAmount={revenueGoalAmount}
          setRevenueGoalAmount={setRevenueGoalAmount}
          revenueTimeline={revenueTimeline}
          setRevenueTimeline={setRevenueTimeline}
        />
        <ProfilePreviewCard status={status} bio={bio} />
      </div>
    </SettingsDetailLayout>
  );
}

// Skills & Expertise Component
function SkillsExpertiseDoubleCallout({
  specializations,
  setSpecializations,
  sisoCertifications,
  setSisoCertifications,
  languages,
  setLanguages
}: {
  specializations: string;
  setSpecializations: (value: string) => void;
  sisoCertifications: string;
  setSisoCertifications: (value: string) => void;
  languages: string;
  setLanguages: (value: string) => void;
}) {
  return (
    <SettingsGroupCallout
      icon={<Target className="h-4 w-4" />}
      title="Skills & Expertise"
      subtitle="Showcase your professional capabilities."
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Specializations</h3>
            <InfoButton label="About specializations" content="A few keywords that describe your core skills (comma separated)." />
          </div>
          <Textarea
            value={specializations}
            onChange={(event) => setSpecializations(event.target.value)}
            placeholder="e.g., B2B Marketing, Sales Funnels, Growth Hacking"
            rows={3}
            className="rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">SISO Certifications</h3>
            <InfoButton label="About certifications" content="Select any SISO certifications you’ve earned. Use NA if none." />
          </div>
          <CustomDropdown
            options={certificationOptions}
            value={sisoCertifications}
            onChange={setSisoCertifications}
            searchable={true}
            maxVisible={0}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Languages Spoken</h3>
            <InfoButton label="About languages" content="List the languages you can confidently work in." />
          </div>
          <CustomDropdown
            options={languageOptions}
            value={languages}
            onChange={setLanguages}
            searchable={true}
            maxVisible={0}
          />
        </section>
      </div>
    </SettingsGroupCallout>
  );
}

// Social Media Component
function SocialMediaDoubleCallout({
  linkedInUrl,
  setLinkedInUrl,
  instagramUrl,
  setInstagramUrl,
  websiteUrl,
  setWebsiteUrl
}: {
  linkedInUrl: string;
  setLinkedInUrl: (value: string) => void;
  instagramUrl: string;
  setInstagramUrl: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
}) {
  return (
    <SettingsGroupCallout
      icon={<Globe className="h-4 w-4" />}
      title="Social Media"
      subtitle="Connect your professional profiles."
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold flex items-center gap-2">
              <Linkedin className="h-3 w-3" /> LinkedIn
            </h3>
            <InfoButton label="About LinkedIn" content="Paste the URL to your professional LinkedIn profile." />
          </div>
          <Input
            value={linkedInUrl}
            onChange={(event) => setLinkedInUrl(event.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold flex items-center gap-2">
              <Instagram className="h-3 w-3" /> Instagram
            </h3>
            <InfoButton label="About Instagram" content="Optional. Share your professional Instagram if relevant." />
          </div>
          <Input
            value={instagramUrl}
            onChange={(event) => setInstagramUrl(event.target.value)}
            placeholder="https://instagram.com/yourprofile"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold flex items-center gap-2">
              <Link2 className="h-3 w-3" /> Website
            </h3>
            <InfoButton label="About website" content="Your main professional site or portfolio." />
          </div>
          <Input
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://yourwebsite.com"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>
      </div>
    </SettingsGroupCallout>
  );
}

// Revenue Goals Component
function RevenueGoalsDoubleCallout({
  revenueGoalAmount,
  setRevenueGoalAmount,
  revenueTimeline,
  setRevenueTimeline
}: {
  revenueGoalAmount: string;
  setRevenueGoalAmount: (value: string) => void;
  revenueTimeline: string;
  setRevenueTimeline: (value: string) => void;
}) {
  return (
    <SettingsGroupCallout
      icon={<Target className="h-4 w-4" />}
      title="Revenue Goals"
      subtitle="Set your financial targets and timeline."
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Revenue Goal</h3>
            <InfoButton label="About revenue goal" content="Your target gross revenue for the chosen timeline. Helps personalize recommendations." />
          </div>
          <Input
            value={revenueGoalAmount}
            onChange={(event) => setRevenueGoalAmount(event.target.value)}
            placeholder="$10,000"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Timeline</h3>
            <InfoButton label="About timeline" content="How long you’re giving yourself to hit the goal (e.g., 3 months)." />
          </div>
          <CustomDropdown
            options={timelineOptions}
            value={revenueTimeline}
            onChange={setRevenueTimeline}
            searchable={false}
          />
        </section>
      </div>
    </SettingsGroupCallout>
  );
}

type ProfilePreviewCardProps = {
  status: string;
  bio: string;
};

function ProfilePreviewCard({ status, bio }: ProfilePreviewCardProps) {
  const model = {
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=SISOagency",
    displayName: "SISOagency",
    headline: "Marketing Consultant",
    status: status || "Dialed in",
    credits: 342,
    tier: "Performer" as "Starter" | "Active" | "Performer" | "Elite",
    milestone: "Next milestone in 12 days",
    chips: ["Technology", "Global", "5y", "SISO Expert", "EN +2"],
    bio:
      bio ||
      "We help partners ship faster with crisp GTM strategy, content systems, and hands-on enablement.",
    powerLevel: 25,
    loginStreak: "3 / 14 days",
    revenue: { amount: "$25k", timeline: "3 mo" },
    links: [
      { label: "linkedin.com", icon: Linkedin, url: "https://linkedin.com/in/sisoagency" },
      { label: "instagram.com", icon: Instagram, url: "https://instagram.com/sisoagency" },
      { label: "siso.agency", icon: Link2, url: "https://siso.agency" },
    ],
    backgroundUrl:
      "https://images.unsplash.com/photo-1549880187-0579aa1a0dbc?q=80&w=1974&auto=format&fit=crop",
  } as const;

  const [expanded, setExpanded] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);

  const tierColor: Record<typeof model.tier, string> = {
    Starter: "bg-white/10 text-white",
    Active: "bg-emerald-500/20 text-emerald-300",
    Performer: "bg-siso-orange/20 text-siso-orange",
    Elite: "bg-violet-500/20 text-violet-300",
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/10 p-3 text-siso-text-primary shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10,10,12,0.60), rgba(10,10,12,0.60)), url(${model.backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-white/20">
          <AvatarImage src={model.avatarUrl} alt="Preview avatar" loading="lazy" decoding="async" />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold uppercase tracking-[0.25em]">{model.displayName}</h2>
          {model.status ? (
            <p className="truncate text-xs text-white/70">{model.status}</p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="leading-none text-lg font-semibold text-siso-orange">{model.credits}</p>
          <p className="mt-0.5 text-[11px] text-white/70">credits</p>
          <div className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${tierColor[model.tier]}`}>
            {model.tier}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {model.milestone ? (
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Sparkles className="h-4 w-4 text-siso-orange" aria-hidden /> {model.milestone}
          </div>
        ) : null}
        {model.chips.length ? (
          <ul role="list" className="flex flex-wrap gap-2">
            {model.chips.slice(0, 3).map((chip) => (
              <li role="listitem" key={chip} className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                {chip}
              </li>
            ))}
            {model.chips.length > 3 ? (
              <li role="listitem">
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-siso-orange"
                  onClick={() => setShowAllChips(true)}
                  aria-haspopup="dialog"
                  aria-expanded={showAllChips}
                >
                  +{model.chips.length - 3}
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      <div className="mt-3 space-y-3 text-sm text-white/85">
        {model.bio ? (
          <div>
            <p className={expanded ? "" : "line-clamp-2"}>{model.bio}</p>
            <button
              type="button"
              className="mt-1 rounded-md border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-siso-orange"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-2.5 py-1.5">
            <span className="text-white/70">Power Level</span>
            <span className="font-semibold text-siso-orange">{model.powerLevel}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-2.5 py-1.5">
            <span className="text-white/70">Login streak</span>
            <span className="font-semibold text-white">{model.loginStreak}</span>
          </div>
          {model.revenue ? (
            <div className="col-span-2 flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-2.5 py-1.5">
              <span className="text-white/70">Revenue goal</span>
              <span className="font-semibold text-white">{model.revenue.amount} • {model.revenue.timeline}</span>
            </div>
          ) : null}
        </div>

        {model.links?.length ? (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {model.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-white/15 px-2.5 py-1 text-white/80 hover:text-siso-orange">
                <l.icon className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">{l.label}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {showAllChips ? (
        <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
          <button className="absolute inset-0 bg-black/50" aria-label="Close" onClick={() => setShowAllChips(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl border border-white/10 bg-siso-bg-secondary p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">All tags</p>
              <button className="text-xs text-siso-text-muted hover:text-siso-orange" onClick={() => setShowAllChips(false)}>Close</button>
            </div>
            <ul role="list" className="flex flex-wrap gap-2">
              {model.chips.map((chip) => (
                <li key={chip} role="listitem" className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
