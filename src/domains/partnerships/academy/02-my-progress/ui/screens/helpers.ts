import type { ProgressSnapshot } from "@/domains/partnerships/academy/shared/types";

export function tierPercentage(level: ProgressSnapshot["level"], minimum = 0) {
  const denom = level.currentPoints + level.pointsToNextLevel;
  if (!Number.isFinite(denom) || denom <= 0) return Math.max(0, minimum);
  const pct = Math.round((level.currentPoints / denom) * 100);
  return Math.min(100, Math.max(minimum, pct));
}

