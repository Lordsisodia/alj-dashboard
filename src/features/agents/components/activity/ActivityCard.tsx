'use client';

import { motion } from 'framer-motion';
import { Bot, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import type { AgentTask } from '../../types';
import { TYPE_COLOR, fadeUp } from '../../constants';

export function ActivityCard({ task }: { task: AgentTask }) {
  const isRunning = task.status === 'running';

  const statusConfig = {
    running: {
      label: 'Running',
      icon: <Loader2 size={12} className="animate-spin" />,
      bg: 'rgba(74,158,255,0.12)',
      color: '#1d6eb5',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 size={12} />,
      bg: 'rgba(120,194,87,0.12)',
      color: '#4a8a2d',
    },
    failed: {
      label: 'Failed',
      icon: <XCircle size={12} />,
      bg: 'rgba(220,38,38,0.1)',
      color: '#dc2626',
    },
  }[task.status];

  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl space-y-3"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${TYPE_COLOR[task.type]}18` }}
          >
            <Bot size={14} style={{ color: TYPE_COLOR[task.type] }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{task.agentName}</p>
            <div
              className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
              style={{ backgroundColor: `${TYPE_COLOR[task.type]}18`, color: TYPE_COLOR[task.type] }}
            >
              {task.type}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
          style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
        >
          {isRunning && (
            <span className="relative flex h-1.5 w-1.5 mr-0.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: statusConfig.color }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: statusConfig.color }}
              />
            </span>
          )}
          {statusConfig.icon}
          {statusConfig.label}
        </div>
      </div>

      <p className="text-xs text-neutral-600">{task.description}</p>

      {isRunning && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Progress</span>
            <span className="text-[10px] font-semibold text-neutral-700">{task.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #ff0069, #833ab4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>
      )}

      <div
        className="px-3 py-2 rounded-lg text-[11px] text-neutral-500 font-mono leading-relaxed"
        style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        {task.outputPreview}
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400">
        <span>Started {task.startedAt}</span>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{task.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}
