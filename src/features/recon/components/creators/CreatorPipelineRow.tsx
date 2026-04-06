'use client';

import { motion } from 'framer-motion';
import { Loader2, ExternalLink, Pause, Play, RefreshCcw } from 'lucide-react';
import { fadeUp } from '../../constants';
import type { Competitor } from '../../types';

const JOB_BADGE = {
  idle:    { label: 'Idle',    bg: 'rgba(0,0,0,0.04)',      color: '#9ca3af', dot: '#d1d5db' },
  running: { label: 'Running', bg: 'rgba(74,158,255,0.10)', color: '#2563eb', dot: '#4a9eff' },
  failed:  { label: 'Failed',  bg: 'rgba(220,38,38,0.08)',  color: '#dc2626', dot: '#dc2626' },
} as const;

const DAILY_TARGET = 65;

function staleColor(lastScraped: string): string {
  if (!lastScraped || lastScraped === 'Never') return '#dc2626';
  const m = lastScraped.match(/(\d+)\s*(day|mo|month|week)/i);
  if (!m) return '#78c257';
  const n = parseInt(m[1]);
  const u = m[2].toLowerCase();
  const days = u.startsWith('mo') ? n * 30 : u.startsWith('week') ? n * 7 : n;
  if (days <= 7)  return '#78c257';
  if (days <= 21) return '#f59e0b';
  return '#dc2626';
}

interface Props {
  c: Competitor;
  onToggle: (id: number) => void;
  onRetry: (id: number) => void;
}

export function CreatorPipelineRow({ c, onToggle, onRetry }: Props) {
  const isActive = c.status === 'active';
  const isPaused = c.status === 'paused';
  const isFailed = c.jobStatus === 'failed';
  const badge    = JOB_BADGE[c.jobStatus];
  const barPct   = Math.min((c.postsToday / DAILY_TARGET) * 100, 100);
  const sc       = staleColor(c.lastScraped);

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', opacity: isPaused ? 0.65 : 1 }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.avatarColor }}>
        {c.initials}
      </div>

      <div className="flex items-center gap-1.5 w-44 flex-shrink-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{c.handle}</p>
        <div className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.nicheColor }}>
          {c.niche}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barPct}%` }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full rounded-full"
            style={{ background: isFailed ? '#dc2626' : isPaused ? '#d1d5db' : `linear-gradient(90deg, ${c.nicheColor}cc, ${c.nicheColor})` }}
          />
        </div>
        <span className="text-xs font-bold text-neutral-900 w-6 text-right flex-shrink-0">{c.postsToday}</span>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: badge.bg, color: badge.color }}>
        {c.jobStatus === 'running' ? <Loader2 size={9} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />}
        {badge.label}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 w-24">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc }} />
        <span className="text-[10px] text-neutral-500 truncate">{c.lastScraped}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isFailed && (
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }} onClick={() => onRetry(c.id)} title="Retry scrape">
            <RefreshCcw size={10} /> Retry
          </button>
        )}
        {isActive && !isFailed && (
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            <ExternalLink size={10} /> View
          </button>
        )}
        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400" style={{ border: '1px solid rgba(0,0,0,0.07)' }} onClick={() => onToggle(c.id)} title={isActive ? 'Pause' : 'Resume'}>
          {isActive ? <Pause size={11} /> : <Play size={11} />}
        </button>
      </div>
    </motion.div>
  );
}
