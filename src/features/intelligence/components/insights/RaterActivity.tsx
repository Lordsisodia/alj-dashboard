'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, Bookmark } from 'lucide-react';
import { fadeUp } from '../../constants';
import type { RaterStat } from '../../types';

const AVATAR_COLORS = [
  '#ff0069', '#833ab4', '#4a9eff', '#22c55e', '#f97316', '#8b5cf6',
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface Props {
  raters: RaterStat[];
}

export function RaterActivity({ raters }: Props) {
  if (raters.length === 0) return null;

  const max = raters[0]?.total ?? 1;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-4 space-y-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
    >
      <div>
        <p className="text-xs font-semibold text-neutral-900">Team activity</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">Who's been rating this week</p>
      </div>

      <div className="space-y-2.5">
        {raters.map((r, i) => {
          const color    = avatarColor(r.ratedBy);
          const barWidth = max > 0 ? (r.total / max) * 100 : 0;
          const initial  = r.ratedBy.charAt(0).toUpperCase();

          return (
            <div key={r.ratedBy} className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {initial}
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-700">{r.ratedBy}</span>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-0.5 text-green-600 font-semibold">
                      <ThumbsUp size={9} /> {r.upCount}
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold" style={{ color: '#ff0069' }}>
                      <Bookmark size={9} /> {r.saveCount}
                    </span>
                    <span>{r.total} total</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
