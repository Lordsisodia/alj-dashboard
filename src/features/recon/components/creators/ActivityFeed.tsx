'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { LOG_ENTRIES, type LogStatus } from '../../constants';
import { containerVariants, fadeUp } from '../../constants';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<LogStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  success: {
    icon: <CheckCircle2 size={13} />,
    color: '#4a8a2d',
    bg:    'rgba(120,194,87,0.10)',
  },
  running: {
    icon: <Loader2 size={13} className="animate-spin" />,
    color: '#2563eb',
    bg:    'rgba(74,158,255,0.10)',
  },
  failed: {
    icon: <XCircle size={13} />,
    color: '#dc2626',
    bg:    'rgba(220,38,38,0.08)',
  },
};

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function ActivityFeed() {
  return (
    <div
      className="rounded-xl bg-white flex flex-col"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <p className="text-sm font-semibold text-neutral-900">Live Activity</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-medium">Live</span>
        </div>
      </div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col overflow-y-auto"
        style={{ maxHeight: 420 }}
      >
        {LOG_ENTRIES.map((entry, i) => {
          const cfg = STATUS_CFG[entry.status];
          const isLast = i === LOG_ENTRIES.length - 1;
          return (
            <motion.div
              key={entry.id}
              variants={fadeUp}
              className="flex gap-3 px-4 py-3 relative"
              style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
            >
              {/* Timeline line */}
              {!isLast && (
                <div
                  className="absolute left-[27px] top-9 bottom-0 w-px"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                />
              )}

              {/* Status icon circle */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="text-xs text-neutral-700 leading-snug">
                  {entry.action}{' '}
                  <span className="font-semibold" style={{ color: '#ff0069' }}>
                    {entry.handle}
                  </span>
                </p>
                <span className="text-[10px] text-neutral-400">{entry.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
