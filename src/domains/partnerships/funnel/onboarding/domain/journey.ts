export type OnboardingStageId = "identity" | "snapshot" | "revenue" | "capacity" | "vsl";

export type OnboardingStageIcon =
  | "message-circle"
  | "users"
  | "line-chart"
  | "gauge-circle"
  | "play-circle";

export interface OnboardingStage {
  id: OnboardingStageId;
  title: string;
  helper: string;
  info: string[];
  cta: string;
  icon: OnboardingStageIcon;
}

export interface OnboardingJourney {
  stages: OnboardingStage[];
  totalSteps: number;
}

export function createJourney(stages: OnboardingStage[]): OnboardingJourney {
  return { stages, totalSteps: stages.length };
}

export function calculateJourneyCompletion(currentStageIndex: number, totalStages: number): number {
  if (totalStages <= 0) return 0;
  const safeIndex = clamp(currentStageIndex, 0, totalStages - 1);
  return ((safeIndex + 1) / totalStages) * 100;
}

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}
