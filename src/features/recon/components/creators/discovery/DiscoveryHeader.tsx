'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Play, Zap, Check, Clock, Users, ChevronDown, CalendarClock, TrendingUp, ScanSearch, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniStat } from './MiniStat';
import { ALERT_THRESHOLDS } from './discoveryData';

const SCHEDULE_OPTIONS = [
  { value: 3,  label: 'Every 3h'  },
  { value: 6,  label: 'Every 6h'  },
  { value: 12, label: 'Every 12h' },
  { value: 24, label: 'Every 24h' },
];

interface Props {
  total: number;
  pending: number;
  approved: number;
  approvedToday: number;
  candidatesScraped: number;
  contentScraped: number;
  alertThreshold: number;
  discovering: boolean;
  scheduleHours: number;
  onAlertChange: (v: number) => void;
  onScheduleChange: (v: number) => void;
  onRunDiscovery: () => void;
}

export function DiscoveryHeader({
  total, pending, approved, approvedToday, candidatesScraped, contentScraped,
  alertThreshold, discovering, scheduleHours, onAlertChange, onScheduleChange, onRunDiscovery,
}: Props) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setScheduleOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scheduleLabel = SCHEDULE_OPTIONS.find(o => o.value === scheduleHours)?.label ?? `Every ${scheduleHours}h`;

  return (
    <div className="space-y-3">
      {/* Title + actions row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Discovery Pipeline</h2>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-neutral-400">
            <Clock size={10} />
            <span>Last run: 2h ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Schedule picker */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setScheduleOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
              <CalendarClock size={12} style={{ color: '#dc2626' }} />
              {scheduleLabel}
              <ChevronDown size={11} className={cn('transition-transform duration-150', scheduleOpen && 'rotate-180')} />
            </button>
            {scheduleOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 z-50 rounded-xl bg-white shadow-lg py-1 min-w-[120px]"
                style={{ border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                {SCHEDULE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { onScheduleChange(opt.value); setScheduleOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs transition-colors',
                      opt.value === scheduleHours
                        ? 'font-semibold text-neutral-900 bg-neutral-50'
                        : 'text-neutral-500 hover:bg-neutral-50',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Run button */}
          <button
            onClick={onRunDiscovery}
            disabled={discovering}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-70 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
          >
            {discovering
              ? <><Loader2 size={13} className="animate-spin" /> Discovering</>
              : <><Play size={13} /> Run Now</>}
          </button>
        </div>
      </div>

      {/* Stats + alert row */}
      <div className="flex items-center gap-3">
        <MiniStat label="Total candidates"  value={total}    icon={<Users size={15} />} color="#7f1d1d" />
        <MiniStat label="Pending review"    value={pending}  icon={<Clock size={15} />} color="#f59e0b" />
        <MiniStat label="Approved to track" value={approved} icon={<Check size={15} />} color="#78c257" />

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white flex-shrink-0 ml-auto"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          title="Alert when outlier ratio spikes above this threshold"
        >
          <Zap size={13} className="text-amber-500 flex-shrink-0" />
          <span className="text-[10px] text-neutral-500 whitespace-nowrap">Alert at</span>
          <div className="flex items-center gap-0.5">
            {ALERT_THRESHOLDS.map(t => (
              <button
                key={t.value}
                onClick={() => onAlertChange(t.value)}
                className={cn(
                  'px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors',
                  alertThreshold === t.value ? 'text-white' : 'text-neutral-400 hover:text-neutral-600',
                )}
                style={alertThreshold === t.value ? { background: 'linear-gradient(135deg, #f59e0b, #f97316)' } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Secondary pills row */}
      <div className="flex items-center gap-2">
        <StatPill icon={<TrendingUp size={10} />} value={approvedToday}     label="approved today"     color="#991b1b" />
        <StatPill icon={<ScanSearch  size={10} />} value={candidatesScraped} label="candidates scraped"  color="#7f1d1d" />
        <StatPill icon={<FileStack  size={10} />} value={contentScraped}    label="content pieces"     color="#7f1d1d" large />
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
