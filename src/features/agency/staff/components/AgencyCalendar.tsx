'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CalendarDays,
  UserX, AlertCircle, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaff } from '../context/StaffContext';
import { EMPLOYEES, getInitials, getAvatarColor, DEPT_ORDER } from '../constants';
import type { DayStatus } from '../types';

type ViewMode = 'week' | 'month';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDays(base: Date): Date[] {
  const Mon = base.getDay() === 0 ? 6 : base.getDay() - 1;
  const monday = new Date(base);
  monday.setDate(base.getDate() - Mon);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const days: Date[] = [];
  for (let i = start - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length < 42) days.push(new Date(year, month + 1, days.length - last.getDate() - start + 1));
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDayStatus(employeeId: string, date: Date, now: Date): DayStatus | null {
  const emp = EMPLOYEES.find(e => e.id === employeeId);
  if (!emp || emp.isOwnerPartner) return null;
  if (emp.restDay === 'Always') return null;

  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  if (emp.restDay === dayName) {
    return { date, status: 'rest' };
  }

  const key = formatDateKey(date);
  let hash = 0;
  const str = employeeId + key;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const rand = Math.abs(hash) % 100;

  const isToday = isSameDay(date, now);
  const isPast = date < now && !isToday;

  if (isPast) {
    if (rand < 10) {
      return { date, status: 'absent' };
    } else if (rand < 15) {
      const lateMin = (rand % 12) + 4;
      return { date, status: 'late', lateMinutes: lateMin, clockIn: new Date(date), clockOut: new Date(date.getTime() + 8 * 3600000) };
    } else {
      return {
        date, status: 'complete',
        clockIn: new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...emp.shiftStart.split(':').map(Number), 0),
        clockOut: new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...emp.shiftEnd.split(':').map(Number), 0),
        totalHours: 8,
      };
    }
  }

  if (isToday) {
    return { date, status: 'on-shift' };
  }

  return { date, status: 'scheduled' };
}

function getStatusBgColor(status: DayStatus['status']): string {
  switch (status) {
    case 'complete': return 'bg-green-50 border-green-200';
    case 'on-shift': return 'bg-teal-50 border-teal-200';
    case 'scheduled': return 'bg-yellow-50 border-yellow-200';
    case 'rest': return 'bg-neutral-100 border-neutral-200';
    case 'absent': return 'bg-red-50 border-red-200';
    case 'late': return 'bg-red-50 border-red-200';
    default: return 'bg-neutral-50 border-neutral-200';
  }
}

function getStatusDotColor(status: DayStatus['status']): string {
  switch (status) {
    case 'complete': return 'bg-green-500';
    case 'on-shift': return 'bg-teal-500';
    case 'scheduled': return 'bg-yellow-500';
    case 'rest': return 'bg-neutral-400';
    case 'absent': return 'bg-red-500';
    case 'late': return 'bg-red-500';
    default: return 'bg-neutral-400';
  }
}

function getStatusTextColor(status: DayStatus['status']): string {
  switch (status) {
    case 'complete': return 'text-green-600';
    case 'on-shift': return 'text-teal-600';
    case 'scheduled': return 'text-yellow-600';
    case 'rest': return 'text-neutral-400';
    case 'absent': return 'text-red-500';
    case 'late': return 'text-red-500';
    default: return 'text-neutral-500';
  }
}

// ─── Month View ─────────────────────────────────────────────────────────────

