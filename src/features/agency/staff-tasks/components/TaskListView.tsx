'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Task } from '../types';
import { TYPE_CONFIG, PRIORITY_CONFIG } from '../types';
import { STAFF_ROSTER, AVATAR_COLORS } from '../constants';

interface TaskListViewProps {
  tasks: Task[];
  onToggle: (taskId: string, newStatus: 'done' | 'todo') => void;
  onEdit: (task: Task) => void;
}

const DEPT_COLORS: Record<string, string> = {
  'Social Media': '#10b981',
  'Chatters': '#f59e0b',
  'Editing': '#06b6d4',
  'Management': '#8b5cf6',
};

function TaskRow({ task, onToggle, onEdit }: {
  task: Task;
  onToggle: (id: string, s: 'done' | 'todo') => void;
  onEdit: (t: Task) => void;
}) {
  const isDone = task.status === 'done';
  const typeCfg = TYPE_CONFIG[task.type];
  const priCfg = PRIORITY_CONFIG[task.priority];
  const emp = STAFF_ROSTER.find(e => e.id === task.employeeId);
  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      onClick={() => onEdit(task)}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(task.id, isDone ? 'todo' : 'done'); }}
        className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all active:scale-90"
        style={{
          backgroundColor: isDone ? 'rgba(16,185,129,0.12)' : 'transparent',
          border: `1.5px solid ${isDone ? '#10b981' : 'rgba(0,0,0,0.2)'}`,
        }}
      >
        {isDone && <Check size={10} color="#10b981" strokeWidth={3} />}
      </button>

      {/* Priority dot */}
      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priCfg.color }} />

      {/* Task title */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate"
          style={{ color: isDone ? '#9ca3af' : '#1f2937', textDecoration: isDone ? 'line-through' : 'none' }}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-[11px] text-neutral-400 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {/* Type badge */}
      <span
        className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
        style={{ color: typeCfg.color, backgroundColor: typeCfg.bg }}
      >
        {typeCfg.label}
      </span>

      {/* Due */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {task.dueTime && (
          <span
            className="flex items-center gap-1 text-[11px]"
            style={{ color: isOverdue ? '#ef4444' : '#6b7280' }}
          >
            {isOverdue ? <AlertCircle size={10} /> : <Clock size={10} />}
            {task.dueTime}
          </span>
        )}
        {task.dueDate && !task.dueTime && (
          <span className="text-[11px] text-neutral-400">
            {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Assignee */}
      {emp && (
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: AVATAR_COLORS[emp.id] ?? '#6b7280' }}
            title={emp.name}
          >
            {emp.name[0]}
          </div>
          <span className="text-xs text-neutral-500 hidden md:block">{emp.name}</span>
        </div>
      )}

      {/* Effort */}
      {task.effortMinutes && (
        <span className="flex-shrink-0 text-[10px] text-neutral-400">~{task.effortMinutes}m</span>
      )}
    </motion.div>
  );
}

function EmployeeGroup({ empId, tasks, onToggle, onEdit, defaultOpen }: {
  empId: string;
  tasks: Task[];
  onToggle: (id: string, s: 'done' | 'todo') => void;
  onEdit: (t: Task) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const emp = STAFF_ROSTER.find(e => e.id === empId);
  if (!emp) return null;

  const done = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const deptColor = DEPT_COLORS[emp.dept] ?? '#6b7280';

  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white">
      {/* Group header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
      >
        {open ? <ChevronDown size={14} className="text-neutral-400" /> : <ChevronRight size={14} className="text-neutral-400" />}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: AVATAR_COLORS[emp.id] ?? '#6b7280' }}
        >
          {emp.name[0]}
        </div>
        <span className="text-sm font-semibold text-neutral-900">{emp.name}</span>
        <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${deptColor}18`, color: deptColor }}>
          {emp.dept}
        </span>
        <span className="text-[11px] text-neutral-400 ml-auto mr-2">
          {done}/{total} done
        </span>
        {/* Progress bar */}
        <div className="w-16 h-1 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%', backgroundColor: deptColor }}
          />
        </div>
      </button>

      {/* Tasks */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {tasks.length === 0 ? (
              <p className="pl-14 py-2 text-xs text-neutral-400">No tasks assigned</p>
            ) : (
              tasks.map(task => (
                <TaskRow key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TaskListView({ tasks, onToggle, onEdit }: TaskListViewProps) {
  const grouped = STAFF_ROSTER
    .map(emp => ({
      emp,
      tasks: tasks.filter(t => t.employeeId === emp.id),
    }))
    .filter(g => g.tasks.length > 0);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="w-5" />
        <div className="w-1.5" />
        <div className="flex-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Task</div>
        <div className="w-14 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Type</div>
        <div className="w-16 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Due</div>
        <div className="w-28 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Assignee</div>
        <div className="w-8 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Est.</div>
      </div>

      <div className="px-2 pb-4 space-y-2 pt-2">
        {grouped.map(({ emp, tasks: empTasks }) => (
          <EmployeeGroup
            key={emp.id}
            empId={emp.id}
            tasks={empTasks}
            onToggle={onToggle}
            onEdit={onEdit}
            defaultOpen={true}
          />
        ))}
        {grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-400">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
