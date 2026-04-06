'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCw, Radio, CalendarClock, BarChart2 } from 'lucide-react';
import type { AgentTask, AgentType, AgentStatus } from '../../types';
import { TYPE_COLOR, fadeUp } from '../../constants';

interface ActivityCardProps { task: AgentTask; onRetry?: () => void; }

const TYPE_ICON: Record<AgentType, React.ReactNode> = {
  Scraper:   <Radio size={14} />,
  Scheduler: <CalendarClock size={14} />,
  Analyst:   <BarChart2 size={14} />,
};

const STATUS_CFG: Record<AgentStatus, { label: string; icon: React.ReactNode; bg: string; color: string }> = {
  running:   { label: 'Running',   icon: <Loader2 size={12} className="animate-spin" />, bg: 'rgba(74,158,255,0.12)',  color: '#1d6eb5' },
  completed: { label: 'Completed', icon: <CheckCircle2 size={12} />,                     bg: 'rgba(120,194,87,0.12)', color: '#4a8a2d' },
  failed:    { label: 'Failed',    icon: <XCircle size={12} />,                           bg: 'rgba(220,38,38,0.10)',  color: '#dc2626' },
};

function LiveDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5 mr-0.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: color }} />
    </span>
  );
}

export function ActivityCard({ task, onRetry }: ActivityCardProps) {
  const isRunning = task.status === 'running';
  const isFailed  = task.status === 'failed';
  const color     = TYPE_COLOR[task.type];
  const sc        = STATUS_CFG[task.status];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl overflow-hidden flex"
      style={{
        backgroundColor: '#fff',
        border:    isFailed ? '1px solid rgba(220,38,38,0.18)' : '1px solid rgba(0,0,0,0.07)',
        boxShadow: isFailed ? '0 2px 8px rgba(220,38,38,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      whileHover={{ y: -1, boxShadow: isFailed ? '0 4px 12px rgba(220,38,38,0.12)' : '0 4px 12px rgba(0,0,0,0.08)', transition: { duration: 0.16 } }}
    >
      <div style={{ width: 3, flexShrink: 0, backgroundColor: isFailed ? '#dc2626' : color }} />

      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18`, color }}>
              {TYPE_ICON[task.type]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-900 truncate">{task.agentName}</p>
              <div className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ backgroundColor: `${color}18`, color }}>
                {task.type}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
            {isRunning && <LiveDot color={sc.color} />}
            {sc.icon}<span className="ml-0.5">{sc.label}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">{task.description}</p>

        {isRunning && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">Progress</span>
              <span className="text-[10px] font-semibold text-neutral-700">{task.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}, #833ab4)` }}
                initial={{ width: 0 }} animate={{ width: `${task.progress}%` }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
          </div>
        )}

        <div className="px-3 py-2 rounded-lg text-[11px] text-neutral-500 font-mono leading-relaxed"
          style={{ backgroundColor: isFailed ? 'rgba(220,38,38,0.03)' : '#fafafa', border: isFailed ? '1px solid rgba(220,38,38,0.1)' : '1px solid rgba(0,0,0,0.05)' }}>
          {task.outputPreview}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">Started {task.startedAt}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
              <Clock size={10} /><span>{task.duration}</span>
            </div>
            {isFailed && onRetry && (
              <button onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:brightness-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                <RefreshCw size={11} /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
