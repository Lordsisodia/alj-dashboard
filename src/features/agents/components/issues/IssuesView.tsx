'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { Plus, CircleDot } from 'lucide-react';
import { IssueRow } from './IssueRow';
import { IssueCreateModal } from './IssueCreateModal';
import type { IssueStatus } from '../../types';

const FILTERS: { id: string; label: string; statuses: string[] }[] = [
  { id: 'All',     label: 'All',     statuses: [] },
  { id: 'Active',  label: 'Active',  statuses: ['todo', 'in_progress', 'in_review', 'blocked'] },
  { id: 'Backlog', label: 'Backlog', statuses: ['backlog'] },
  { id: 'Done',    label: 'Done',    statuses: ['done'] },
];

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

export function IssuesView() {
  const issues = useQuery(api.issues.list);
  const updateStatus = useMutation(api.issues.updateStatus);
  const seed = useMutation(api.issues.seed);
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (issues !== undefined && issues.length === 0) seed().catch(() => {});
  }, [issues, seed]);

  const rows = issues ?? [];

  const counts: Record<string, number> = {
    All: rows.length,
    Active: rows.filter(i => ['todo', 'in_progress', 'in_review', 'blocked'].includes(i.status)).length,
    Backlog: rows.filter(i => i.status === 'backlog').length,
    Done: rows.filter(i => i.status === 'done').length,
  };

  const filtered = rows
    .filter(i => {
      const f = FILTERS.find(f => f.id === filter)!;
      return f.statuses.length === 0 || f.statuses.includes(i.status);
    })
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));

  const inProgressCount = rows.filter(i => i.status === 'in_progress').length;
  const blockedCount = rows.filter(i => i.status === 'blocked').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(74,158,255,0.1),rgba(131,58,180,0.1))', border: '1px solid rgba(74,158,255,0.2)' }}>
            <CircleDot size={15} style={{ color: '#4a9eff' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Issues</h3>
            <p className="text-[11px] text-neutral-400">
              {inProgressCount} in progress{blockedCount > 0 ? ` · ${blockedCount} blocked` : ''}
            </p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #4a9eff, #833ab4)', boxShadow: '0 2px 8px rgba(74,158,255,0.3)' }}>
          <Plus size={12} /> New Issue
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5">
        {FILTERS.map(f => {
          const active = filter === f.id;
          const count = counts[f.id] ?? 0;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={active
                ? { background: 'linear-gradient(135deg,#4a9eff,#833ab4)', color: '#fff', boxShadow: '0 2px 8px rgba(74,158,255,0.25)' }
                : { backgroundColor: 'rgba(0,0,0,0.04)', color: '#888', border: '1px solid rgba(0,0,0,0.08)' }}>
              {f.label}
              <span className="text-[9px] px-1 rounded-full"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', color: active ? '#fff' : '#666' }}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Issue list */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {/* Column headers */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-neutral-100">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 w-24">Status</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 w-14">ID</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 flex-1">Title</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 hidden lg:block w-24">Assignee</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 w-16">Priority</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 w-8">Age</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <CircleDot size={24} className="text-neutral-200" />
            <p className="text-sm text-neutral-400">No issues in this view.</p>
            <button onClick={() => setShowCreate(true)} className="text-xs font-semibold text-blue-500 hover:text-blue-700">
              Create one →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {filtered.map(issue => (
              <IssueRow key={issue._id} issue={issue}
                onStatusChange={status => updateStatus({ id: issue._id as Id<'issues'>, status: status as IssueStatus })} />
            ))}
          </div>
        )}
      </motion.div>

      {showCreate && <IssueCreateModal onClose={() => setShowCreate(false)} />}
    </motion.div>
  );
}
