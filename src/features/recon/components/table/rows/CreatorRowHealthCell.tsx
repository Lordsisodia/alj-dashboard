'use client';

import { ScoreBadge } from '../../shared/ScoreBadge';
import { COL_BORDER } from '../tableUtils';
import { EnrichDot } from '../../shared/EnrichDot';
import type { Competitor } from '../../../types';

interface HealthCellProps {
  c: Competitor & {
    _enrichStatus?: string | null;
    aiScore?: number;
    aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
  };
  health: number;
  healthColor: string;
}

export function HealthCell({ c, health, healthColor }: HealthCellProps) {
  return (
    <div className="flex items-center gap-2.5 px-3" style={{ borderRight: COL_BORDER }}>
      <div className="flex flex-col gap-0.5 w-10 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: healthColor }} />
          <span className="text-[10px] font-semibold tabular-nums" style={{ color: healthColor }}>{health}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${health}%`, backgroundColor: healthColor }} />
        </div>
      </div>
      <ScoreBadge score={c.aiScore ?? c.score} aiVerdict={c.aiVerdict} />
      <EnrichDot status={c._enrichStatus} />
    </div>
  );
}
