'use client';

import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

export function ExpertsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,0,105,0.07)', border: '1px solid rgba(255,0,105,0.12)' }}
      >
        <Bookmark size={28} style={{ color: '#ff0069' }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-900">No saved content yet</p>
        <p className="text-xs text-neutral-400 mt-1">Start saving from the Feed.</p>
      </div>
      <button
        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        Browse Feed
      </button>
    </motion.div>
  );
}
