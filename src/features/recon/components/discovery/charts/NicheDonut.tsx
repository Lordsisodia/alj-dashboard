'use client';

import { COMPETITORS } from '../../../creatorData';

const RED_SHADES = ['#dc2626', '#b91c1c', '#ef4444', '#7f1d1d', '#fca5a5', '#991b1b'];

interface Slice { niche: string; count: number; color: string }

function buildSlices(): Slice[] {
  const counts: Record<string, number> = {};
  for (const c of COMPETITORS) {
    counts[c.niche] = (counts[c.niche] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([niche, count], i) => ({ niche, count, color: RED_SHADES[i % RED_SHADES.length] }));
}

export function NicheDonut() {
  const slices = buildSlices();
  const total  = slices.reduce((s, x) => s + x.count, 0);

  const SIZE = 80;
  const R    = 28;
  const cx   = SIZE / 2;
  const cy   = SIZE / 2;
  const stroke = 10;

  // Build arc paths
  let cumAngle = -Math.PI / 2;
  const arcs = slices.map(sl => {
    const angle = (sl.count / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { ...sl, d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, angle };
  });

  return (
    <div
      className="rounded-xl bg-white px-4 py-3 flex items-center gap-4"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex-shrink-0 relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {arcs.map((arc, i) => (
            <path
              key={arc.niche}
              d={arc.d}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              opacity={0.9}
            />
          ))}
          <circle cx={cx} cy={cy} r={R - stroke / 2 - 2} fill="white" />
          <text x={cx} y={cy - 3} textAnchor="middle" fontSize={14} fontWeight={700} fill="#171717">{total}</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7} fill="#9ca3af">creators</text>
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-2">Niche breakdown</p>
        <div className="space-y-1">
          {slices.map(sl => (
            <div key={sl.niche} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sl.color }} />
              <span className="text-[11px] text-neutral-600 flex-1">{sl.niche}</span>
              <span className="text-[11px] font-semibold text-neutral-900 tabular-nums">{sl.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
