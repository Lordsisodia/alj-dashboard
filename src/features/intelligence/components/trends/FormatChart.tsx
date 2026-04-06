'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '../../constants';
import type { FormatStat } from '../../types';
import { fmtNum } from '../../utils';

const FORMAT_COLORS: Record<string, string> = {
  reel:     '#ff0069',
  post:     '#833ab4',
  carousel: '#4a9eff',
  story:    '#fcaf45',
};

const FORMAT_LABELS: Record<string, string> = {
  reel: 'Reel', post: 'Post', carousel: 'Carousel', story: 'Story',
};

interface Props {
  formats: FormatStat[];
  metric:  'er' | 'views';
}

export function FormatChart({ formats, metric }: Props) {
  const max = Math.max(...formats.map(f => metric === 'er' ? f.avgER : f.avgViews), 0.001);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <p className="text-xs font-semibold text-neutral-900">Format Performance</p>
      <p className="text-[10px] text-neutral-400 -mt-1">
        {metric === 'er' ? 'Avg engagement rate by format' : 'Avg views by format'}
      </p>

      <div className="space-y-3 pt-1">
        {formats.length === 0 ? (
          <p className="text-xs text-neutral-400 text-center py-6">No data yet</p>
        ) : (
          formats.map(f => {
            const val  = metric === 'er' ? f.avgER : f.avgViews;
            const pct  = max > 0 ? (val / max) * 100 : 0;
            const color = FORMAT_COLORS[f.format] ?? '#833ab4';
            const label = FORMAT_LABELS[f.format] ?? f.format;
            const display = metric === 'er'
              ? `${(f.avgER * 100).toFixed(1)}%`
              : fmtNum(Math.round(f.avgViews));

            return (
              <div key={f.format} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs text-neutral-700">{label}</span>
                    <span className="text-[10px] text-neutral-400">{f.count} posts</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color }}>{display}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
