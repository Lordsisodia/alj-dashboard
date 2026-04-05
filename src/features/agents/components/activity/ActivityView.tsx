'use client';

import { motion } from 'framer-motion';
import { AGENT_TASKS, containerVariants } from '../../constants';
import { ActivityCard } from './ActivityCard';

export function ActivityView({ filter }: { filter: string }) {
  const filtered = AGENT_TASKS.filter(t => filter === 'all' || t.status === filter);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {filtered.map(task => (
        <ActivityCard key={task.id} task={task} />
      ))}
    </motion.div>
  );
}
