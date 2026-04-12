'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaff } from '../context/StaffContext';
import { EMPLOYEES, getInitials, getAvatarColor } from '../constants';

export function ShiftStatusBanner() {
  const { activeShifts, isLive, connectedStatus } = useStaff();
  const now = new Date();

  const onShift: string[] = [];
  const onBreak: string[] = [];
  const late: string[] = [];
  const absent: string[] = [];

  EMPLOYEES.forEach(emp => {
    if (emp.isOwnerPartner) return;
    const shift = activeShifts.get(emp.id);

    if (shift?.status === 'on-shift') {
      if (shift.lateMinutes) {
        late.push(emp.id);
      } else {
        onShift.push(emp.id);
      }
    } else if (shift?.status === 'on-break') {
      onBreak.push(emp.id);
    } else if (emp.shiftStart !== 'Always') {
      const [sh, sm] = emp.shiftStart.split(':').map(Number);
      const shiftTime = new Date(now);
      shiftTime.setHours(sh, sm, 0, 0);
      if (now > shiftTime && now.getHours() < 23) {
        absent.push(emp.id);
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl px-4 py-3 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center gap-4 overflow-x-auto">
        {onShift.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs text-neutral-500 font-medium">On shift:</span>
            <div className="flex -space-x-2">
              {onShift.map(id => {
                const emp = EMPLOYEES.find(e => e.id === id)!;
                return (
                  <div key={id} className="relative" title={`${emp.name} — on shift`}>
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white',
                      getAvatarColor(id)
                    )}>
                      {getInitials(emp.name)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-teal-500 border border-white" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {onBreak.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-yellow-500 text-xs">☕</span>
            <span className="text-xs text-neutral-500 font-medium">Break:</span>
            <div className="flex -space-x-2">
              {onBreak.map(id => {
                const emp = EMPLOYEES.find(e => e.id === id)!;
                return (
                  <div
                    key={id}
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white',
                      getAvatarColor(id)
                    )}
                    title={`${emp.name} — on break`}
                  >
                    {getInitials(emp.name)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {late.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-red-500 text-xs">⚠</span>
            <span className="text-xs text-red-500 font-medium">Late:</span>
            <div className="flex -space-x-2">
              {late.map(id => {
                const emp = EMPLOYEES.find(e => e.id === id)!;
                const shift = activeShifts.get(id);
                return (
                  <div key={id} className="relative" title={`${emp.name} — ${shift?.lateMinutes}m late`}>
                    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">
                      {getInitials(emp.name)}
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {absent.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-neutral-400 text-xs">👤</span>
            <span className="text-xs text-neutral-400 font-medium">Absent:</span>
            <div className="flex -space-x-2">
              {absent.map(id => {
                const emp = EMPLOYEES.find(e => e.id === id)!;
                return (
                  <div
                    key={id}
                    className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-500 ring-2 ring-white"
                    title={`${emp.name} — not clocked in`}
                  >
                    {getInitials(emp.name)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="ml-auto shrink-0 flex items-center gap-1.5">
          {isLive ? (
            <>
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-neutral-400">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-yellow-500">Connecting…</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
