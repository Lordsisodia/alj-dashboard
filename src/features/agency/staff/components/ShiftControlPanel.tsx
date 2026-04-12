'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Coffee, CheckSquare, LogOut, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaff } from '../context/StaffContext';
import { getInitials, getAvatarColor } from '../constants';

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function ShiftControlPanel() {
  const { currentUserId, activeShifts, startShift, startBreak, endBreak, finishShift, now } = useStaff();
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    if (!activeShifts.get(currentUserId)) return;
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [currentUserId, activeShifts]);

  const shift = activeShifts.get(currentUserId);
  const isOnShift = shift?.status === 'on-shift';
  const isOnBreak = shift?.status === 'on-break';
  const isFinished = shift?.status === 'finished';

  function handleAction(action: () => void, id: string) {
    setAnimatingId(id);
    action();
    setTimeout(() => setAnimatingId(null), 400);
  }

  const nowMs = isOnShift || isOnBreak ? tick : now.getTime();
  const elapsed = shift
    ? nowMs - shift.clockInTime.getTime() - (shift.breakEndTime && shift.breakStartTime
        ? shift.breakEndTime.getTime() - shift.breakStartTime.getTime()
        : 0)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
            getAvatarColor(currentUserId)
          )}>
            {getInitials(currentUserId)}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Your Shift</p>
            <p className="text-xs text-neutral-400 capitalize">
              {isOnShift ? 'Active' : isOnBreak ? 'On Break' : isFinished ? 'Finished' : 'Not started'}
            </p>
          </div>
        </div>
      </div>

      {/* Status display */}
      <div className="px-4 py-4 space-y-4">
        <AnimatePresence mode="wait">
          {!shift || isFinished ? (
            <motion.div
              key="not-started"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3 py-6"
            >
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="text-center">
                <p className="text-neutral-700 text-sm font-medium">No active shift</p>
                <p className="text-neutral-400 text-xs mt-1">Start your shift to begin tracking</p>
              </div>
            </motion.div>
          ) : isOnBreak ? (
            <motion.div
              key="on-break"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-2 py-4"
            >
              <div className="w-14 h-14 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                <Coffee className="w-7 h-7 text-yellow-600" />
              </div>
              <p className="text-yellow-600 text-sm font-semibold">On Break</p>
              <p className="text-neutral-400 text-xs">
                Since {formatTime(shift.breakStartTime!)}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="on-shift"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-2 py-4"
            >
              <div className="relative">
                <div className={cn('w-14 h-14 rounded-full border-2 flex items-center justify-center', getAvatarColor(currentUserId), 'opacity-80')}>
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-white" />
              </div>
              <p className="text-neutral-900 text-sm font-semibold">
                On shift — {formatDuration(elapsed)}
              </p>
              <p className="text-neutral-400 text-xs">
                Started at {formatTime(shift.clockInTime)}
                {shift.lateMinutes ? (
                  <span className="ml-2 text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Late by {shift.lateMinutes}m
                  </span>
                ) : null}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="space-y-2">
          {!shift || isFinished ? (
            <button
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white py-2.5 transition-all active:scale-95',
                'bg-gradient-to-r from-pink-500 to-purple-500 shadow-sm',
                animatingId === 'start' && 'scale-95 opacity-80'
              )}
              onClick={() => handleAction(() => startShift(currentUserId), 'start')}
            >
              <Play className="w-4 h-4" />
              Start Shift
            </button>
          ) : (
            <>
              {isOnShift && (
                <button
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-2.5 transition-all active:scale-95',
                    'border-2 border-yellow-400 text-yellow-600 bg-yellow-50 hover:bg-yellow-100',
                    animatingId === 'break' && 'scale-95 opacity-80'
                  )}
                  onClick={() => handleAction(() => startBreak(currentUserId), 'break')}
                >
                  <Coffee className="w-4 h-4" />
                  Start Break
                </button>
              )}
              {isOnBreak && (
                <button
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-2.5 transition-all active:scale-95',
                    'border-2 border-green-400 text-green-600 bg-green-50 hover:bg-green-100',
                    animatingId === 'endbreak' && 'scale-95 opacity-80'
                  )}
                  onClick={() => handleAction(() => endBreak(currentUserId), 'endbreak')}
                >
                  <CheckSquare className="w-4 h-4" />
                  End Break
                </button>
              )}
              <button
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-2.5 transition-all active:scale-95',
                  'border-2 border-red-400 text-red-500 bg-red-50 hover:bg-red-100',
                  animatingId === 'finish' && 'scale-95 opacity-80'
                )}
                onClick={() => handleAction(() => finishShift(currentUserId), 'finish')}
              >
                <LogOut className="w-4 h-4" />
                Finish Shift
              </button>
            </>
          )}
        </div>

        {/* Completed summary */}
        {isFinished && shift?.clockOutTime && (
          <div className="rounded-xl px-3 py-3 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
            <p className="text-xs text-neutral-400 mb-1">Shift completed</p>
            <p className="text-neutral-900 font-semibold text-lg">
              {formatDuration(shift.clockOutTime.getTime() - shift.clockInTime.getTime())}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {formatTime(shift.clockInTime)} — {formatTime(shift.clockOutTime)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
