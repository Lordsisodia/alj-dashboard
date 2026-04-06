import type { ModelData } from '../../../types';

export interface CardHealthState {
  isDaysSinceContent: number | null;
  isContentStale: boolean;
  isNoBrief: boolean;
  isOnboarding: boolean;
  isPaused: boolean;
  pendingApprovals: number;
  hasDrafts: boolean;
}

export function getCardHealth(model: ModelData): CardHealthState {
  const reels = model.reels ?? [];

  let daysSince: number | null = null;
  if (reels.length > 0) {
    const latest = reels.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
    daysSince = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 86400000);
  }

  return {
    isDaysSinceContent: daysSince,
    isContentStale: daysSince !== null && daysSince > 7,
    isNoBrief: model.reelsInPipeline === 0,
    isOnboarding: model.onboardingPhase < 6,
    isPaused: model.status === 'Paused',
    pendingApprovals: reels.filter(r => r.jobStatus === 'Done').length,
    hasDrafts: reels.some(r => r.step === 'Draft' || r.step === 'Sent'),
  };
}
