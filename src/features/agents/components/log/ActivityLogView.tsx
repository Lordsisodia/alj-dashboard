'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { ActivityLogList } from './ActivityLogList';
import { History } from 'lucide-react';

const FILTERS = [
  { id: 'All',      label: 'All' },
  { id: 'agent',    label: 'Agents' },
  { id: 'report',   label: 'Reports' },
  { id: 'schedule', label: 'Schedules' },
  { id: 'approval', label: 'Approvals' },
  { id: 'issue',    label: 'Issues' },
  { id: 'cost',     label: 'Costs' },
];

export function ActivityLogView() {
  const log = useQuery(api.agents.getActivityLog);
  const seedLog = useMutation(api.agents.seedActivityLog);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (log !== undefined && log.length === 0) seedLog().catch(() => {});
  }, [log, seedLog]);

  const filtered = (log ?? []).filter(e =>
    filter === 'All' || e.action.startsWith(filter)
  );

  const counts: Record<string, number> = { All: (log ?? []).length };
  for (const e of log ?? []) {
    const prefix = e.action.split('.')[0];
    counts[prefix] = (counts[prefix] ?? 0) + 1;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Filter chips */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map(f => {
          const count = counts[f.id] ?? 0;
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
              style={active
                ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff', boxShadow: '0 2px 8px rgba(255,0,105,0.25)' }
                : { backgroundColor: 'rgba(0,0,0,0.04)', color: '#888', border: '1px solid rgba(0,0,0,0.08)' }}>
              {f.label}
              {count > 0 && (
                <span className="text-[9px] px-1 rounded-full"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', color: active ? '#fff' : '#666' }}>
                  {f.id === 'All' ? count : counts[f.id] ?? 0}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Log list */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={13} className="text-neutral-400" />
            <span className="text-xs font-bold text-neutral-700">Event Log</span>
          </div>
          <span className="text-[11px] text-neutral-400">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="px-5 py-1 max-h-[520px] overflow-y-auto">
          <ActivityLogList events={filtered.map(e => ({ ...e, id: e._id }))} />
        </div>
      </motion.div>
    </motion.div>
  );
}
