'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ActiveShift, ShiftEvent, ShiftStatus } from '../types';
import { EMPLOYEES } from '../constants';

interface StaffContextValue {
  currentUserId: string;
  activeShifts: Map<string, ActiveShift>;
  events: ShiftEvent[];
  lateCounts: Record<string, number>;
  now: Date;
  isLive: boolean;
  connectedStatus: 'connected' | 'connecting' | 'offline';
  startShift: (employeeId: string) => void;
  startBreak: (employeeId: string) => void;
  endBreak: (employeeId: string) => void;
  finishShift: (employeeId: string) => void;
  addEvent: (event: Omit<ShiftEvent, 'id' | 'timestamp'>) => void;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const currentUserId = 'alex';

  const [activeShifts, setActiveShifts] = useState<Map<string, ActiveShift>>(() => {
    const now = new Date();
    const m = new Map<string, ActiveShift>();

    m.set('sofia', {
      employeeId: 'sofia',
      clockInTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 5, 0),
      status: 'on-shift',
      lateMinutes: 5,
    });

    m.set('kristine', {
      employeeId: 'kristine',
      clockInTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0),
      breakStartTime: new Date(now.getTime() - 10 * 60000),
      status: 'on-break',
    });

    m.set('mikeee', {
      employeeId: 'mikeee',
      clockInTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 2, 0),
      status: 'on-shift',
    });

    return m;
  });

  const [events, setEvents] = useState<ShiftEvent[]>(() => {
    const now = new Date();
    return [
      {
        id: 'e1', employeeId: 'yss_a', employeeName: 'Yssa', type: 'start',
        timestamp: new Date(now.getTime() - 8 * 3600000), color: 'green',
      },
      {
        id: 'e2', employeeId: 'mikeee', employeeName: 'Mikeee', type: 'start',
        timestamp: new Date(now.getTime() - 8 * 3600000 + 120000), color: 'green',
      },
      {
        id: 'e3', employeeId: 'sofia', employeeName: 'Sofia', type: 'late',
        timestamp: new Date(now.getTime() - 7 * 3600000), details: '5m late', color: 'red',
      },
      {
        id: 'e4', employeeId: 'sofia', employeeName: 'Sofia', type: 'start',
        timestamp: new Date(now.getTime() - 7 * 3600000 + 300000), color: 'green',
      },
      {
        id: 'e5', employeeId: 'kristine', employeeName: 'Kristine', type: 'start',
        timestamp: new Date(now.getTime() - 8 * 3600000), color: 'green',
      },
      {
        id: 'e6', employeeId: 'kristine', employeeName: 'Kristine', type: 'break-start',
        timestamp: new Date(now.getTime() - 10 * 60000), color: 'yellow',
      },
      {
        id: 'e7', employeeId: 'jack', employeeName: 'Jack', type: 'finish',
        timestamp: new Date(now.getTime() - 2 * 3600000), details: '8h 2m', color: 'green',
      },
      {
        id: 'e8', employeeId: 'macy', employeeName: 'Macy', type: 'start',
        timestamp: new Date(now.getTime() - 6 * 3600000), color: 'green',
      },
      {
        id: 'e9', employeeId: 'aria', employeeName: 'Aria', type: 'finish',
        timestamp: new Date(now.getTime() - 4 * 3600000), details: '7h 58m', color: 'green',
      },
      {
        id: 'e10', employeeId: 'sofia', employeeName: 'Sofia', type: 'leave-request',
        timestamp: new Date(now.getTime() - 3 * 3600000), details: 'Personal — Friday', color: 'yellow',
      },
    ];
  });

  const [lateCounts] = useState<Record<string, number>>(() => ({
    yss_a: 1, sofia: 2, kristine: 3, jack: 1,
    macy: 0, mikeee: 0, dhene: 0, aria: 0,
  }));

  const [now, setNow] = useState(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const addEvent = useCallback((event: Omit<ShiftEvent, 'id' | 'timestamp'>) => {
    const newEvent: ShiftEvent = { ...event, id: `e${Date.now()}`, timestamp: new Date() };
    setEvents(prev => [newEvent, ...prev]);
  }, []);

  const startShift = useCallback((employeeId: string) => {
    const emp = EMPLOYEES.find(e => e.id === employeeId);
    if (!emp) return;
    const shift: ActiveShift = { employeeId, clockInTime: new Date(), status: 'on-shift' };
    setActiveShifts(prev => { const m = new Map(prev); m.set(employeeId, shift); return m; });
    addEvent({ employeeId, employeeName: emp.name, type: 'start', color: 'green' });
  }, [addEvent]);

  const startBreak = useCallback((employeeId: string) => {
    const emp = EMPLOYEES.find(e => e.id === employeeId);
    if (!emp) return;
    setActiveShifts(prev => {
      const m = new Map(prev);
      const existing = m.get(employeeId);
      if (existing) m.set(employeeId, { ...existing, breakStartTime: new Date(), status: 'on-break' });
      return m;
    });
    addEvent({ employeeId, employeeName: emp.name, type: 'break-start', color: 'yellow' });
  }, [addEvent]);

  const endBreak = useCallback((employeeId: string) => {
    const emp = EMPLOYEES.find(e => e.id === employeeId);
    if (!emp) return;
    setActiveShifts(prev => {
      const m = new Map(prev);
      const existing = m.get(employeeId);
      if (existing) m.set(employeeId, { ...existing, breakEndTime: new Date(), status: 'on-shift' });
      return m;
    });
    addEvent({ employeeId, employeeName: emp.name, type: 'break-end', color: 'green' });
  }, [addEvent]);

  const finishShift = useCallback((employeeId: string) => {
    const emp = EMPLOYEES.find(e => e.id === employeeId);
    if (!emp) return;
    setActiveShifts(prev => {
      const nm = new Map(prev);
      const existing = nm.get(employeeId);
      if (existing) {
        const out = new Date();
        const totalMs = out.getTime() - existing.clockInTime.getTime();
        const totalMin = Math.round(totalMs / 60000);
        const hh = Math.floor(totalMin / 60);
        const mm = totalMin % 60;
        nm.set(employeeId, { ...existing, clockOutTime: out, status: 'finished' as ShiftStatus });
        addEvent({ employeeId, employeeName: emp.name, type: 'finish', color: 'green', details: `${hh}h ${mm}m` });
      }
      return nm;
    });
  }, [addEvent]);

  return (
    <StaffContext.Provider value={{
      currentUserId, activeShifts, events, lateCounts, now,
      isLive: true, connectedStatus: 'connected',
      startShift, startBreak, endBreak, finishShift, addEvent,
    }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff(): StaffContextValue {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
}
