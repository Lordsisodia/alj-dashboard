'use client';

import { motion } from 'framer-motion';
import { Sparkles, Star, ArrowRight } from 'lucide-react';

interface Props {
  unanalysedCount: number;
  unratedCount:    number;
  onGoAnalysis:    () => void;
  onGoHub:         () => void;
}

export function ActionQueue({ unanalysedCount, unratedCount, onGoAnalysis, onGoHub }: Props) {
  if (unanalysedCount === 0 && unratedCount === 0) return null;

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide flex-shrink-0">Actions needed</p>

      {unanalysedCount > 0 && (
        <button
          onClick={onGoAnalysis}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #833ab4, #4a9eff)' }}
        >
          <Sparkles size={11} />
          {unanalysedCount} posts need analysis
          <ArrowRight size={10} />
        </button>
      )}

      {unratedCount > 0 && (
        <button
          onClick={onGoHub}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#374151', backgroundColor: '#fff' }}
        >
          <Star size={11} />
          {unratedCount} posts unrated
          <ArrowRight size={10} />
        </button>
      )}
    </motion.div>
  );
}
