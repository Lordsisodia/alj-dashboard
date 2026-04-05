'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '../../constants';
import type { Board } from '../../types';

export function BoardCard({ board }: { board: Board }) {
  return (
    <motion.div
      variants={fadeUp}
      className="p-4 rounded-xl cursor-pointer hover:shadow-sm transition-shadow"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '2/1' }}>
        {board.colors.map((color, i) => (
          <div key={i} className="w-full h-full" style={{ background: `linear-gradient(135deg, ${color}, ${board.colors[(i + 1) % 4]})` }} />
        ))}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{board.name}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Updated {board.lastUpdated}</p>
        </div>
        <div className="px-2 py-0.5 rounded-lg text-[11px] font-semibold text-neutral-600" style={{ backgroundColor: '#f3f4f6' }}>
          {board.count}
        </div>
      </div>
    </motion.div>
  );
}
