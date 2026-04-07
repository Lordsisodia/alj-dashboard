'use client';

import { Check, Clock, Users, Zap, TrendingUp, ScanSearch, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniStat } from './MiniStat';
import { ALERT_THRESHOLDS } from './discoveryData';

interface Props {
  total: number;
  pending: number;
  approved: number;
  approvedToday: number;
  candidatesScraped: number;
  contentScraped: number;
  alertThreshold: number;
  onAlertChange: (v: number) => void;
}

export function DiscoveryHeader({
  total, pending, approved, approvedToday, candidatesScraped, contentScraped,
  alertThreshold, onAlertChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Stats + alert row */}
      <div className="flex items-center gap-3">
        <MiniStat label="Total candidates"  value={total}    icon={<Users size={15} />} color="#7f1d1d" />
        <MiniStat label="Pending review"    value={pending}  icon={<Clock size={15} />} color="#f59e0b" />
        <MiniStat label="Approved to track" value={approved} icon={<Check size={15} />} color="#78c257" />
      </div>

      {/* Secondary pills row */}
      <div className="flex items-center gap-2">
        <StatPill icon={<TrendingUp size={10} />} value={approvedToday}     label="approved today"    color="#991b1b" />
        <StatPill icon={<ScanSearch  size={10} />} value={candidatesScraped} label="candidates scraped" color="#7f1d1d" />
        <StatPill icon={<FileStack  size={10} />} value={contentScraped}    label="content pieces"    color="#7f1d1d" large />
      </div>
    </div>
  );
}

function StatPill({ icon, value, label, color, large }: { icon: React.ReactNode; value: number; label: string; color: string; large?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color }}>
        {large ? value.toLocaleString() : value.toLocaleString()}
      </span>
      <span className="text-[10px] text-neutral-400">{label}</span>
    </div>
  );
}
