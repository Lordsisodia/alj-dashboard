'use client';

import { motion } from 'framer-motion';

export function SkeletonRow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      {[0.3, 0.45, 0.2, 0.5].map((opacity, i) => (
        <motion.div
          key={i}
          className="h-3 rounded"
          animate={{ opacity: [opacity, opacity + 0.2, opacity] }}
          transition={{ duration: 1.4 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
          style={{ backgroundColor: '#f3f4f6', flex: i === 2 ? 1 : 'none', width: i === 2 ? 'auto' : i === 1 ? '40%' : i === 0 ? 10 : 50 }}
        />
      ))}
    </motion.div>
  );
}
