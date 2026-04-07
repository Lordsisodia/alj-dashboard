'use client';

import type { MappedCandidate } from './data';

export function RejectedPanel({ candidates }: { candidates: MappedCandidate[] }) {
  if (candidates.length === 0) return null;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'rgba(0,0,0,0.018)' }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">Rejected</p>
        <span className="ml-auto text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>
          {candidates.length}
        </span>
      </div>
      <div className="p-2 space-y-0.5 max-h-[110px] overflow-y-auto">
        {candidates.map(c => (
          <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold flex-shrink-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}
            >
              {c.initials}
            </div>
            <p className="text-[10px] font-medium text-neutral-400 flex-1 truncate">{c.handle}</p>
            {c.outlierRatio > 0 && <span className="text-[9px] tabular-nums text-neutral-300">{c.outlierRatio.toFixed(2)}×</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
