'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  SCHEDULED_POSTS, APRIL_START_OFFSET, APRIL_DAYS, TODAY,
  TYPE_COLOR, FILTER_TO_TYPE, containerVariants, fadeUp,
} from '../../constants';
import type { FilterType, ScheduledPost } from '../../types';

export function CalendarView({ filter }: { filter: FilterType }) {
  const postsByDay: Record<number, ScheduledPost[]> = {};
  for (const p of SCHEDULED_POSTS) {
    if (filter !== 'All' && p.type !== FILTER_TO_TYPE[filter as Exclude<FilterType, 'All'>]) continue;
    if (!postsByDay[p.day]) postsByDay[p.day] = [];
    postsByDay[p.day].push(p);
  }

  const cells: Array<{ day: number | null; isToday: boolean }> = [];
  for (let i = 0; i < APRIL_START_OFFSET; i++) cells.push({ day: null, isToday: false });
  for (let d = 1; d <= APRIL_DAYS; d++) cells.push({ day: d, isToday: d === TODAY });
  while (cells.length % 7 !== 0) cells.push({ day: null, isToday: false });

  const weeks: Array<typeof cells> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-black/5 transition-colors" style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.08)' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-base font-semibold text-neutral-900 px-2">April 2026</span>
        <button className="p-2 rounded-lg hover:bg-black/5 transition-colors" style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.08)' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}
      >
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#f5f5f4' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-3 text-center text-xs font-medium text-neutral-400">{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
            style={{ borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            {week.map((cell, di) => {
              const posts = cell.day ? (postsByDay[cell.day] ?? []) : [];
              return (
                <div
                  key={di}
                  className="relative p-2 min-h-[80px] cursor-pointer hover:bg-black/[0.02] transition-colors"
                  style={{ borderRight: di < 6 ? '1px solid rgba(0,0,0,0.04)' : undefined, opacity: cell.day === null ? 0.2 : 1 }}
                >
                  {cell.day !== null && (
                    <div className="mb-1.5 flex">
                      {cell.isToday ? (
                        <div className="relative flex items-center justify-center w-6 h-6">
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: 'rgba(255,0,105,0.3)' }}
                            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <div className="relative w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white z-10" style={{ backgroundColor: '#ff0069' }}>
                            {cell.day}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400">{cell.day}</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {posts.slice(0, 3).map((p, pi) => (
                      <div
                        key={pi}
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: TYPE_COLOR[p.type] }}
                        title={`${p.type} - ${p.handle}`}
                      />
                    ))}
                    {posts.length > 3 && <span className="text-[9px] text-white/30">+{posts.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
        {(Object.entries(TYPE_COLOR) as [import('../../types').ContentType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-neutral-400 capitalize">{type}s</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
