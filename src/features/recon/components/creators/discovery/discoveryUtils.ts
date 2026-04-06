export function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function getRatioColor(ratio: number): string {
  if (ratio >= 2.0) return '#ff0069';
  if (ratio >= 1.5) return '#f59e0b';
  if (ratio >= 1.0) return '#78c257';
  return '#9ca3af';
}
