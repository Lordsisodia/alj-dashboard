'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Candidate } from '../../../types';

type Decision = 'approve' | 'reject' | null;

interface Props {
  candidate: Candidate;
  isSelected: boolean;
  isEvaluating?: boolean;
  onSelect: () => void;
  onApprove?: (e: React.MouseEvent) => void;
  onReject?: (e: React.MouseEvent) => void;
}

export function CandidateRow({ candidate, isSelected, onSelect, onApprove, onReject }: Props) {
  const [decision, setDecision] = useState<Decision>(null);

  function handleApprove(e: React.MouseEvent) {
    e.stopPropagation();
    setDecision('approve');
    setTimeout(() => onApprove?.(e), 350);
  }

  function handleReject(e: React.MouseEvent) {
    e.stopPropagation();
    setDecision('reject');
    setTimeout(() => onReject?.(e), 400);
  }

  const isApproving = decision === 'approve';
  const isRejecting = decision === 'reject';

  return (
    <motion.div
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={
        isApproving
          ? { opacity: [1, 0.5, 0], x: [0, 40, 80], scale: [1, 1.05, 0.8], transition: { duration: 0.35 } }
          : isRejecting
          ? { opacity: [1, 0], scale: [1, 0.95, 0], transition: { duration: 0.4 } }
          : { opacity: 1, y: 0, scale: 1 }
      }
      whileHover={!decision ? { y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer"
      style={{
        backgroundColor: isRejecting
          ? 'rgba(220,38,38,0.08)'
          : isApproving
          ? 'rgba(34,197,94,0.08)'
          : isSelected
          ? 'rgba(220,38,38,0.04)'
          : '#fff',
        border: isRejecting
          ? '1px solid rgba(220,38,38,0.3)'
          : isApproving
          ? '1px solid rgba(34,197,94,0.3)'
          : isSelected
          ? '1px solid rgba(220,38,38,0.2)'
          : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Status dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        animate={isApproving ? { backgroundColor: '#16a34a', scale: [1, 1.4, 1] } : isRejecting ? { backgroundColor: '#dc2626', scale: [1, 1.4, 1] } : { backgroundColor: '#d1d5db' }}
        transition={{ duration: 0.25 }}
      />

      <span
        className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
        style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}
      >
        {candidate.initials}
      </span>
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{candidate.handle}</p>

      {/* Approve */}
      {onApprove && (
        <button
          onClick={handleApprove}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all hover:brightness-110"
          style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
          title="Approve"
        >
          <Check size={9} strokeWidth={3} />
        </button>
      )}

      {/* Reject + block */}
      {onReject && (
        <button
          onClick={handleReject}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all hover:brightness-110"
          style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
          title="Reject & block"
        >
          <X size={9} strokeWidth={3} />
        </button>
      )}

      <a
        href={`https://instagram.com/${candidate.handle.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex-shrink-0 p-1 rounded-lg transition-all hover:brightness-110"
        style={{ color: '#dc2626', backgroundColor: 'rgba(220,38,38,0.06)' }}
        title="View on Instagram"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      </a>
    </motion.div>
  );
}
