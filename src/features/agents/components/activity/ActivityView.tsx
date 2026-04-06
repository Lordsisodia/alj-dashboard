'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { containerVariants, fadeUp } from '../../constants';
import type { AgentTask } from '../../types';
import { ActivityCard } from './ActivityCard';

interface ActivityViewProps {
  tasks: AgentTask[];
  filter: string;
  onRetry: (id: string) => void;
}

export function ActivityView({ tasks, filter, onRetry }: ActivityViewProps) {
  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  if (filtered.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-16 gap-3"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <Bot size={20} style={{ color: '#bbb' }} />
        </div>
        <p className="text-sm font-medium text-neutral-400">
          No {filter === 'all' ? '' : filter} tasks
        </p>
        <p className="text-xs text-neutral-300">
          {filter === 'failed' ? 'All agents are running clean.' : 'Dispatch an agent to get started.'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {filtered.map(task => (
        <ActivityCard
          key={task.id}
          task={task}
          onRetry={task.status === 'failed' ? () => onRetry(task.id) : undefined}
        />
      ))}
    </motion.div>
  );
}
