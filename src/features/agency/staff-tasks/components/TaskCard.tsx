'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../types';
import { TYPE_CONFIG, PRIORITY_CONFIG } from '../types';
import { STAFF_ROSTER, DEPT_MAP, AVATAR_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string, newStatus: 'done' | 'todo') => void;
  onEdit?: (task: Task) => void;
}

const URGENCY = {
  overdue:  { border: '#ef4444', badge: '#ef4444', badgeBg: 'rgba(239,68,68,0.12)',  icon: AlertCircle },
  today:    { border: '#f59e0b', badge: '#f59e0b', badgeBg: 'rgba(245,158,11,0.12)', icon: Clock },
  week:     { border: '#3b82f6', badge: '#3b82f6', badgeBg: 'rgba(59,130,246,0.10)', icon: Clock },
  none:     { border: 'rgba(0,0,0,0.07)', badge: null, badgeBg: null, icon: null },
} as const;

function getUrgency(dueDate?: string, dueTime?: string, isDone?: boolean) {
  if (!dueDate || isDone) return URGENCY.none;
  const now = new Date();
  const due = new Date(`${dueDate}T${dueTime ?? '23:59'}`);
  const daysUntil = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysUntil < 0)   return URGENCY.overdue;
  if (daysUntil < 1)  return URGENCY.today;
  if (daysUntil < 7)  return URGENCY.week;
  return URGENCY.none;
}

export function TaskCard({ task, onToggle, onEdit }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);
  const isDone = task.status === 'done';
  const typeCfg = TYPE_CONFIG[task.type];
  const priCfg = PRIORITY_CONFIG[task.priority];
  const employee = STAFF_ROSTER.find(e => e.id === task.employeeId);
  const urgency = getUrgency(task.dueDate, task.dueTime, isDone);
  const UrgencyIcon = urgency.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-xl p-3 cursor-pointer select-none transition-all bg-white border border-neutral-200"
      style={{
        opacity: isDone ? 0.7 : 1,
        borderLeft: `3px solid ${urgency.border}`,
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onClick={() => onEdit?.(task)}
    >
      {/* Top row: type badge + priority dot + check */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{ color: typeCfg.color, backgroundColor: typeCfg.bg }}
          >
            {typeCfg.label}
          </span>
          {priCfg.color !== '#10b981' && (
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: priCfg.color }}
              title={`Priority: ${priCfg.label}`}
            />
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onToggle(task.id, isDone ? 'todo' : 'done'); }}
          className="flex items-center justify-center rounded-lg transition-all active:scale-90"
          style={{
            width: 22, height: 22,
            backgroundColor: isDone ? 'rgba(16,185,129,0.12)' : 'transparent',
            border: `1.5px solid ${isDone ? '#10b981' : 'rgba(0,0,0,0.15)'}`,
          }}
          title={isDone ? 'Mark incomplete' : 'Mark complete'}
        >
          {isDone && <Check size={12} style={{ color: '#10b981' }} />}
        </button>
      </div>

      {/* Title */}
      <p
        className="text-sm leading-snug mb-2"
        style={{
          color: isDone ? '#9ca3af' : '#1f2937',
          textDecoration: isDone ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </p>

      {/* Footer: due date urgency + assignee */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {urgency.badge && UrgencyIcon && (
            <span
              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-semibold"
              style={{ color: urgency.badge, backgroundColor: urgency.badgeBg }}
            >
              <UrgencyIcon size={9} />
              {urgency === URGENCY.overdue ? 'OVERDUE' : urgency === URGENCY.today ? 'TODAY' : 'THIS WEEK'}
            </span>
          )}
          {task.dueTime && !urgency.badge && (
            <span
              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded text-neutral-500 bg-neutral-100"
            >
              <Clock size={9} />
              {task.dueTime}
            </span>
          )}
          {task.effortMinutes && (
            <span className="text-[10px] text-neutral-400">~{task.effortMinutes}m</span>
          )}
        </div>

        {employee && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-[9px]"
              style={{ backgroundColor: AVATAR_COLORS[employee.id] ?? '#6b7280' }}
              title={employee.name}
            >
              {employee.name[0]}
            </div>
            <span className="text-[10px] text-neutral-500 truncate max-w-[60px]">{employee.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
