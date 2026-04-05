'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { containerVariants, fadeUp, BOARDS } from '../../constants';
import { BoardCard } from './BoardCard';

export function BoardsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Saved Boards</h3>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Plus size={12} />New Board
        </button>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BOARDS.map(board => <BoardCard key={board.id} board={board} />)}
      </div>
    </motion.div>
  );
}
