'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { TYPE_CONFIG, PRIORITY_CONFIG, BOARD_COLUMNS } from '../types';
import { STAFF_ROSTER, AVATAR_COLORS } from '../constants';

interface TaskTableViewProps {
  tasks: Task[];
  onToggle: (taskId: string, newStatus: 'done' | 'todo') => void;
  onEdit: (task: Task) => void;
}

type SortKey = 'title' | 'employeeId' | 'type' | 'priority' | 'status' | 'dueDate';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (sortKey !== col) return <ChevronUp size={10} className="text-neutral-300 opacity-0 group-hover:opacity-50" />;
  return dir === 'asc'
    ? <ChevronUp size={10} className="text-neutral-500" />
    : <ChevronDown size={10} className="text-neutral-500" />;
}

export function TaskTableView({ tasks, onToggle, onEdit }: TaskTableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortKey === 'employeeId') cmp = a.employeeId.localeCompare(b.employeeId);
    else if (sortKey === 'type') cmp = a.type.localeCompare(b.type);
    else if (sortKey === 'priority') cmp = ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority);
    else if (sortKey === 'status') cmp = BOARD_COLUMNS.findIndex(c => c.id === a.status) - BOARD_COLUMNS.findIndex(c => c.id === b.status);
    else if (sortKey === 'dueDate') {
      const aD = a.dueDate ?? '9999';
      const bD = b.dueDate ?? '9999';
      cmp = aD.localeCompare(bD);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(0);
  };

  const TH = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      onClick={() => toggleSort(col)}
      className="group px-4 py-2.5 text-left cursor-pointer select-none"
    >
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-neutral-700 transition-colors">{label}</span>
        <SortIcon col={col} sortKey={sortKey} dir={sortDir} />
      </div>
    </th>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="overflow-x-auto flex-1 rounded-xl border border-neutral-200 bg-white">
        <table className="w-full">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: '#f9fafb' }}>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-2.5 text-left"><span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">&#x2713;</span></th>
              <TH col="title" label="Task" />
              <TH col="employeeId" label="Assignee" />
              <TH col="type" label="Type" />
              <TH col="priority" label="Priority" />
              <TH col="status" label="Status" />
              <TH col="dueDate" label="Due" />
            </tr>
          </thead>
          <tbody>
            {paged.map((task, i) => {
              const isDone = task.status === 'done';
              const emp = STAFF_ROSTER.find(e => e.id === task.employeeId);
              const typeCfg = TYPE_CONFIG[task.type];
              const priCfg = PRIORITY_CONFIG[task.priority];
              const statusCfg = BOARD_COLUMNS.find(c => c.id === task.status);
              const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onEdit(task)}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); onToggle(task.id, isDone ? 'todo' : 'done'); }}
                      className="w-5 h-5 rounded-md flex items-center justify-center transition-all active:scale-90"
                      style={{
                        backgroundColor: isDone ? 'rgba(16,185,129,0.12)' : 'transparent',
                        border: `1.5px solid ${isDone ? '#10b981' : 'rgba(0,0,0,0.2)'}`,
                      }}
                    >
                      {isDone && <Check size={10} color="#10b981" strokeWidth={3} />}
                    </button>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 max-w-[240px]">
                    <p
                      className="text-sm truncate"
                      style={{ color: isDone ? '#9ca3af' : '#1f2937', textDecoration: isDone ? 'line-through' : 'none' }}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{task.description}</p>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3">
                    {emp ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: AVATAR_COLORS[emp.id] ?? '#6b7280' }}
                        >
                          {emp.name[0]}
                        </div>
                        <span className="text-sm text-neutral-700 whitespace-nowrap">{emp.name}</span>
                      </div>
                    ) : <span className="text-sm text-neutral-400">—</span>}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: typeCfg.color, backgroundColor: typeCfg.bg }}
                    >
                      {typeCfg.label}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priCfg.color }} />
                      <span className="text-xs font-medium" style={{ color: priCfg.color }}>{priCfg.label}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {statusCfg && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={{ color: statusCfg.color, backgroundColor: `${statusCfg.color}18` }}
                      >
                        {statusCfg.label}
                      </span>
                    )}
                  </td>

                  {/* Due */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {task.dueDate ? (
                      <span
                        className="text-xs"
                        style={{ color: isOverdue ? '#ef4444' : '#6b7280' }}
                      >
                        {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {task.dueTime && <> · {task.dueTime}</>}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-white flex-shrink-0 rounded-b-xl">
          <span className="text-xs text-neutral-500">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-40 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-40 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
