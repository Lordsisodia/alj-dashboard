'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { BOARD_COLUMNS } from '../types';
import { TaskCard } from './TaskCard';
import { STAFF_ROSTER } from '../constants';

interface TaskBoardProps {
  tasks: Task[];
  onToggle: (taskId: string, newStatus: 'done' | 'todo') => void;
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function TaskBoard({ tasks, onToggle, onEdit, onAddTask }: TaskBoardProps) {
  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2">
      {BOARD_COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div key={col.id} className="flex flex-col flex-shrink-0" style={{ width: 288 }}>
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-widest">{col.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: `${col.color}18`, color: col.color }}
                >
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddTask(col.id)}
                className="w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {colTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-neutral-200 bg-neutral-50"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${col.color}12` }}>
                      <Plus size={14} style={{ color: col.color, opacity: 0.5 }} />
                    </div>
                    <p className="text-[11px] text-neutral-400 text-center">No tasks</p>
                    <button
                      onClick={() => onAddTask(col.id)}
                      className="mt-2 text-[11px] font-medium transition-colors hover:underline"
                      style={{ color: col.color }}
                    >
                      + Add task
                    </button>
                  </motion.div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggle}
                      onEdit={onEdit}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
