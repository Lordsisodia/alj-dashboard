'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';

const SCORE_WEIGHTS = [
  { label: 'Engagement rate', pct: '40%' },
  { label: 'Follower count',  pct: '30%' },
  { label: 'Post frequency',  pct: '20%' },
  { label: 'Growth trend',    pct: '10%' },
];

export function ScoreColumnHeader() {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center gap-1 cursor-default select-none"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Score</span>
      <Eye size={10} className="text-neutral-300" />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 z-50 w-56 rounded-xl p-3.5 pointer-events-none"
            style={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}
          >
            <p className="text-xs font-semibold text-white mb-1.5">Leaderboard Score</p>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">Weighted 0–100 signal indicating how valuable this creator is to study.</p>
            <div className="space-y-1.5">
              {SCORE_WEIGHTS.map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">{row.label}</span>
                  <span className="text-[11px] font-semibold text-neutral-200">{row.pct}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
