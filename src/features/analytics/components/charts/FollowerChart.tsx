'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GrowthPoint } from '../../types';
import { fmtK } from '../../utils';

interface FollowerChartProps {
  data: GrowthPoint[];
}

export function FollowerChart({ data }: FollowerChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));

  return (
    <div className="relative h-44">
      {/* Y-axis */}
      <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between items-end pr-2 text-[10px] text-neutral-400">
        <span>{fmtK(max)}</span>
        <span>{fmtK(Math.round((max + min) / 2))}</span>
        <span>{fmtK(min)}</span>
      </div>

      {/* Bars */}
      <div className="absolute left-12 right-0 top-0 bottom-8 flex items-end gap-1.5">
        {data.map((point, i) => {
          const pct = ((point.value - min) / (max - min)) * 100;
          return (
            <div
              key={point.label}
              className="relative flex-1 flex flex-col items-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <AnimatePresence>
                {hovered === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-semibold text-neutral-700 whitespace-nowrap z-10 shadow-sm"
                    style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
                  >
                    {fmtK(point.value)}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct, 4)}%` }}
                transition={{ delay: i * 0.04, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full rounded-t-md cursor-pointer"
                style={{
                  background: hovered === i
                    ? 'linear-gradient(180deg, #ff0069, #833ab4)'
                    : 'linear-gradient(180deg, rgba(255,0,105,0.55), rgba(131,58,180,0.35))',
                  minHeight: 4,
                  transition: 'background 0.2s',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis */}
      <div className="absolute left-12 right-0 bottom-0 h-8 flex items-end gap-1.5">
        {data.map(point => (
          <div key={point.label} className="flex-1 text-center text-[10px] text-neutral-400">
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
}
