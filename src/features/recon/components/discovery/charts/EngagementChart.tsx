'use client';

import type { MappedCandidate } from '../data';

interface Props {
  candidates: MappedCandidate[];
}

type Bucket = { label: string; color: string; count: number };

function buildBuckets(candidates: MappedCandidate[]): Bucket[] {
  const buckets: Bucket[] = [
    { label: '< 1%',  color: '#fca5a5', count: 0 },
    { label: '1-3%',  color: '#f87171', count: 0 },
    { label: '3-5%',  color: '#ef4444', count: 0 },
    { label: '5%+',   color: '#dc2626', count: 0 },
  ];

  for (const c of candidates) {
    const raw = parseFloat(c.engagementRate.replace('%', ''));
    if (isNaN(raw))      buckets[0].count++;
    else if (raw < 1)    buckets[0].count++;
    else if (raw < 3)    buckets[1].count++;
    else if (raw < 5)    buckets[2].count++;
    else                  buckets[3].count++;
  }
  return buckets;
}

export function EngagementChart({ candidates }: Props) {
  const data = buildBuckets(candidates);
  const total = data.reduce((s, b) => s + b.count, 0);

  return (
    <div className="rounded-xl bg-white px-4 py-3 flex flex-col" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-3">Engagement rate</p>
      <div className="flex-1 flex flex-col justify-between gap-1.5">
        {data.map(b => {
          const pct = total > 0 ? (b.count / total) * 100 : 0;
          return (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[9px] text-neutral-400 w-7 text-right tabular-nums">{b.label}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: b.color }}
                />
              </div>
              <span className="text-[9px] font-semibold text-neutral-600 tabular-nums w-4 text-right">{b.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
