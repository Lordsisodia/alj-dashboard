'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Hash } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { fadeUp } from '../../constants';

interface Props {
  days:  number;
  niche: string;
}

function CorrelationRow({ row, maxPct, index }: {
  row:    { hashtag: string; topCount: number; totalCount: number; correlationPct: number; topAvgER: number };
  maxPct: number;
  index:  number;
}) {
  const barW   = maxPct > 0 ? (row.correlationPct / maxPct) * 100 : 0;
  const isHot  = row.correlationPct >= 50;
  const color  = isHot ? '#22c55e' : row.correlationPct >= 25 ? '#f59e0b' : '#9ca3af';

  return (
    <motion.div
      className="grid items-center gap-3 py-2"
      style={{ gridTemplateColumns: '140px 1fr 56px 56px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <span className="text-[11px] font-medium text-neutral-700 truncate">#{row.hashtag}</span>

      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${barW}%` }}
          transition={{ duration: 0.5, delay: index * 0.04 + 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <span className="text-[11px] font-bold text-right" style={{ color }}>
        {row.correlationPct}%
      </span>

      <span className="text-[10px] text-neutral-400 text-right">
        {row.topCount}/{row.totalCount}
      </span>
    </motion.div>
  );
}

export function HashtagCorrelation({ days, niche }: Props) {
  const rows = useQuery(api.intelligence.getHashtagCorrelation, {
    days,
    niche: niche !== 'all' ? niche : undefined,
  });

  if (rows === undefined) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 rounded-lg animate-pulse" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 rounded-xl" style={{ border: '1px dashed rgba(0,0,0,0.09)', backgroundColor: '#fafafa' }}>
        <Hash size={16} className="text-neutral-300" />
        <p className="text-xs text-neutral-400">No hashtag data yet - add real scraped posts to see correlations</p>
      </div>
    );
  }

  const maxPct = rows[0]?.correlationPct ?? 100;

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e, #4a9eff)' }}>
          <Hash size={13} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Hashtag Correlation</p>
          <p className="text-[10px] text-neutral-400">How often each hashtag appears in the top-10% ER posts</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[9px] text-neutral-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#22c55e' }} />≥50%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#f59e0b' }} />≥25%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#9ca3af' }} />low</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6">
        {[rows.slice(0, 10), rows.slice(10, 20)].map((col, ci) => (
          <div key={ci}>
            <div className="grid text-[9px] font-semibold text-neutral-400 uppercase tracking-wide pb-1" style={{ gridTemplateColumns: '140px 1fr 56px 56px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span>Hashtag</span>
              <span />
              <span className="text-right">Top%</span>
              <span className="text-right">Top/Total</span>
            </div>
            {col.map((row, i) => (
              <CorrelationRow key={row.hashtag} row={row} maxPct={maxPct} index={ci * 10 + i} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
