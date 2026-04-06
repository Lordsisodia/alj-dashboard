'use client';

import { Bot, FileText, Calendar, ShieldCheck, CircleDot, DollarSign, Clock } from 'lucide-react';

const ACTION_VERBS: Record<string, string> = {
  'agent.checked_out': 'checked out',
  'agent.completed': 'completed',
  'agent.failed': 'failed on',
  'report.generated': 'generated',
  'schedule.created': 'scheduled',
  'approval.requested': 'requested approval on',
  'issue.updated': 'updated',
  'cost.recorded': 'recorded cost for',
};

const ACTION_ICON: Record<string, React.ElementType> = {
  'agent': Bot,
  'report': FileText,
  'schedule': Calendar,
  'approval': ShieldCheck,
  'issue': CircleDot,
  'cost': DollarSign,
};

const ACTION_COLOR: Record<string, { bg: string; color: string }> = {
  'agent.completed':        { bg: 'rgba(120,194,87,0.12)',   color: '#4a8a2d' },
  'agent.failed':           { bg: 'rgba(255,0,105,0.10)',    color: '#cc0054' },
  'agent.checked_out':      { bg: 'rgba(74,158,255,0.12)',   color: '#1d6eb5' },
  'report.generated':       { bg: 'rgba(131,58,180,0.10)',   color: '#5a1f8a' },
  'schedule.created':       { bg: 'rgba(251,191,36,0.12)',   color: '#b45309' },
  'approval.requested':     { bg: 'rgba(251,191,36,0.12)',   color: '#b45309' },
  'issue.updated':          { bg: 'rgba(131,58,180,0.10)',   color: '#5a1f8a' },
  'cost.recorded':          { bg: 'rgba(120,194,87,0.10)',   color: '#4a8a2d' },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function getActionIcon(action: string): React.ElementType {
  const prefix = action.split('.')[0];
  return ACTION_ICON[prefix] ?? Bot;
}

interface Event { id: string; actorName: string; action: string; target: string; timestamp: number; }

export function ActivityLogList({ events, compact }: { events: Event[]; compact?: boolean }) {
  if (events.length === 0) return (
    <div className="flex flex-col items-center py-6 gap-2">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
        <Clock size={14} className="text-neutral-300" />
      </div>
      <p className="text-xs text-neutral-400">No activity yet.</p>
    </div>
  );

  return (
    <div className="divide-y divide-neutral-100">
      {events.map(e => {
        const Icon = getActionIcon(e.action);
        const style = ACTION_COLOR[e.action] ?? { bg: 'rgba(74,158,255,0.10)', color: '#1d6eb5' };
        return (
          <div key={e.id} className={`flex items-start gap-2.5 ${compact ? 'py-2' : 'py-3'}`}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: style.bg }}>
              <Icon size={11} style={{ color: style.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${compact ? 'text-[11px]' : 'text-xs'} text-neutral-700 leading-relaxed`}>
                <span className="font-semibold text-neutral-900">{e.actorName}</span>
                <span className="text-neutral-400"> {ACTION_VERBS[e.action] ?? e.action.replace(/[._]/g, ' ')} </span>
                <span className="text-neutral-600">{e.target}</span>
              </p>
            </div>
            <span className="text-[10px] text-neutral-400 flex-shrink-0 mt-0.5 tabular-nums">{timeAgo(e.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
