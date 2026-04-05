// @ts-nocheck
"use client";

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronRight,
  Lock,
  Target,
  PhoneCall,
  MessageCircle,
  Sparkles,
  GaugeCircle,
  Flag,
  HelpCircle,
  Users,
  LineChart,
  PlayCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { CustomDropdown } from '@/domains/partnerships/settings/01-general/ui/components/CustomDropdown';
import { useOnboardingJourney } from '@/domains/partnerships/funnel/onboarding/application/useOnboardingJourney';
import type { OnboardingStage, OnboardingStageIcon, OnboardingStageId } from '@/domains/partnerships/funnel/onboarding/domain/journey';
import { TierProgressBackdrop } from '@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop';
import { MobileStepHeader } from './components/MobileStepHeader';
import { GlowDivider } from '@/domains/shared/ui/components/GlowDivider';

// simple slide-up animation for bottom sheet
const sheetAnimation = `
@keyframes slide-up {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

const stageIconMap: Record<OnboardingStageIcon, LucideIcon> = {
  'message-circle': MessageCircle,
  users: Users,
  'line-chart': LineChart,
  'gauge-circle': GaugeCircle,
  'play-circle': PlayCircle
};

const roleOptions = ['Sales Closer', 'Agency Owner', 'Freelancer', 'Content Creator', 'Community Builder', 'Other'];
const experienceOptions = [
  "I've closed high-ticket deals",
  'New but hungry',
  'Marketing operator',
  'Systems & ops support',
  'Still figuring it out',
  'Other'
];
const referralOptions = ['Discord', 'YouTube', 'Existing partner', 'Paid ad', 'Other'];
type WizardStage = OnboardingStage & { iconComponent: LucideIcon };
type WizardKey = OnboardingStageId;

interface OnboardingData {
  fullName: string;
  preferredName: string;
  whatsapp: string;
  email: string;
  country: string;
  currentRole: string;
  customRole: string;
  experienceLevel: string;
  experienceNotes: string;
  referralSource: string;
  referralSourceNote: string;
  monthlyRevenueGoal: number;
  avgProjectValue: number;
  maxClientsPerMonth: number;
  hasWatchedVsl: boolean;
  clientsPerMonth: number;
}

const defaultData: OnboardingData = {
  fullName: '',
  preferredName: '',
  whatsapp: '',
  email: '',
  country: 'United States',
  currentRole: 'Sales Closer',
  customRole: '',
  experienceLevel: 'New but hungry',
  experienceNotes: '',
  referralSource: 'Discord',
  referralSourceNote: '',
  monthlyRevenueGoal: 5000,
  avgProjectValue: 2500,
  maxClientsPerMonth: 8,
  hasWatchedVsl: false,
  clientsPerMonth: 2
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const Chip = ({
  label,
  selected,
  onClick
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition',
      selected ? 'bg-white text-black border-white' : 'border-white/10 text-white/70 hover:border-white/40'
    )}
  >
    {label}
  </button>
);

export function PartnerOnboardingScreen() {
  const router = useRouter();
  const params = useParams();
  const [showQuestionsStep, setShowQuestionsStep] = useState(false);
  const stepSlugRaw = Array.isArray(params?.step) ? params?.step[0] : params?.step;
  const stepNumber = Number(stepSlugRaw);
  const hasStepParam = Number.isInteger(stepNumber);
  // Map path /partners/onboarding/1 -> step index 0
  const currentStep = hasStepParam ? Math.max(0, stepNumber - 1) : null;
  const [data, setData] = useState<OnboardingData>(defaultData);

  const { stages, totalSteps, completionPercentage, snapshot } = useOnboardingJourney(currentStep ?? 0);
  const wizardSteps = useMemo<WizardStage[]>(
    () =>
      stages.map((stage) => ({
        ...stage,
        iconComponent: stageIconMap[stage.icon]
      })),
    [stages]
  );
  const snapshotStage = snapshot ? wizardSteps.find((stage) => stage.id === snapshot.currentStage) : undefined;
  const lastCompletedStage = snapshot?.lastCompleted ? wizardSteps.find((stage) => stage.id === snapshot.lastCompleted) : undefined;

  // Hide the floating nav burger on onboarding
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const prev = root.dataset.hideFloatingNavButton;
    root.dataset.hideFloatingNavButton = 'true';
    return () => {
      if (prev !== undefined) {
        root.dataset.hideFloatingNavButton = prev;
      } else {
        delete root.dataset.hideFloatingNavButton;
      }
    };
  }, []);

  const revenuePlan = useMemo(() => {
    const monthlyRevenue = Math.max(0, (data.clientsPerMonth || 0) * Math.max(0, data.avgProjectValue || 0));
    const partnerShare = Math.round(monthlyRevenue * 0.3);
    return {
      monthlyRevenue,
      partnerShare
    };
  }, [data.clientsPerMonth, data.avgProjectValue]);

  const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const goToStep = (index: number) => {
    const next = Math.min(Math.max(index, 0), totalSteps - 1);
    const slug = next + 1; // path is 1-based
    const suffix = `/${slug}`;
    router.replace(`/partners/onboarding${suffix}`);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep !== null && currentStep >= totalSteps - 1) {
      router.push('/partners');
      return;
    }
    goToStep((currentStep ?? 0) + 1);
  };
  const handleBack = () => goToStep(currentStep - 1);

  const renderIdentityStep = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-white/70">Full name</label>
          <Input
            placeholder="Anthony Partner"
            value={data.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="bg-siso-bg-tertiary border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-white/70">Preferred name</label>
          <Input
            placeholder="Ant"
            value={data.preferredName}
            onChange={(e) => updateField('preferredName', e.target.value)}
            className="bg-siso-bg-tertiary border-white/10 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/70">WhatsApp number</label>
        <Input
          placeholder="+1 555 222 1000"
          value={data.whatsapp}
          onChange={(e) => updateField('whatsapp', e.target.value)}
          className="bg-siso-bg-tertiary border-white/10 text-white"
        />
        <p className="text-xs text-white/60">No OTP yet — just collect digits so we can ping you fast.</p>
      </div>
    </div>
  );

  const renderSnapshotStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/70">Current role</label>
        <CustomDropdown
          options={roleOptions.map((r) => ({ value: r, label: r }))}
          value={data.currentRole}
          onChange={(value) => updateField('currentRole', value)}
          placeholder="Select your current role"
          searchable
          searchPlaceholder="Search or type custom"
          className="text-white"
        />
        {data.currentRole === 'Other' && (
          <Input
            placeholder="Give it a name"
            className="mt-2 bg-siso-bg-tertiary border-white/10 text-white"
            value={data.customRole}
            onChange={(e) => updateField('customRole', e.target.value)}
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/70">Experience level</label>
        <CustomDropdown
          options={experienceOptions.map((e) => ({ value: e, label: e }))}
          value={data.experienceLevel}
          onChange={(value) => updateField('experienceLevel', value)}
          placeholder="Select your experience level"
          searchable
          searchPlaceholder="Search or type custom"
          className="text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-white/70">Referral source</label>
        <CustomDropdown
          options={referralOptions.map((r) => ({ value: r, label: r }))}
          value={data.referralSource}
          onChange={(value) => updateField('referralSource', value)}
          placeholder="Where did you hear about us?"
          searchable
          searchPlaceholder="Search or type custom"
          className="text-white"
        />
        {(data.referralSource === 'Existing partner' || data.referralSource === 'Other') && (
          <Input
            placeholder="Who sent you? (optional)"
            className="mt-2 bg-siso-bg-tertiary border-white/10 text-white"
            value={data.referralSourceNote}
            onChange={(e) => updateField('referralSourceNote', e.target.value)}
          />
        )}
      </div>
    </div>
  );

  const renderRevenueStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Revenue model</p>
        <p className="text-xs text-white/60">Simple math</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Clients per month</p>
            <p className="text-xl font-semibold text-white">{data.clientsPerMonth} client{data.clientsPerMonth === 1 ? '' : 's'}</p>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">Volume</span>
        </div>
        <Slider
          className="mt-1 w-full accent-[#FFA726]"
          min={1}
          max={20}
          step={1}
          value={[data.clientsPerMonth]}
          onValueChange={(value) => updateField('clientsPerMonth', value[0])}
        />
        <div className="flex justify-between text-[11px] text-white/50">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Avg offer size</p>
            <p className="text-xl font-semibold text-white">{currency.format(data.avgProjectValue)}</p>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">Offer</span>
        </div>
        <Slider
          className="mt-1 w-full accent-[#FFA726]"
          min={500}
          max={10000}
          step={250}
          value={[data.avgProjectValue]}
          onValueChange={(value) => updateField('avgProjectValue', value[0])}
        />
        <div className="flex justify-between text-[11px] text-white/50">
          <span>$500</span>
          <span>$10k</span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 text-sm text-white">
          <Target className="h-4 w-4 text-[#FFA726]" />
          Est. revenue {currency.format(revenuePlan.monthlyRevenue)} / mo
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-white/80">Your share (30%)</span>
          <span className="text-white font-semibold">{currency.format(revenuePlan.partnerShare)}</span>
        </div>
      </div>
    </div>
  );

  const renderVslStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-[26px] border border-white/10 overflow-hidden bg-black">
        <div className="bg-black h-48 sm:aspect-video sm:h-auto">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
            title="Partner onboarding VSL"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div className="rounded-[26px] border border-white/10 bg-siso-bg-tertiary p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Recap</p>
          <p className="text-lg font-semibold text-white">Here’s what happens next</p>
        </div>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• The “Start Here” course unlocks once you hit finish.</li>
          <li>• Dashboard features progressively unlock as you work through the intro course.</li>
        </ul>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={data.hasWatchedVsl}
            onChange={(e) => updateField('hasWatchedVsl', e.target.checked)}
            className="h-4 w-4 rounded border-white/30 bg-transparent"
          />
          I've watched the intro video
        </label>
      </div>
    </div>
  );

  const renderStepContent = (key: WizardKey) => {
    switch (key) {
      case 'identity':
        return renderIdentityStep();
      case 'snapshot':
        return renderSnapshotStep();
      case 'revenue':
        return renderRevenueStep();
      case 'vsl':
        return renderVslStep();
      default:
        return null;
    }
  };

  const activeStep = currentStep !== null ? wizardSteps[currentStep] : undefined;
  const StepIcon = activeStep?.iconComponent;

  // If no step is specified, show a simple start screen
  if (!hasStepParam) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <TierProgressBackdrop position="fixed" />
        <style>{sheetAnimation}</style>
        <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-col px-3 sm:px-4 py-6 min-h-screen justify-center">
          <StartHero onStart={() => goToStep(0)} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-x-hidden px-3 sm:px-4 min-h-screen space-y-6 sm:space-y-8 pb-8 sm:pb-12 pt-4 sm:pt-6">
      <TierProgressBackdrop position="fixed" />
      <div className="relative z-10 space-y-8">
        {currentStep !== null && (
          null
        )}

        {snapshot ? (
          <div className="hidden sm:block">
            <JourneySnapshot
              currentStage={snapshotStage?.title ?? snapshot.currentStage}
              lastCompleted={lastCompletedStage?.title}
              checklistProgress={snapshot.checklistProgress}
              pendingTasks={snapshot.pendingTasks}
              nextAction={snapshot.nextSuggestedAction}
            />
          </div>
        ) : null}

        {activeStep && StepIcon ? (
          <section className="relative rounded-[22px] border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF5722] via-[#FF784E] to-[#FFA726]" aria-hidden />
            <div className="flex items-start gap-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 mt-1.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-siso-orange">
                <StepIcon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white flex items-center gap-2">
                  Step {currentStep! + 1} • {activeStep.title}
                </p>
                {activeStep.helper ? (
                  <p className="text-xs text-white/70 leading-snug max-w-[65ch]">{activeStep.helper}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionsStep((v) => !v)}
                className="inline-flex items-center justify-center p-2 text-white/80 hover:text-white transition"
                aria-label="Common questions"
              >
                <HelpCircle className="h-5 w-5 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
              </button>
            </div>
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-5 sm:space-y-6">
              {renderStepContent(activeStep.id)}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <Button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA726] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black hover:from-[#FF5722] hover:to-[#FFB038] shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
                  onClick={handleNext}
                >
                  {currentStep === totalSteps - 1 ? 'Access dashboard' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {currentStep === totalSteps - 1 ? null : (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-siso-text-muted">Progress</p>
                    <GradientProgressBar value={completionPercentage} />
                    <p className="text-xs text-siso-text-muted">
                      Step {currentStep! + 1} of {totalSteps} — lock in how we reach you
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Secondary panels hidden on mobile to keep each step on-screen */}
        <div className="hidden sm:flex sm:flex-col sm:gap-6">
          <SettingsCallout icon={<Flag className="h-4 w-4" />} title="Progress" subtitle="Resume anywhere — we remember your place.">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <p className="text-4xl font-bold text-white">{Math.round(completionPercentage)}%</p>
              <GradientProgressBar value={completionPercentage} />
              <p className="text-sm text-white/70">{activeStep.helper}</p>
            </div>
          </SettingsCallout>

          <SettingsCallout icon={<Target className="h-4 w-4" />} title="Revenue plan preview" subtitle="Auto-updates as you tweak the sliders.">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Est. revenue</p>
                  <p className="text-2xl font-bold text-white break-words">{currency.format(revenuePlan.monthlyRevenue)} / mo</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Your share (30%)</p>
                  <p className="text-2xl font-bold text-[#FFA726] break-words">{currency.format(revenuePlan.partnerShare)}</p>
                </div>
              </div>
            </div>
          </SettingsCallout>

          <SettingsCallout
            icon={<Lock className="h-4 w-4" />}
            title="Actions locked until Start Here begins"
            subtitle="Widgets still show data—actions unlock once the intro course starts."
          >
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-white/80">
              <p>Your dashboard widgets will show this plan but remain locked until you start the “Start Here” course.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/partners/academy/getting-started">
                  <Button size="sm" className="w-full sm:w-auto rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black">
                    Start intro course
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto text-white/70">
                  Dismiss for now
                </Button>
              </div>
            </div>
          </SettingsCallout>

          <SettingsCallout icon={<HelpCircle className="h-4 w-4" />} title="Need help?" subtitle="Ping us anytime — we’ll collect the answers with you.">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-white/80">
              <p>DM us or book a call and we’ll walk you through onboarding live.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  DM on WhatsApp
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Book a quick call
                </Button>
              </div>
            </div>
          </SettingsCallout>
        </div>
      </div>

      {showQuestionsStep ? (
        <>
          <button
            type="button"
            aria-label="Dismiss common questions overlay"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQuestionsStep(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-4 pb-6 animate-[slide-up_260ms_ease-out]">
            <div className="rounded-t-3xl border border-white/12 bg-siso-bg-secondary p-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/25" aria-hidden />
              <p className="text-[11px] uppercase tracking-[0.25em] text-white">Common questions</p>
              <div className="mt-3 space-y-2 text-sm text-white">
                <p>Why WhatsApp? Faster deal support; no spam.</p>
                <p>Change answers later? Yes, edit in your profile after onboarding.</p>
                <p>What unlocks? Dashboard widgets + Start Here course.</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const HeroCard = ({ currentStep, goToStep }: { currentStep: number; goToStep: (step: number) => void }) => (
  <div className="w-full rounded-[32px] border border-white/10 bg-gradient-to-br from-[#FF5722]/45 via-[#FF784E]/35 to-[#FFA726]/25 p-6 sm:p-8 text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)] relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-40 [mask-image:radial-gradient(circle_at_top,_white,_transparent_70%)]">
      <div className="absolute inset-y-0 inset-x-0 bg-[radial-gradient(circle_at_1px,_rgba(255,255,255,0.15),_transparent_0)] bg-[length:24px_24px]" />
    </div>
    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-4 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">Start strong</p>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">Activate Your Partner Desk</h2>
        <p className="text-lg text-white/85">
          Get the playbook, projections, and support before you ever pitch. Complete the wizard once and we’ll take care of closing.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            onClick={() => goToStep(currentStep)}
            className="w-full sm:w-auto rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black hover:bg-white/90"
          >
            Resume Step {currentStep + 1}
          </Button>
          <Button
            variant="ghost"
            disabled
            className="w-full sm:w-auto rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
          >
            Preview dashboard (locked)
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Avg close rate</p>
          <p className="mt-2 text-3xl font-bold text-white">72%</p>
          <p className="text-sm text-white/60 mt-1">Once we prep the call for you</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Pipeline support</p>
          <p className="mt-2 text-3xl font-bold text-white">24/5</p>
          <p className="text-sm text-white/60 mt-1">WhatsApp + portal guidance</p>
        </div>
      </div>
    </div>
  </div>
);

const StartHero = ({ onStart }: { onStart: () => void }) => {
  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <div className="w-full rounded-[26px] border border-white/10 bg-siso-bg-secondary text-white shadow-[0_18px_35px_rgba(0,0,0,0.45)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(circle_at_top,_white,_transparent_70%)]">
        <div className="absolute inset-y-0 inset-x-0 bg-[radial-gradient(circle_at_1px,_rgba(255,255,255,0.05),_transparent_0)] bg-[length:26px_26px]" />
      </div>
      <div className="relative bg-siso-bg-tertiary/80 backdrop-blur-sm p-6 sm:p-7 space-y-6 siso-inner-card">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-siso-text-muted">
          <div className="flex items-center gap-2">
            <Image
              src="/branding/siso-logo.svg"
              alt="SISO"
              width={24}
              height={24}
              className="h-6 w-auto"
              priority
            />
            <span>SISO Partnership</span>
          </div>
          <button
            type="button"
            onClick={() => setShowQuestions((v) => !v)}
            className="inline-flex items-center justify-center p-2 text-white/80 hover:text-white transition"
            aria-label="Common questions"
          >
            <HelpCircle className="h-5 w-5 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
          </button>
        </div>

        <div className="space-y-3">
          <h1 className="text-[28px] sm:text-4xl font-semibold leading-tight text-white">Activate Your Partner Desk</h1>
          <p className="text-base sm:text-lg text-siso-text-secondary">
            Get your playbook, projections, and support before you pitch a single deal.
          </p>
          <div className="space-y-3 text-sm text-siso-text-secondary">
            <p>You introduce; SISO Partners HQ handles pitch, demos, objections, and follow-ups.</p>
            <p>We show exactly how many clients you need to hit your revenue goal.</p>
            <p>Learn and swap wins inside the SISO Partners HQ community.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            onClick={onStart}
            className="w-full sm:w-auto rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black bg-gradient-to-r from-[#FF5722] to-[#FFA726] hover:from-[#FF5722] hover:to-[#FFB038] shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
          >
            Start Step 1
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-siso-text-muted">Progress</p>
          <GradientProgressBar value={0} />
          <div className="flex items-center gap-3 text-xs text-siso-text-muted">
            <span>Step 0 of 4 — you’re about to start.</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF5722]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white border border-white/15">
              2 mins
            </span>
          </div>
        </div>

        {showQuestions ? (
          <>
            <button
              type="button"
              aria-label="Dismiss common questions overlay"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowQuestions(false)}
            />
            <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-4 pb-6 animate-[slide-up_260ms_ease-out]">
              <div className="rounded-t-3xl border border-white/12 bg-siso-bg-secondary p-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/25" aria-hidden />
                <p className="text-[11px] uppercase tracking-[0.25em] text-white">Common questions</p>
                <div className="mt-3 space-y-2 text-sm text-white">
                  <p>Why WhatsApp? Faster deal support; no spam.</p>
                  <p>Change answers later? Yes, edit in your profile after onboarding.</p>
                  <p>What unlocks? Dashboard widgets + Start Here course.</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <GlowDivider variant="orange" />
    </div>
  );
};

const JourneySnapshot = ({
  currentStage,
  lastCompleted,
  checklistProgress,
  pendingTasks,
  nextAction,
}: {
  currentStage: string;
  lastCompleted?: string;
  checklistProgress: number;
  pendingTasks: number;
  nextAction: string;
}) => (
  <SettingsCallout
    icon={<GaugeCircle className="h-4 w-4" />}
    title="Snapshot"
    subtitle="Latest synced state from workspace + checklist"
  >
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/10 p-4 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
      <div className="w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Current stage</p>
        <p className="text-lg font-semibold text-white">{currentStage}</p>
        {lastCompleted ? (
          <p className="text-xs text-white/60">Last completed: {lastCompleted}</p>
        ) : (
          <p className="text-xs text-white/60">Haven’t completed a step yet</p>
        )}
      </div>
      <div className="w-full md:w-1/2 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Checklist sync</p>
        <div className="mt-2 h-2 w-full rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA726]" style={{ width: `${Math.min(100, Math.max(0, checklistProgress))}%` }} />
        </div>
        <p className="mt-1 text-xs text-white/70">{Math.round(checklistProgress)}% of workspace checklist complete</p>
        <p className="text-xs text-white/70">Pending tasks: {pendingTasks}</p>
        <p className="text-sm text-white">Next action: {nextAction}</p>
      </div>
    </div>
  </SettingsCallout>
);

const SettingsCallout = ({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle?: string; children: ReactNode }) => (
  <section className="rounded-[26px] border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.35)] overflow-hidden">
    <div className="flex items-start gap-3 px-4 py-4 border-b border-white/10">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-siso-orange">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white flex items-center gap-2">{title}</p>
        {subtitle ? <p className="text-xs text-white/70 leading-snug max-w-[65ch]">{subtitle}</p> : null}
      </div>
    </div>
    <div className="px-4 py-4">{children}</div>
  </section>
);

export const GradientProgressBar = ({ value }: { value: number }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-[#FFA726] to-[#FFD27F] transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

const Stepper = ({
  completionPercentage,
  currentStep,
  goToStep,
  steps
}: {
  completionPercentage: number;
  currentStep: number;
  goToStep: (step: number) => void;
  steps: WizardStage[];
}) => (
  <SettingsCallout icon={<Sparkles className="h-4 w-4" />} title="Onboarding tracker" subtitle="Five short steps to unlock the dashboard">
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const Icon = step.iconComponent;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              className={cn(
                'flex w-full sm:w-auto items-center gap-4 rounded-2xl border px-3 py-2 transition text-left',
                isActive
                  ? 'border-white/40 bg-white/10'
                  : isCompleted
                  ? 'border-emerald-400/30 bg-emerald-400/10'
                  : 'border-white/10 bg-transparent hover:border-white/30'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-[0.3em]',
                  isCompleted
                    ? 'bg-white text-black'
                    : isActive
                    ? 'bg-[#FF5722] text-white'
                    : 'border border-white/20 text-white/60'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </span>
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" /> {step.title}
                </p>
                <p className="text-sm text-white/80">{step.helper}</p>
              </div>
            </button>
          );
        })}
      </div>
      <GradientProgressBar value={completionPercentage} />
    </div>
  </SettingsCallout>
);
