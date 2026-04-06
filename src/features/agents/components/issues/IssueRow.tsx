'use client';

import { useState, useRef, useEffect } from 'react';
import type { IssueStatus, IssuePriority } from '../../types';
import { ChevronDown, Circle, Loader2, Eye, Ban, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

const STATUS_CONFIG: Record<IssueStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  backlog:     { label: 'Backlog',     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', Icon: BookOpen },
  todo:        { label: 'Todo',        color: '#4a9eff', bg: 'rgba(74,158,255,0.12)',  Icon: Circle },
  in_progress: { label: 'In Progress', color: '#833ab4', bg: 'rgba(131,58,180,0.12)', Icon: Loader2 },
  in_review:   { label: 'In Review',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', Icon: Eye },
  blocked:     { label: 'Blocked',     color: '#ff0069', bg: 'rgba(255,0,105,0.12)',  Icon: Ban },
  done:        { label: 'Done',        color: '#78c257', bg: 'rgba(120,194,87,0.12)', Icon: CheckCircle2 },
};

const PRIORITY_DOT: Record<IssuePriority, string> = {
  low: '#94a3b8', medium: '#fbbf24', high: '#f97316', urgent: '#ff0069',
};
const PRIORITY_BORDER: Record<IssuePriority, string> = {
  low: 'transparent', medium: 'transparent', high: 'rgba(249,115,22,0.4)', urgent: 'rgba(255,0,105,0.4)',
};

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  if (d < 3600000) return `${Math.floor(d / 60000)}m`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h`;
  return `${Math.floor(d / 86400000)}d`;
}

const STATUSES: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'done'];

interface IssueRowProps {
  issue: {
    _id: string; identifier?: string; title: string;
    status: IssueStatus; priority: IssuePriority; assigneeAgent?: string; updatedAt: number;
  };
  onStatusChange: (s: IssueStatus) => void;
}

export function IssueRow({ issue, onStatusChange }: IssueRowProps) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const sc = STATUS_CONFIG[issue.status];
  const { Icon: StatusIcon } = sc;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50/70 transition-colors group"
      style={{ borderLeft: `2px solid ${PRIORITY_BORDER[issue.priority]}` }}>

      {/* Status picker */}
      <div className="relative flex-shrink-0" ref={dropRef}>
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:brightness-95"
          style={{ backgroundColor: sc.bg, color: sc.color }}>
          <StatusIcon size={9} className={issue.status === 'in_progress' ? 'animate-spin' : ''} />
          {sc.label}
          <ChevronDown size={8} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-20 rounded-xl py-1 overflow-hidden"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 140 }}>
            {STATUSES.map(s => {
              const { label, color, Icon: SIcon } = STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => { onStatusChange(s); setOpen(false); }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-[11px] hover:bg-neutral-50 transition-colors"
                  style={{ color, fontWeight: issue.status === s ? 700 : 400 }}>
                  <SIcon size={10} />
                  {label}
                  {issue.status === s && <span className="ml-auto text-[9px] opacity-60">current</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Identifier */}
      <span className="text-[10px] font-mono text-neutral-400 flex-shrink-0 w-14">{issue.identifier}</span>

      {/* Title */}
      <p className="flex-1 text-xs font-medium text-neutral-800 truncate">{issue.title}</p>

      {/* Assignee */}
      {issue.assigneeAgent && (
        <span className="text-[10px] text-neutral-400 truncate hidden lg:block max-w-[110px] flex-shrink-0"
          title={issue.assigneeAgent}>
          {issue.assigneeAgent.split(' ')[0]}
        </span>
      )}

      {/* Priority dot */}
      <span className="flex items-center gap-1 flex-shrink-0" title={issue.priority}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_DOT[issue.priority] }} />
        <span className="text-[10px] text-neutral-400 capitalize">{issue.priority}</span>
      </span>

      {/* Time */}
      <span className="text-[10px] text-neutral-400 flex-shrink-0 tabular-nums">{timeAgo(issue.updatedAt)}</span>
    </div>
  );
}
