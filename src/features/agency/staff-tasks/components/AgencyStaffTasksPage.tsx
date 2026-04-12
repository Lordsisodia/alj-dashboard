'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Table2, Plus, CheckSquare } from 'lucide-react';
import type { Task, TaskStatus, TaskView } from '../types';
import { TaskBoard } from './TaskBoard';
import { TaskListView } from './TaskListView';
import { TaskTableView } from './TaskTableView';
import { CreateTaskModal } from './CreateTaskModal';
import { SEED_TASKS } from '../constants';

const VIEWS: { id: TaskView; label: string; Icon: React.ElementType }[] = [
  { id: 'board',  label: 'Board',  Icon: LayoutGrid },
  { id: 'list',   label: 'List',   Icon: List },
  { id: 'table',  label: 'Table',  Icon: Table2 },
];

function TaskStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t =>
    t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
  ).length;
  const today = tasks.filter(t => t.frequency === 'daily' || t.dueDate === new Date().toISOString().split('T')[0]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="px-5 py-3 flex items-center gap-6 border-b border-neutral-200 flex-shrink-0 bg-white">
      {[
        { label: 'Total', value: total, color: '#1f2937' },
        { label: 'Done', value: done, color: '#10b981' },
        { label: 'Overdue', value: overdue, color: '#ef4444' },
        { label: "Today's", value: today, color: '#3b82f6' },
      ].map(stat => (
        <div key={stat.label} className="flex items-center gap-1.5">
          <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
          <span className="text-xs text-neutral-500">{stat.label}</span>
        </div>
      ))}

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-neutral-200">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#10b981' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-semibold text-neutral-500 flex-shrink-0">{pct}% complete</span>
      </div>
    </div>
  );
}

export function AgencyStaffTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [view, setView] = useState<TaskView>('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const handleToggle = useCallback((taskId: string, newStatus: 'done' | 'todo') => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updated = { ...t, status: newStatus as TaskStatus };
      if (newStatus === 'done') {
        updated.completedAt = new Date().toISOString();
      } else {
        updated.completedAt = undefined;
      }
      return updated;
    }));
  }, []);

  const handleSave = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: `t-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    }
  }, [editingTask]);

  const openCreate = (status: TaskStatus = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 h-14 flex-shrink-0 bg-white"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <span className="text-neutral-400"><CheckSquare size={20} /></span>
        <span className="text-sm font-semibold text-neutral-900 whitespace-nowrap">Tasks</span>
        <div
          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
        >
          {tasks.length} tasks
        </div>
        <div className="flex-1" />

        {/* View switcher */}
        <div
          className="flex items-center rounded-xl p-1 gap-0.5 bg-neutral-100 border border-neutral-200"
        >
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: view === id ? '#ffffff' : 'transparent',
                color: view === id ? '#1f2937' : '#6b7280',
                boxShadow: view === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Icon size={13} />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* New Task */}
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Plus size={13} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Board / List / Table */}
      <div className="flex-1 overflow-hidden px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {view === 'board' && (
              <TaskBoard
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={openEdit}
                onAddTask={openCreate}
              />
            )}
            {view === 'list' && (
              <TaskListView
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={openEdit}
              />
            )}
            {view === 'table' && (
              <TaskTableView
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={openEdit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <CreateTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
