'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Radar, ShieldCheck, Loader2, ExternalLink, Pause, Play } from 'lucide-react';
import { COMPETITORS, DAILY_VOLUME, containerVariants, fadeUp } from '../../constants';
import type { Competitor } from '../../types';
import { StatCard }       from './StatCard';
import { VolumeChart }    from './VolumeChart';
import { PipelineFunnel } from './PipelineFunnel';
import { ActivityFeed }   from './ActivityFeed';

// ─── Job badge config ─────────────────────────────────────────────────────────

const JOB_BADGE = {
  idle:    { label: 'Idle',    bg: 'rgba(0,0,0,0.04)',      color: '#9ca3af', dot: '#d1d5db' },
  running: { label: 'Running', bg: 'rgba(74,158,255,0.10)', color: '#2563eb', dot: '#4a9eff' },
  failed:  { label: 'Failed',  bg: 'rgba(220,38,38,0.08)',  color: '#dc2626', dot: '#dc2626' },
} as const;

// ─── Creator pipeline row ─────────────────────────────────────────────────────

const DAILY_TARGET = 65; // soft daily posts target for bar width

function CreatorPipelineRow({ c, onToggle }: { c: Competitor; onToggle: (id: number) => void }) {
  const isActive  = c.status === 'active';
  const badge     = JOB_BADGE[c.jobStatus];
  const barPct    = Math.min((c.postsToday / DAILY_TARGET) * 100, 100);
  const isPaused  = c.status === 'paused';
  const isFailed  = c.jobStatus === 'failed';

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', opacity: isPaused ? 0.65 : 1 }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
        style={{ backgroundColor: c.avatarColor }}
      >
        {c.initials}
      </div>

      {/* Handle + niche */}
      <div className="flex items-center gap-1.5 w-44 flex-shrink-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{c.handle}</p>
        <div
          className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: c.nicheColor }}
        >
          {c.niche}
        </div>
      </div>

      {/* Progress bar + count */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barPct}%` }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full rounded-full"
            style={{
              background: isFailed
                ? '#dc2626'
                : isPaused
                ? '#d1d5db'
                : `linear-gradient(90deg, ${c.nicheColor}cc, ${c.nicheColor})`,
            }}
          />
        </div>
        <span className="text-xs font-bold text-neutral-900 w-6 text-right flex-shrink-0">
          {c.postsToday}
        </span>
      </div>

      {/* Status badge */}
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
        style={{ backgroundColor: badge.bg, color: badge.color }}
      >
        {c.jobStatus === 'running' ? (
          <Loader2 size={9} className="animate-spin" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
        )}
        {badge.label}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isActive && (
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <ExternalLink size={10} />
            View
          </button>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          onClick={() => onToggle(c.id)}
          title={isActive ? 'Pause' : 'Resume'}
        >
          {isActive ? <Pause size={11} /> : <Play size={11} />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Log Dashboard (V3) ───────────────────────────────────────────────────────

export function LogDashboard() {
  const [competitors, setCompetitors] = useState<Competitor[]>(COMPETITORS);

  const postsToday  = competitors.filter(c => c.status === 'active').reduce((s, c) => s + c.postsToday, 0);
  const activeCount = competitors.filter(c => c.status === 'active').length;
  const failedCount = competitors.filter(c => c.jobStatus === 'failed').length;
  const successRate = Math.round(((competitors.length - failedCount) / competitors.length) * 100);

  // Sort: active first by postsToday desc, then paused/failed at bottom
  const sorted = [...competitors].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return b.postsToday - a.postsToday;
  });

  function toggleStatus(id: number) {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
  }

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full space-y-4">

      {/* Pipeline Funnel — full width */}
      <PipelineFunnel />

      {/* Stat cards — full width */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Posts today"     value={String(postsToday)}                       sub="across all active creators"                  icon={<Database size={15} />}    iconColor="#4a9eff" delay={0}    />
        <StatCard label="Active creators" value={`${activeCount} / ${competitors.length}`} sub={`${competitors.length - activeCount} paused`} icon={<Radar size={15} />}       iconColor="#833ab4" delay={0.07} />
        <StatCard label="Success rate"    value={`${successRate}%`}                         sub="last 24 hours"                               icon={<ShieldCheck size={15} />} iconColor="#78c257" delay={0.14} />
      </div>

      {/* Two-column: left = chart + pipeline, right = activity feed */}
      <div className="flex gap-4 items-start">

        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-4">
          <VolumeChart data={DAILY_VOLUME} />

          {/* Creator pipeline */}
          <div className="rounded-xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p className="text-sm font-semibold text-neutral-900">Creator pipeline</p>
              <span className="text-[11px] text-neutral-400">
                {activeCount} of {competitors.length} scraped today
              </span>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-3 space-y-1.5">
              {sorted.map(c => (
                <CreatorPipelineRow key={c.id} c={c} onToggle={toggleStatus} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right column — activity feed */}
        <div className="w-72 flex-shrink-0">
          <ActivityFeed />
        </div>

      </div>
    </div>
  );
}
