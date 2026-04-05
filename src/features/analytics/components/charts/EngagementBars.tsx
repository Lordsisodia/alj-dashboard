'use client';

import { motion } from 'framer-motion';
import type { EngagementPoint } from '../../types';

interface EngagementBarsProps {
  data: EngagementPoint[];
}

export function EngagementBars({ data }: EngagementBarsProps) {
  return (
    <div className="space-y-2.5">
      {data.map((point, i) => {
        const pct = (point.rate / 6) * 100;
        return (
          <div key={point.week} className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 w-5 flex-shrink-0">{point.week}</span>
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              />
            </div>
            <span className="text-[11px] font-semibold w-8 text-right" style={{ color: '#ff0069' }}>
              {point.rate}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
