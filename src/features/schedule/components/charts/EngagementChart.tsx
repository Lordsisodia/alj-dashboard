'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ENGAGEMENT_DATA } from '../../constants';

export function EngagementChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...ENGAGEMENT_DATA.map((d) => d.value));

  return (
    <div ref={ref} className="flex items-end gap-3 h-36">
      {ENGAGEMENT_DATA.map((d, i) => (
        <div
          key={d.label}
          className="flex-1 flex flex-col items-center gap-2 relative group"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-10 shadow-lg"
                style={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {d.value}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full flex items-end" style={{ height: '100px' }}>
            <motion.div
              className="w-full rounded-t-lg cursor-pointer transition-all"
              style={{
                background: hovered === i
                  ? 'linear-gradient(to top, #ff0069, #ff4d8d)'
                  : 'linear-gradient(to top, rgba(255,0,105,0.5), rgba(255,0,105,0.25))',
              }}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${(d.value / max) * 100}px` } : { height: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
          <span className="text-[11px] text-neutral-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
