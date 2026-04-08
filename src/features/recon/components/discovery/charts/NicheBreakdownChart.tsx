'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { MappedCandidate } from '../data';

interface Props {
  candidates: MappedCandidate[];
}

const NICHE_COLORS: Record<string, string> = {
  GFE:       '#dc2626',
  Fitness:   '#991b1b',
  Lifestyle: '#7f1d1d',
  Fashion:   '#b91c1c',
  Beauty:    '#ef4444',
  Other:     '#f87171',
};

const SHADES = ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#ef4444', '#f87171'];

export function NicheBreakdownChart({ candidates }: Props) {
  const counts: Record<string, number> = {};
  for (const c of candidates) {
    const niche = c.niche ?? 'Other';
    counts[niche] = (counts[niche] ?? 0) + 1;
  }

  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name,
      value,
      color: NICHE_COLORS[name] ?? SHADES[i % SHADES.length],
    }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl bg-white px-4 py-3 flex items-center gap-3" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="relative flex-shrink-0">
        <ResponsiveContainer width={72} height={72}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={22}
              outerRadius={34}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[13px] font-bold text-neutral-800 leading-none">{total}</span>
          <span className="text-[7px] text-neutral-400">total</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-2">Niche breakdown</p>
        <div className="space-y-1">
          {data.slice(0, 5).map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] text-neutral-600 flex-1 truncate">{d.name}</span>
              <span className="text-[10px] font-semibold text-neutral-800 tabular-nums">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
