'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { DailyVolume } from '../../types';

interface VolumeChartProps {
  data: DailyVolume[]; // fallback static data
}

// Format x-axis label: show "Apr 1" on month boundary, day number otherwise
function fmtLabel(label: string, i: number, all: DailyVolume[]): string {
  const [month, day] = label.split(' ');
  if (i === 0) return label;                                      // always show first
  const prevMonth = all[i - 1].label.split(' ')[0];
  if (month !== prevMonth) return label;                          // show full on month change
  return i % 2 === 0 ? day : '';                                  // alternate day numbers
}

export function VolumeChart({ data: fallback }: VolumeChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  const live = useQuery(api.intelligence.getDailyScrapedVolume, { days: 14 });

  // Use real data if non-empty, otherwise fall back to static
  const data: DailyVolume[] = (live && live.some(d => d.total > 0)) ? live : fallback;
  const isLive = live && live.some(d => d.total > 0);

  const max = Math.max(...data.map(d => d.total), 1);
  const half   = Math.floor(data.length / 2);
  const recent = data.slice(-half).reduce((s, d) => s + d.total, 0);
  const prior  = data.slice(0, half).reduce((s, d) => s + d.total, 0);
  const trendPct = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : 0;
  const trendUp  = trendPct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="rounded-xl bg-white p-5"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Posts scraped</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Last 14 days - all creators
            {!isLive && <span className="ml-1 text-amber-500">(sample data)</span>}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{
            backgroundColor: trendUp ? 'rgba(120,194,87,0.10)' : 'rgba(220,38,38,0.08)',
            color: trendUp ? '#4a8a2d' : '#dc2626',
          }}
        >
          <TrendingUp size={11} style={{ transform: trendUp ? 'none' : 'scaleY(-1)' }} />
          {trendUp ? '+' : ''}{trendPct}% vs prior period
        </div>
      </div>

      <div ref={ref} className="relative h-40">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between items-end pr-2 text-[10px] text-neutral-400">
          <span>{max}</span>
          <span>{Math.round(max / 2)}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="absolute left-12 right-0 top-0 bottom-6 flex items-end gap-1">
          {data.map((point, i) => {
            const pct   = (point.total / max) * 100;
            const isHov = hovered === i;
            return (
              <div
                key={point.label}
                className="relative flex-1 flex flex-col items-center"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.1 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-semibold text-neutral-700 whitespace-nowrap z-10 shadow-sm"
                      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
                    >
                      {point.total} · {point.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${Math.max(pct, 3)}%` } : { height: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full rounded-t-md cursor-pointer"
                  style={{
                    background: isHov
                      ? 'linear-gradient(180deg, #ff0069, #833ab4)'
                      : 'linear-gradient(180deg, rgba(255,0,105,0.5), rgba(131,58,180,0.3))',
                    minHeight: 3,
                    transition: 'background 0.18s',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 h-6 flex items-end gap-1">
          {data.map((point, i) => (
            <div key={point.label} className="flex-1 text-center text-[9px] text-neutral-400 truncate px-0.5">
              {fmtLabel(point.label, i, data)}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
