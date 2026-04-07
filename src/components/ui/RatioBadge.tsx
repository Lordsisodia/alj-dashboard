'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function getRatioColor(ratio: number): string {
  if (ratio >= 2.0) return '#dc2626';
  if (ratio >= 1.5) return '#b91c1c';
  if (ratio >= 1.0) return '#ef4444';
  return '#991b1b';
}

export function RatioBadge({ ratio, size = 'md' }: { ratio: number; size?: 'sm' | 'md' }) {
  const color = getRatioColor(ratio);
  const isHot = ratio >= 2.0;
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-lg font-bold tabular-nums',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
      )}
      style={{ backgroundColor: `${color}15`, color }}
      title="Outlier ratio: avg views ÷ followers"
    >
      {isHot && <Zap size={size === 'sm' ? 9 : 11} />}
      {ratio.toFixed(2)}×
    </div>
  );
}
