'use client';

import { motion } from 'framer-motion';

export interface BarRowProps {
  label:    string;
  upRate:   number;  // 0-1
  saveRate: number;  // 0-1
  total:    number;
  color:    string;
  index:    number;
}

export function BarRow({ label, upRate, saveRate, total, color, index }: BarRowProps) {
  const combinedRate = Math.min(upRate + saveRate, 1);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-medium text-neutral-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400">{total} rated</span>
          <span className="text-xs font-semibold" style={{ color }}>
            {Math.round(combinedRate * 100)}%
          </span>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <div className="h-full flex">
          <motion.div
            className="h-full rounded-l-full"
            style={{ backgroundColor: '#22c55e' }}
            initial={{ width: 0 }}
            animate={{ width: `${upRate * 100}%` }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
          />
          <motion.div
            className="h-full rounded-r-full"
            style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
            initial={{ width: 0 }}
            animate={{ width: `${saveRate * 100}%` }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 + 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
