'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp } from '../../../constants';
import type { Candidate } from '../../../types';
import { fmtViews } from './discoveryUtils';

function heatColor(ratio: number): string {
  if (ratio >= 2.0) return '#dc2626';
  if (ratio >= 1.5) return '#b91c1c';
  if (ratio >= 1.0) return 'rgba(153,27,27,0.55)';
  return 'rgba(127,29,29,0.22)';
}

function ratioAvatarStyle(ratio: number): { bg: string; text: string } {
  if (ratio >= 2.0) return { bg: 'rgba(220,38,38,0.12)', text: '#dc2626' };
  if (ratio >= 1.5) return { bg: 'rgba(185,28,28,0.10)', text: '#b91c1c' };
  if (ratio >= 1.0) return { bg: 'rgba(153,27,27,0.09)', text: '#991b1b' };
  return { bg: 'rgba(127,29,29,0.07)', text: '#7f1d1d' };
}

function NichePill({ niche }: { niche: string }) {
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[8px] font-bold flex-shrink-0"
      style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}
    >
      {niche}
    </span>
  );
}

function RatioChip({ ratio }: { ratio: number }) {
  const hot   = ratio >= 2.0;
  const color = ratio >= 2.0 ? '#dc2626' : ratio >= 1.5 ? '#b91c1c' : ratio >= 1.0 ? '#991b1b' : '#7f1d1d';
  return (
    <div
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-bold tabular-nums flex-shrink-0"
      style={{
        backgroundColor: `${color}12`,
        color,
        boxShadow: hot ? `0 0 8px ${color}40` : undefined,
      }}
    >
      {hot && <span className="text-[8px]">&#9889;</span>}
      {ratio.toFixed(2)}&times;
    </div>
  );
}

interface CandidateRowProps {
  candidate: Candidate;
  isSelected: boolean;
  isEvaluating?: boolean;
  onSelect: () => void;
}

export function CandidateRow({ candidate, isSelected, isEvaluating = false, onSelect }: CandidateRowProps) {
  const av    = ratioAvatarStyle(candidate.outlierRatio);
  const isHot = candidate.outlierRatio >= 2.0;

  return (
    <motion.div
      variants={fadeUp}
      onClick={onSelect}
      className={cn(
        'relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all overflow-hidden',
        isSelected ? '' : 'hover:bg-[rgba(220,38,38,0.02)]',
      )}
      style={{
        backgroundColor: isSelected ? 'rgba(220,38,38,0.04)' : '#fff',
        border: isSelected ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(0,0,0,0.06)',
        borderLeft: `2px solid ${heatColor(candidate.outlierRatio)}`,
        boxShadow: isHot ? '0 2px 12px rgba(220,38,38,0.1)' : undefined,
      }}
      whileHover={{ y: -1, boxShadow: `0 4px 16px rgba(220,38,38,${isHot ? '0.15' : '0.06'})`, transition: { duration: 0.12 } }}
    >
      {/* Oracle evaluation scan sweep */}
      <AnimatePresence>
        {isEvaluating && (
          <motion.div
            key="scan"
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Scan line */}
            <motion.div
              className="absolute inset-y-0 w-24"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.18) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '600%'] }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
            {/* Top edge highlight */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.5), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{ backgroundColor: av.bg, color: av.text }}
      >
        {candidate.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-xs font-semibold text-neutral-800 truncate">{candidate.handle}</p>
          <NichePill niche={candidate.niche} />
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
          <span>{candidate.followers}</span>
          <span className="text-neutral-200">·</span>
          <span>{fmtViews(candidate.avgViews)} views</span>
        </div>
      </div>

      <RatioChip ratio={candidate.outlierRatio} />
    </motion.div>
  );
}
