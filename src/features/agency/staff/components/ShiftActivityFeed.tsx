'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Coffee, CheckSquare, LogOut, AlertTriangle, UserX,
  CheckCheck, X, CalendarDays, Repeat, ArrowUpRight, ChevronsDown, ChevronsUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaff } from '../context/StaffContext';
import { getInitials, getAvatarColor } from '../constants';
import type { ShiftEvent } from '../types';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const EVENT_CONFIG: Record<ShiftEvent['type'], {
  borderColor: string;
  bgColor: string;
  textColor: string;
  label: (e: ShiftEvent) => string;
}> = {
  start: {
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    label: (e) => `${e.employeeName} started shift`,
  },
  'break-start': {
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    label: (e) => `${e.employeeName} started break`,
  },
  'break-end': {
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    label: (e) => `${e.employeeName} ended break`,
  },
  finish: {
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    label: (e) => `${e.employeeName} finished shift — ${e.details}`,
  },
  late: {
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
    label: (e) => `${e.employeeName} is ${e.details}`,
  },
  absent: {
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
    label: (e) => `${e.employeeName} is absent`,
  },
  'leave-request': {
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    label: (e) => `${e.employeeName} submitted leave — ${e.details}`,
  },
  'leave-approved': {
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    label: (e) => `${e.employeeName}'s leave approved`,
  },
  'leave-denied': {
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
    label: (e) => `${e.employeeName}'s leave denied`,
  },
  'swap-request': {
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    label: (e) => `${e.employeeName} requested shift swap — ${e.details}`,
  },
};

function EventItem({ event }: { event: ShiftEvent }) {
  const cfg = EVENT_CONFIG[event.type];
  if (!cfg) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-colors',
        cfg.borderColor, cfg.bgColor
      )}
    >
      {/* Avatar */}
      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5', getAvatarColor(event.employeeId))}>
        {getInitials(event.employeeName)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium', cfg.textColor)}>
          {cfg.label(event)}
        </p>
        <p className="text-neutral-400 text-[10px] mt-0.5">{formatRelative(event.timestamp)}</p>
      </div>
    </motion.div>
  );
}

export function ShiftActivityFeed() {
  const { events } = useStaff();
  const [expanded, setExpanded] = useState(false);

  const PAGE = 15;
  const visible = expanded ? events : events.slice(0, PAGE);
  const hasMore = events.length > PAGE;

  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-pink-500" />
            <p className="text-sm font-semibold text-neutral-900">Activity Feed</p>
            {events.length > 0 && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                events.length > 50 ? 'bg-red-100 text-red-500' :
                events.length > 20 ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              )}>
                {events.length}
              </span>
            )}
          </div>
          {hasMore && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {expanded ? (
                <><ChevronsUp className="w-3 h-3" /> Show less</>
              ) : (
                <><ChevronsDown className="w-3 h-3" /> +{events.length - PAGE} more</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Events */}
      <div className="px-4 py-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Play className="w-4 h-4 text-neutral-300" />
            </div>
            <p className="text-neutral-400 text-xs">No shift activity yet today</p>
            <p className="text-neutral-300 text-[10px]">Start a shift to see events appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <AnimatePresence initial={false}>
              {visible.map(event => (
                <EventItem key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
