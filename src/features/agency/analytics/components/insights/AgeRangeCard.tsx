'use client';

import { motion } from 'framer-motion';
import type { AgeRange } from '../../types';

interface AgeRangeCardProps {
  ranges: AgeRange[];
}

export function AgeRangeCard({ ranges }: AgeRangeCardProps) {
  const topRange = [...ranges].sort((a, b) => b.pct - a.pct)[0]?.range;
  return (
    <div
      className="rounded-xl bg-white p-5"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Age Range</span>
      </div>
      <div className="space-y-2.5">
        {ranges.map((age, i) => (
          <div key={age.range} className="flex items-center gap-2.5">
            <span className="text-xs text-neutral-600 w-12 flex-shrink-0">{age.range}</span>
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: age.range === topRange ? 'linear-gradient(90deg, #ff0069, #833ab4)' : 'rgba(0,0,0,0.15)' }}
                initial={{ width: 0 }}
                whileInView={{ width: `${age.pct}%` }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
              />
            </div>
            <span
              className="text-[11px] font-bold w-7 text-right flex-shrink-0"
              style={{ color: age.range === topRange ? '#ff0069' : '#a3a3a3' }}
            >
              {age.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
