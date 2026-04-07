'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { Plus, Pause, Play, Archive, Repeat, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { RoutineCreateModal } from './RoutineCreateModal';

const STATUS_CFG = {
  active:   { dot: '#78c257', label: 'Active',   pill: 'rgba(120,194,87,0.12)',  text: '#4a8a2d' },
  paused:   { dot: '#fbbf24', label: 'Paused',   pill: 'rgba(251,191,36,0.12)', text: '#b45309' },
  archived: { dot: '#d1d5db', label: 'Archived', pill: 'rgba(209,213,219,0.3)', text: '#9ca3af' },
} as const;

const RUN_STATUS_CFG = {
  succeeded: { icon: CheckCircle2, color: '#78c257' },
  failed:    { icon: XCircle,      color: '#ff0069' },
};

function timeAgo(ts?: number) {
  if (!ts) return null;
  const diff = Date.now() - ts;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function RoutinesView() {
  const routines = useQuery(api.routines.list);
  const setStatus = useMutation(api.routines.setStatus);
  const seed = useMutation(api.routines.seed);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (routines !== undefined && routines.length === 0) seed().catch(() => {});
  }, [routines, seed]);

  const rows = routines ?? [];
  const activeCount = rows.filter(r => r.status === 'active').length;
  const pausedCount = rows.filter(r => r.status === 'paused').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(255,0,105,0.1),rgba(131,58,180,0.1))', border: '1px solid rgba(131,58,180,0.15)' }}>
          <Repeat size={15} style={{ color: '#833ab4' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Routines</h3>
          <p className="text-[11px] text-neutral-400">{activeCount} active · {pausedCount} paused</p>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-3">
          {Object.entries(STATUS_CFG).map(([key, cfg]) => {
            const count = rows.filter(r => r.status === key).length;
            if (count === 0) return null;
            return (
              <span key={key} className="flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: cfg.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                {count} {cfg.label}
              </span>
            );
          })}
          <button onClick={() => setShowCreate(true)}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all hover:brightness-110 active:scale-95 text-white"
            style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)', boxShadow: '0 1px 4px rgba(255,0,105,0.25)' }}>
            <Plus size={10} /> New
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Repeat size={24} className="text-neutral-200" />
            <p className="text-sm text-neutral-400">No routines yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {rows.map(r => {
              const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.paused;
              const ago = timeAgo(r.lastRunAt);
              const RunIcon = r.lastRunStatus ? RUN_STATUS_CFG[r.lastRunStatus as keyof typeof RUN_STATUS_CFG]?.icon : null;
              const runColor = r.lastRunStatus ? RUN_STATUS_CFG[r.lastRunStatus as keyof typeof RUN_STATUS_CFG]?.color : undefined;

              return (
                <div key={r._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/60 transition-colors group">
                  {/* Status + name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{r.title}</p>
                      {r.description && (
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5 max-w-[240px]">{r.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Agent */}
                  <span className="text-[11px] text-neutral-500 truncate max-w-[140px] flex-shrink-0 hidden md:block">
                    {r.assigneeAgent ?? '-'}
                  </span>

                  {/* Last run */}
                  <div className="flex-shrink-0 w-28 hidden lg:block">
                    {ago ? (
                      <div className="flex items-center gap-1">
                        {RunIcon && <RunIcon size={10} style={{ color: runColor }} />}
                        <span className="text-[11px] text-neutral-500">{ago}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Clock size={10} />
                        <span className="text-[11px]">Never</span>
                      </div>
                    )}
                    {r.lastRunStatus && (
                      <p className="text-[9px] font-semibold mt-0.5" style={{ color: runColor ?? '#888' }}>
                        {r.lastRunStatus}
                      </p>
                    )}
                  </div>

                  {/* Toggle */}
                  <button role="switch" aria-checked={r.status === 'active'}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                    style={{ backgroundColor: r.status === 'active' ? '#ff0069' : '#e5e7eb' }}
                    onClick={() => setStatus({ id: r._id as Id<'routines'>, status: r.status === 'active' ? 'paused' : 'active' })}>
                    <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                      style={{ transform: r.status === 'active' ? 'translateX(18px)' : 'translateX(2px)' }} />
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title={r.status === 'active' ? 'Pause' : 'Resume'}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-700"
                      onClick={() => setStatus({ id: r._id as Id<'routines'>, status: r.status === 'active' ? 'paused' : 'active' })}>
                      {r.status === 'active' ? <Pause size={11} /> : <Play size={11} />}
                    </button>
                    <button title="Archive"
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-700"
                      onClick={() => setStatus({ id: r._id as Id<'routines'>, status: 'archived' })}>
                      <Archive size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {showCreate && <RoutineCreateModal onClose={() => setShowCreate(false)} />}
    </motion.div>
  );
}
