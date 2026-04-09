'use client';

import { BarChart2 } from 'lucide-react';
import { POSTS, NICHE_CONFIG, MOCK_NICHE_TARGETS } from '../../constants';
import type { Niche } from '../../types';

const NICHES: Niche[] = ['fitness', 'lifestyle', 'fashion', 'wellness'];

const VAULT_NICHE_COLORS: Record<string, { color: string; bg: string }> = {
  fitness:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
  lifestyle: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  fashion:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  wellness:  { color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
};

function StatusChip({ fillPct }: { fillPct: number }) {
  if (fillPct >= 80) {
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
        OK
      </span>
    );
  }
  if (fillPct >= 40) {
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706' }}>
        Low
      </span>
    );
  }
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}>
      Empty
    </span>
  );
}

export function VaultHealthBar() {
  const total = POSTS.length;
  const counts = NICHES.reduce<Record<Niche, number>>((acc, n) => {
    acc[n] = POSTS.filter(p => p.niche === n).length;
    return acc;
  }, {} as Record<Niche, number>);

  const nicheData = NICHES.map(niche => {
    const count  = counts[niche];
    const target = MOCK_NICHE_TARGETS[niche] ?? 20;
    const fillPct = Math.min(100, Math.round((count / target) * 100));
    return { niche, count, fillPct };
  }).sort((a, b) => a.fillPct - b.fillPct); // lowest fill first (urgency at top)

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 h-full"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart2 size={13} style={{ color: '#2563eb' }} />
          <p className="text-xs font-bold text-neutral-800">Vault by Niche</p>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#737373' }}
        >
          {total} total
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {nicheData.map(({ niche, count, fillPct }) => {
          const cfg = NICHE_CONFIG[niche];
          const colors = VAULT_NICHE_COLORS[niche] ?? { color: cfg.color, bg: cfg.bg };

          return (
            <div key={niche}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold" style={{ color: colors.color }}>
                  {cfg.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-400">
                    {count} · {fillPct}%
                  </span>
                  <StatusChip fillPct={fillPct} />
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: colors.bg }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${fillPct}%`, backgroundColor: colors.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
