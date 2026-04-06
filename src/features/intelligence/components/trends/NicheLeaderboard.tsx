'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fadeUp, NICHE_COLORS } from '../../constants';
import type { NicheStat } from '../../types';

interface Props {
  niches: NicheStat[];
}

export function NicheLeaderboard({ niches }: Props) {
  const max = Math.max(...niches.map(n => n.avgER), 0.001);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-4"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <p className="text-xs font-semibold text-neutral-900 mb-0.5">Niche Leaderboard</p>
      <p className="text-[10px] text-neutral-400 mb-3">Ranked by avg engagement rate</p>

      {niches.length === 0 ? (
        <p className="text-xs text-neutral-400 text-center py-6">No data yet</p>
      ) : (
        <div className="space-y-0">
          {niches.map((n, i) => {
            const color  = NICHE_COLORS[n.niche] ?? '#833ab4';
            const pct    = max > 0 ? (n.avgER / max) * 100 : 0;
            const isTop  = i === 0;

            return (
              <div
                key={n.niche}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: i < niches.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
              >
                <span className="text-[11px] font-bold text-neutral-300 w-4 flex-shrink-0 text-center">{i + 1}</span>

                <div
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {n.niche}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs font-semibold" style={{ color }}>
                    {(n.avgER * 100).toFixed(1)}%
                  </span>
                  {isTop
                    ? <TrendingUp  size={11} className="text-emerald-500" />
                    : <TrendingDown size={11} className="text-neutral-300" />
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
