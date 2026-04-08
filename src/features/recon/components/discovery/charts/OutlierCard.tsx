'use client';

import { TrendingUp } from 'lucide-react';
import type { Candidate } from '../../../types';
import { fmtViews } from '../discoveryUtils';

interface Props { candidate: Candidate; }

export function OutlierCard({ candidate }: Props) {
  if (candidate.outlierRatio <= 0) return null;
  const ratioColor =
    candidate.outlierRatio >= 2.0 ? '#dc2626'
    : candidate.outlierRatio >= 1.5 ? '#b91c1c'
    : candidate.outlierRatio >= 1.0 ? '#ef4444'
    : '#991b1b';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl"
      style={{ backgroundColor: `${ratioColor}0d`, border: `1px solid ${ratioColor}20` }}>
      <TrendingUp size={14} style={{ color: ratioColor, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-neutral-500">Outlier ratio</p>
        <p className="text-lg font-bold leading-none mt-0.5" style={{ color: ratioColor }}>
          {candidate.outlierRatio.toFixed(2)}×
        </p>
      </div>
      <div className="text-right">
        <p className="text-[9px] text-neutral-400">Avg views</p>
        <p className="text-xs font-bold text-neutral-700">{fmtViews(candidate.avgViews)}</p>
      </div>
    </div>
  );
}
