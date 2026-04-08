'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Pause, Play, ExternalLink, RefreshCcw } from 'lucide-react';
import { containerVariants, fadeUp } from '../../../constants';
import { Sparkline } from '../../shared/Sparkline';
import type { Competitor } from '../../../types';

function staleLabel(s: string): { text: string; color: string } {
  if (!s || s === 'Never') return { text: 'Never',   color: '#dc2626' };
  const m = s.match(/(\d+)\s*(day|mo|week)/i);
  if (!m)                  return { text: s,         color: '#78c257' };
  const n = parseInt(m[1]);
  const u = m[2].toLowerCase();
  const d = u.startsWith('mo') ? n * 30 : u.startsWith('w') ? n * 7 : n;
  const color = d <= 7 ? '#78c257' : d <= 21 ? '#f59e0b' : '#dc2626';
  return { text: s, color };
}

const JOB_DOT: Record<string, { color: string; glow?: boolean; label: string }> = {
  idle:    { color: '#d1d5db', label: 'Idle'    },
  running: { color: '#4a9eff', glow: true, label: 'Running' },
  failed:  { color: '#dc2626', label: 'Failed'  },
};

export function CreatorStatusGrid({ creators }: { creators: Competitor[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const sorted = [...creators].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return b.postsToday - a.postsToday;
  });

  const active = creators.filter(c => c.status === 'active').length;
  const paused = creators.filter(c => c.status === 'paused').length;

  return (
    <div className="w-full">

      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
          Scraping Monitor
        </p>
        <span className="text-[11px] text-neutral-400">
          {active} active · {paused} paused
        </span>
      </div>

      {/* Column labels */}
      <div
        className="grid px-3 py-2"
        style={{
          gridTemplateColumns: '2fr 1fr 80px 64px 88px 100px 80px',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {['Creator', 'Niche', 'Status', 'Today', '7-day trend', 'Last scraped', ''].map(col => (
          <span key={col} className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {sorted.map(c => {
          const isPaused  = c.status === 'paused';
          const isFailed  = c.jobStatus === 'failed';
          const isRunning = c.jobStatus === 'running';
          const stale     = staleLabel(c.lastScraped);
          const dot       = JOB_DOT[c.jobStatus] ?? JOB_DOT.idle;
          const isHovered = hovered === c.id;

          return (
            <motion.div
              key={c.id}
              variants={fadeUp}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              className="grid items-center px-3 py-3"
              style={{
                gridTemplateColumns: '2fr 1fr 80px 64px 88px 100px 80px',
                borderBottom: '1px solid rgba(0,0,0,0.045)',
                opacity: isPaused ? 0.5 : 1,
                backgroundColor: isHovered ? 'rgba(0,0,0,0.012)' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              {/* Creator */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: c.avatarColor }}
                >
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-neutral-800 truncate leading-tight">
                    {c.handle}
                  </p>
                  {c.followers && (
                    <p className="text-[10px] text-neutral-400 leading-none mt-0.5">{c.followers}</p>
                  )}
                </div>
              </div>

              {/* Niche */}
              <span className="text-[11px] text-neutral-500 font-medium">{c.niche}</span>

              {/* Job status */}
              <div className="flex items-center gap-1.5">
                {isRunning
                  ? <Loader2 size={9} className="animate-spin" style={{ color: dot.color }} />
                  : <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: dot.color,
                        boxShadow: dot.glow ? `0 0 5px ${dot.color}90` : undefined,
                      }}
                    />
                }
                <span className="text-[11px]" style={{ color: isFailed ? '#dc2626' : '#9ca3af' }}>
                  {dot.label}
                </span>
              </div>

              {/* Posts today */}
              <span
                className="text-[15px] font-bold tabular-nums leading-none"
                style={{ color: isFailed ? '#dc2626' : '#111827' }}
              >
                {c.postsToday}
              </span>

              {/* Sparkline */}
              <div className="-ml-1">
                <Sparkline values={c.trend} color={isPaused ? '#d1d5db' : '#dc2626'} />
              </div>

              {/* Last scraped */}
              <span className="text-[11px] font-medium" style={{ color: stale.color }}>
                {stale.text}
              </span>

              {/* Actions */}
              <div
                className="flex items-center gap-1.5 justify-end"
                style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s ease' }}
              >
                {isFailed && (
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                    title="Retry"
                  >
                    <RefreshCcw size={9} /> Retry
                  </button>
                )}
                {!isFailed && c.status === 'active' && (
                  <button
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                    title="View creator"
                  >
                    <ExternalLink size={11} />
                  </button>
                )}
                <button
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                  title={c.status === 'active' ? 'Pause' : 'Resume'}
                >
                  {c.status === 'active' ? <Pause size={11} /> : <Play size={11} />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