function MonthView({ year, month, onNavigate }: { year: number; month: number; onNavigate: (y: number, m: number) => void }) {
  const { now } = useStaff();
  const days = getMonthDays(year, month);

  return (
    <div className="overflow-x-auto">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            className={cn(
              'text-center text-[10px] uppercase tracking-wider font-semibold py-1',
              i >= 5 ? 'text-neutral-400' : 'text-neutral-500'
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, i) => {
          const isToday = isSameDay(day, now);
          const isCurrentMonth = day.getMonth() === month;
          const isWeekend = i % 7 >= 5;

          const dayEmployees = EMPLOYEES.filter(e => !e.isOwnerPartner && e.restDay !== 'Always').map(e => {
            const status = getDayStatus(e.id, day, now);
            return { emp: e, status };
          });

          const onShift = dayEmployees.filter(d => d.status?.status === 'on-shift' || d.status?.status === 'complete');
          const absent = dayEmployees.filter(d => d.status?.status === 'absent' || d.status?.status === 'late');

          return (
            <div
              key={i}
              className={cn(
                'min-h-[88px] rounded-xl p-1.5 transition-colors border',
                isToday ? 'border-pink-400 bg-pink-50/50' : 'border-black/5 bg-white',
                !isCurrentMonth && 'opacity-40',
                isWeekend && !isToday ? 'bg-neutral-50/50' : ''
              )}
            >
              <div className={cn(
                'text-xs font-bold mb-1',
                isToday ? 'text-pink-500' : isCurrentMonth ? 'text-neutral-800' : 'text-neutral-400'
              )}>
                {day.getDate()}
              </div>

              <div className="space-y-0.5">
                {onShift.slice(0, 3).map(({ emp, status }) => (
                  <div
                    key={emp.id}
                    className={cn('flex items-center gap-1 rounded px-1 py-0.5 text-[9px] truncate border', getStatusBgColor(status?.status ?? 'rest'))}
                    title={emp.name}
                  >
                    <div className={cn('w-3 h-3 rounded-full shrink-0', getAvatarColor(emp.id))}>
                      <span className="text-[7px] flex items-center justify-center h-full font-bold text-white">{getInitials(emp.name)}</span>
                    </div>
                    <span className={cn('font-medium', getStatusTextColor(status?.status ?? 'rest'))}>{emp.name.split(' ')[0]}</span>
                  </div>
                ))}
                {onShift.length > 3 && (
                  <div className="text-[9px] text-neutral-400 text-center">+{onShift.length - 3}</div>
                )}
                {absent.map(({ emp }) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-1 rounded px-1 py-0.5 text-[9px] bg-red-50 border border-red-200"
                    title={`${emp.name} — absent`}
                  >
                    <UserX className="w-2.5 h-2.5 text-red-400 shrink-0" />
                    <span className="text-red-400">{emp.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: 'bg-green-100 border-green-200', dot: 'bg-green-500', label: 'Shift complete' },
    { color: 'bg-teal-100 border-teal-200', dot: 'bg-teal-500', label: 'On shift' },
    { color: 'bg-yellow-100 border-yellow-200', dot: 'bg-yellow-500', label: 'Scheduled' },
    { color: 'bg-neutral-100 border-neutral-200', dot: 'bg-neutral-400', label: 'Rest day' },
    { color: 'bg-red-100 border-red-200', dot: 'bg-red-500', label: 'Absent' },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {items.map(({ color, dot, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn('w-3 h-3 rounded border', color)} />
          <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
          <span className="text-[10px] text-neutral-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main AgencyCalendar ─────────────────────────────────────────────────────

export function AgencyCalendar() {
  const { now } = useStaff();
  const [viewMode] = useState<ViewMode>('month');
  const [monthYear, setMonthYear] = useState({ year: now.getFullYear(), month: now.getMonth() });

  function navigateMonth(dir: 1 | -1) {
    const next = monthYear.month + dir;
    if (next > 11) { setMonthYear({ year: monthYear.year + 1, month: 0 }); }
    else if (next < 0) { setMonthYear({ year: monthYear.year - 1, month: 11 }); }
    else { setMonthYear({ ...monthYear, month: next }); }
  }

  function goToday() {
    setMonthYear({ year: now.getFullYear(), month: now.getMonth() });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-pink-500" />
          <h2 className="text-neutral-900 font-semibold text-sm">Staff Calendar</h2>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:border-black/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToday}
            className="px-2.5 py-1 rounded-lg border border-black/10 text-xs text-neutral-500 hover:text-neutral-800 hover:border-black/20 transition-colors font-medium"
          >
            Today
          </button>
          <span className="text-xs text-neutral-800 font-medium min-w-[140px] text-center">
            {new Date(monthYear.year, monthYear.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:border-black/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <Legend />

      {/* Calendar grid */}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <div className="p-4">
          <MonthView year={monthYear.year} month={monthYear.month} onNavigate={(y, m) => setMonthYear({ year: y, month: m })} />
        </div>
      </div>
    </div>
  );
}
