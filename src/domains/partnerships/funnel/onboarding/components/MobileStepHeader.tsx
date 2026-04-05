"use client";

import { GradientProgressBar } from "@/domains/partnerships/funnel/onboarding/PartnerOnboardingScreen";

type MobileStepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  helper: string;
  completion: number;
  goToStep: (index: number) => void;
};

export function MobileStepHeader({ currentStep, totalSteps, helper, completion, goToStep }: MobileStepHeaderProps) {
  const safeTotal = Math.max(1, Number.isFinite(totalSteps) ? Math.floor(totalSteps) : 1);
  const safeCurrent = Math.min(safeTotal - 1, Math.max(0, currentStep));
  const stepsArray = Array.from({ length: safeTotal });

  return (
    <div className="mb-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-white space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
        <span>Step {safeCurrent + 1} of {safeTotal}</span>
        <span>{Math.round(completion)}%</span>
      </div>
      <GradientProgressBar value={completion} />
      <p className="text-sm text-white/80">{helper}</p>
      <div className="flex gap-2">
        {stepsArray.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Step ${idx + 1}`}
            onClick={() => goToStep(idx)}
            className={`h-2 w-full rounded-full transition ${idx === safeCurrent ? "bg-white" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
