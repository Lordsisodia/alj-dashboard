import { useEffect, useMemo, useState } from "react";
import { defaultJourney } from "../data/journey-fixtures";
import { calculateJourneyCompletion } from "../domain/journey";
import { fetchOnboardingSnapshot, type OnboardingSnapshot } from "../infrastructure/onboarding-client";

export function useOnboardingJourney(currentStageIndex: number) {
  const [snapshot, setSnapshot] = useState<OnboardingSnapshot | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchOnboardingSnapshot()
      .then((data) => {
        if (isMounted) setSnapshot(data);
      })
      .catch(() => {
        if (isMounted) setSnapshot(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const safeTotalSteps = Number.isFinite(defaultJourney?.totalSteps) && defaultJourney.totalSteps > 0 ? defaultJourney.totalSteps : 1;
  const safeStages = Array.isArray(defaultJourney?.stages) ? defaultJourney.stages : [];

  const completionPercentage = useMemo(
    () => calculateJourneyCompletion(currentStageIndex, safeTotalSteps),
    [currentStageIndex, safeTotalSteps]
  );

  return {
    stages: safeStages,
    totalSteps: safeTotalSteps,
    completionPercentage,
    snapshot
  } as const;
}
