import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Star, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { cn } from "@/lib/utils";
import { spotlight } from "@/domains/partnerships/academy/04-training-spotlight/data/spotlight";
import { ACADEMY_ROUTES } from "@/domains/partnerships/academy/constants/routes";

function ProgressPill({ progress }: { progress: number }) {
  return (
    <div className={cn("relative", "overflow-hidden", "rounded-full", "bg-white/10", "h-2")}> 
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export function TrainingSpotlightScreen() {
  if (!spotlight) {
    return (
      <main className="bg-siso-bg-primary text-siso-text-primary min-h-screen flex items-center justify-center">
        <p className="text-siso-text-muted">No spotlight available right now.</p>
      </main>
    );
  }

  return (
    <main className="bg-siso-bg-primary text-siso-text-primary min-h-screen relative overflow-hidden">
      <TierProgressBackdrop />
      <div className="space-y-6">
        <div className="relative z-10 px-4 pt-10 lg:pt-12">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <Link
                href={ACADEMY_ROUTES.hub}
                aria-label="Back"
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <HighlightCard
              color="orange"
              title="Training spotlight"
              description="Next up in your flow: finish the required induction course."
              metricValue=""
              metricLabel=""
              buttonText="Open lesson"
              buttonHref={spotlight.lessonPath}
              icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
              className="w-full pl-12 text-left"
              fullWidth
              hideDivider
              hideFooter
              showCornerIcon={false}
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
            />

            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-10 lg:pb-12">
          <SettingsGroupCallout
          icon={<ArrowRight className="h-4 w-4" />}
          title="Next course"
          subtitle="Jump to the next required step"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "p-4 text-white/85")}>
            <div className="space-y-3 text-sm text-siso-text-muted">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white text-base font-semibold">{spotlight.title}</p>
                  <p className="text-xs">You're {spotlight.progress}% through this requirement.</p>
                </div>
                <Link
                  href={spotlight.lessonPath}
                  className={cn(
                    secondaryActionButtonClass,
                    "inline-flex items-center rounded-xl border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 hover:text-white",
                  )}
                >
                  Go to course
                </Link>
              </div>
              <div className={cn(nestedCardClass, "border-white/20 p-3")}>
                <div className="flex items-center justify-between text-xs text-siso-text-muted">
                  <span>Progress</span>
                  <span className="text-white font-semibold">{spotlight.progress}%</span>
                </div>
                <div className="mt-2">
                  <ProgressPill progress={spotlight.progress} />
                </div>
              </div>
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Star className="h-4 w-4" />}
          title="Why now"
          subtitle="Tying the lesson to today's priorities"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-3 p-4 text-white/85")}>
            <p className="text-sm font-semibold text-white">{spotlight.title}</p>
            <p className="text-xs text-siso-text-muted">{spotlight.summary}</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-siso-orange">Current priority</p>
            <p className="text-sm text-white">{spotlight.whyNow}</p>
            <div className="space-y-1 text-sm text-siso-text-muted">
              {spotlight.rationale.map((reason) => (
                <div key={reason} className="flex items-start gap-2">
                  <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-siso-orange" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {spotlight.outcomes.map((outcome) => (
                <span key={outcome} className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-siso-text-muted">
                  {outcome}
                </span>
              ))}
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<ArrowRight className="h-4 w-4" />}
          title="Need-to-know prep"
          subtitle="Pre-reqs + related proof"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "space-y-2 p-4 text-[11px] text-white/85")}>
            <p className="font-semibold text-white">Prerequisites</p>
            <ul className="list-inside list-disc text-siso-text-muted">
              {spotlight.prerequisites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pt-2 font-semibold text-white">Post-lesson proof to send</p>
            <div className="flex flex-wrap gap-2">
              {spotlight.proofAssets.map((related) => (
                <Link
                  key={related.href}
                  href={related.href}
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] text-siso-orange"
                >
                  <ArrowRight className="h-3 w-3" />
                  {related.label}
                </Link>
              ))}
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout
          icon={<Sparkles className="h-4 w-4" />}
          title="Next steps"
          subtitle="Preview the lesson plan"
          showChevron={false}
        >
          <div className={cn(stackedPanelClass, "p-4 text-white/85")}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-siso-text-muted">Stay on track</p>
              <Link href={spotlight.lessonPath} className="text-xs font-semibold uppercase tracking-[0.3em] text-siso-orange">
                Open lesson
              </Link>
            </div>
            <ol className="mt-3 space-y-3 text-sm text-siso-text-muted">
              {[
                "Review the discovery script pre-read",
                "Walk through the 5 sample questions",
                "Practice the follow-up template and save to Saved Docs",
              ].map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[12px] text-white">
                    •
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </SettingsGroupCallout>
        </div>
      </div>
    </main>
  );
}
