'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, AlertCircle, Radio,
  BellRing, ShieldAlert, XCircle, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaff } from '../context/StaffContext';
import { EMPLOYEES, getInitials, getAvatarColor } from '../constants';

type LateLevel = 'on-time' | 'grace' | 'warning' | 'alert' | 'critical' | 'recurring';

interface EscalationRule {
  level: LateLevel;
  minutes: string;
  badge: string;
  badgeClass: string;
  icon: React.ReactNode;
  description: string;
  notification: string | null;
}

const RULES: EscalationRule[] = [
  {
    level: 'on-time',
    minutes: '0 min',
    badge: 'On time',
    badgeClass: 'bg-green-100 text-green-600 border border-green-200',
    icon: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
    description: 'Clocked in at or before scheduled time',
    notification: null,
  },
  {
    level: 'grace',
    minutes: '1–3 min',
    badge: 'Grace',
    badgeClass: 'bg-green-100 text-green-600 border border-green-200',
    icon: <Clock className="w-3.5 h-3.5 text-green-500" />,
    description: 'Within grace period — no action needed',
    notification: null,
  },
  {
    level: 'warning',
    minutes: '4–7 min',
    badge: 'Warning',
    badgeClass: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
    description: 'Late flag posted to group — monitor',
    notification: null,
  },
  {
    level: 'alert',
    minutes: '8–14 min',
    badge: 'Alert',
    badgeClass: 'bg-orange-100 text-orange-600 border border-orange-200',
    icon: <AlertCircle className="w-3.5 h-3.5 text-orange-500" />,
    description: 'Orange alert badge — escalate if continues',
    notification: null,
  },
  {
    level: 'critical',
    minutes: '15+ min',
    badge: 'Critical',
    badgeClass: 'bg-red-100 text-red-600 border border-red-200 animate-pulse',
    icon: <Radio className="w-3.5 h-3.5 text-red-500" />,
    description: 'Red critical badge — Alex notified immediately',
    notification: 'Alex notified',
  },
  {
    level: 'recurring',
    minutes: '3× this month',
    badge: '3 lates',
    badgeClass: 'bg-red-100 text-red-600 border border-red-200',
    icon: <BellRing className="w-3.5 h-3.5 text-red-500" />,
    description: '3rd late this month — alert sent to Alex',
    notification: 'Alex notified',
  },
  {
    level: 'recurring',
    minutes: '5× this month',
    badge: 'CRITICAL',
    badgeClass: 'bg-red-200 text-red-700 border border-red-300 font-bold text-xs',
    icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" />,
    description: '5th late this month — urgent follow-up required',
    notification: 'Critical alert to Alex',
  },
];

function EscalationRow({ rule }: { rule: EscalationRule }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-black/5 bg-neutral-50/50"
    >
      <div className="shrink-0">{rule.icon}</div>
      <div className="w-20 shrink-0">
        <span className="text-neutral-600 text-xs font-medium">{rule.minutes}</span>
      </div>
      <div className="shrink-0">
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold', rule.badgeClass)}>
          {rule.badge}
        </span>
      </div>
      <p className="text-neutral-500 text-xs flex-1">{rule.description}</p>
      {rule.notification ? (
        <span className="text-[10px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100 shrink-0">
          {rule.notification}
        </span>
      ) : (
        <span className="text-[10px] text-neutral-300 shrink-0">—</span>
      )}
    </motion.div>
  );
}

interface EmployeeLateCardProps {
  employeeId: string;
  lateCount: number;
  isLateNow?: boolean;
  lateMinutes?: number;
}

function EmployeeLateCard({ employeeId, lateCount, isLateNow, lateMinutes }: EmployeeLateCardProps) {
  const emp = EMPLOYEES.find(e => e.id === employeeId);
  if (!emp || emp.isOwnerPartner) return null;

  let level: LateLevel = 'on-time';
  if (isLateNow) {
    if (lateMinutes && lateMinutes >= 15) level = 'critical';
    else if (lateMinutes && lateMinutes >= 8) level = 'alert';
    else if (lateMinutes && lateMinutes >= 4) level = 'warning';
    else level = 'grace';
  } else if (lateCount >= 3) {
    level = 'recurring';
  }

  const rule = RULES.find(r => r.level === level) ?? RULES[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-black/5 bg-white hover:border-black/10 transition-colors"
    >
      {/* Avatar */}
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', getAvatarColor(employeeId))}>
        {getInitials(emp.name)}
      </div>

      {/* Name + details */}
      <div className="flex-1 min-w-0">
        <p className="text-neutral-800 text-xs font-medium">{emp.name}</p>
        <p className="text-neutral-400 text-[10px]">{emp.dept}</p>
      </div>

      {/* Late count badge */}
      {lateCount > 0 ? (
        <div className={cn(
          'text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
          lateCount >= 5 ? 'bg-red-100 text-red-600 border-red-200' :
          lateCount >= 3 ? 'bg-orange-100 text-orange-600 border-orange-200' :
          'bg-yellow-100 text-yellow-700 border-yellow-200'
        )}>
          {lateCount}L this month
        </div>
      ) : (
        <div className="flex items-center gap-1 text-green-500 shrink-0">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">Clean</span>
        </div>
      )}

      {/* Current status */}
      {isLateNow ? (
        <div className="flex items-center gap-1 text-xs font-semibold text-red-500 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {lateMinutes}m late
        </div>
      ) : lateCount === 0 ? (
        <span className="text-[10px] text-neutral-300 shrink-0">On time</span>
      ) : null}
    </motion.div>
  );
}

export function LateEscalationDisplay() {
  const { lateCounts, activeShifts } = useStaff();

  const lateData = [
    { employeeId: 'yss_a', isLateNow: false },
    { employeeId: 'mikeee', isLateNow: false },
    { employeeId: 'kristine', isLateNow: false },
    { employeeId: 'sofia', isLateNow: false },
    { employeeId: 'dhene', isLateNow: false },
    { employeeId: 'macy', isLateNow: false },
    { employeeId: 'jack', isLateNow: false },
    { employeeId: 'aria', isLateNow: false },
  ].map(d => ({
    ...d,
    lateCount: lateCounts[d.employeeId] ?? 0,
    shift: activeShifts.get(d.employeeId),
    lateMinutes: activeShifts.get(d.employeeId)?.lateMinutes,
  }));

  return (
    <div className="space-y-6">
      {/* Escalation rules table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-pink-500" />
            <p className="text-sm font-semibold text-neutral-900">Late Escalation Rules</p>
          </div>
          <p className="text-neutral-400 text-[10px] mt-1">Automatic escalation — no manual intervention required</p>
        </div>
        <div className="p-4 space-y-2">
          {RULES.map(rule => (
            <EscalationRow key={`${rule.level}-${rule.minutes}`} rule={rule} />
          ))}
        </div>
      </div>

      {/* Per-employee late counts */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-semibold text-neutral-900">Monthly Late Count</p>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {lateData.map(({ employeeId, lateCount, isLateNow }) => (
            <EmployeeLateCard
              key={employeeId}
              employeeId={employeeId}
              lateCount={lateCount}
              isLateNow={isLateNow}
            />
          ))}
        </div>
      </div>

      {/* Critical banner */}
      {Object.values(lateCounts).some(c => c >= 5) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-red-600 font-semibold text-sm">5th Late This Month — Immediate Follow-up Required</p>
            <p className="text-red-400/70 text-xs mt-0.5">Critical alert has been sent to Alex via Telegram</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
