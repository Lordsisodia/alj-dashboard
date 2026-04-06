'use client';

import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { fadeUp } from '../../constants';

interface Bucket { label: string; count: number; }
interface Props  { distribution: Bucket[]; }

const BUCKET_COLORS = ['#ef4444', '#f97316', '#eab308', '#4a9eff', '#22c55e'];

export function HookScoreDistribution({ distribution }: Props) {
  const max = Math.max(...distribution.map(b => b.count), 1);

  return (
    <motion.div variants={fadeUp} className="rounded-xl p-4 space-y-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>
      <div className="flex items-center gap-2">
        <BarChart2 size={13} className="text-neutral-400" />
        <div>
          <p className="text-xs font-semibold text-neutral-900">Hook Score Distribution</p>
          <p className="text-[10px] text-neutral-400">Where does hook quality cluster across analysed posts?</p>
        </div>
      </div>

      <div className="flex items-end gap-2 h-24">
        {distribution.map((b, i) => {
          const heightPct = max > 0 ? (b.count / max) * 100 : 0;
          return (
            <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[9px] font-semibold text-neutral-500">{b.count > 0 ? b.count : ''}</span>
              <motion.div
                className="w-full rounded-t-md"
                style={{ backgroundColor: BUCKET_COLORS[i] }}
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <span className="text-[9px] text-neutral-400">{b.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
