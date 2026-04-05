import type { OnboardingStageId } from "../domain/journey";

export interface OnboardingSnapshot {
  currentStage: OnboardingStageId;
  lastCompleted: OnboardingStageId | null;
  checklistProgress: number;
  pendingTasks: number;
  nextSuggestedAction: string;
}

/** Placeholder API client that will eventually request onboarding progress from the backend. */
export async function fetchOnboardingSnapshot(): Promise<OnboardingSnapshot> {
  // TODO: replace with real fetch once the onboarding service exists
  return Promise.resolve({
    currentStage: "snapshot",
    lastCompleted: "identity",
    checklistProgress: 32,
    pendingTasks: 3,
    nextSuggestedAction: "Complete the work snapshot so we can tailor the playbook",
  });
}
