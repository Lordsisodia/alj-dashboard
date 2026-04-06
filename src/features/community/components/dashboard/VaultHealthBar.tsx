'use client';

import { POSTS, NICHE_CONFIG } from '../../constants';
import type { Niche } from '../../types';

const NICHES: Niche[] = ['fitness', 'lifestyle', 'fashion', 'wellness'];

export function VaultHealthBar() {
  const total = POSTS.length;
  const counts = NICHES.reduce<Record<Niche, number>>((acc, n) => {
    acc[n] = POSTS.filter(p => p.niche === n).length;
    return acc;
  }, {} as Record<Niche, number>);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 h-full"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-neutral-800">Vault by Niche</p>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#737373' }}
        >
          {total} total
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {NICHES.map(niche => {
          const cfg = NICHE_CONFIG[niche];
          const count = counts[niche];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={niche}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {count} · {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: cfg.bg }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
