'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Candidate } from '../../../types';

type Decision = 'approve' | 'reject' | null;

interface Props {
  candidate: Candidate;
  isSelected: boolean;
  isEvaluating?: boolean;
  index?: number;
  onSelect: () => void;
  onApprove?: (e: React.MouseEvent) => void;
  onReject?: (e: React.MouseEvent) => void;
  // Enriched data available when flipped
  enrichedData?: {
    followers?: string;
    posts?: string;
    avgViews?: string;
    outlierRatio?: number;
  };
  onFlip?: (handle: string) => void;
}

function Confetti({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const velocity = 40 + Math.random() * 50;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    return (
      <motion.div
        key={i}
        initial={{ x, y, scale: 0, opacity: 1 }}
        animate={{ x: x + dx, y: y + dy, scale: [0, 1, 0.6], opacity: [1, 1, 0] }}
        transition={{ duration: 0.7 + Math.random() * 0.4, ease: 'easeOut' }}
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
    );
  });
  return <>{particles}</>;
}

export function CandidateRow({ candidate, isSelected, index = 0, onSelect, onApprove, onReject, enrichedData, onFlip }: Props) {
  const [decision, setDecision] = useState<Decision>(null);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string } | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const spring = { stiffness: 300, damping: 30 };

  function handleMouseMove(e: React.MouseEvent) {
    if (decision) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rotateX: -dy * 5, rotateY: dx * 5 });
  }
  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  function triggerConfetti(color: string) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) setConfetti({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color });
  }

  function handleApprove(e: React.MouseEvent) {
    e.stopPropagation();
    triggerConfetti('#16a34a');
    setDecision('approve');
    setTimeout(() => onApprove?.(e), 350);
  }

  function handleReject(e: React.MouseEvent) {
    e.stopPropagation();
    triggerConfetti('#dc2626');
    setDecision('reject');
    setTimeout(() => onReject?.(e), 400);
  }

  function handleDoubleClick() {
    setIsFlipped(f => !f);
    onFlip?.(candidate.handle);
  }

  const isApproving = decision === 'approve';
  const isRejecting = decision === 'reject';

  const SWIPE_THRESHOLD = 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Card flip wrapper */}
      <motion.div
        style={{ perspective: 600 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        {/* Front face */}
        <motion.div
          ref={cardRef}
          layout
          onClick={onSelect}
          onDoubleClick={handleDoubleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x > SWIPE_THRESHOLD) { handleApprove({ stopPropagation: () => {} } as React.MouseEvent); }
            else if (info.offset.x < -SWIPE_THRESHOLD) { handleReject({ stopPropagation: () => {} } as React.MouseEvent); }
          }}
          animate={{
            opacity: isApproving ? [1, 0.5, 0] : isRejecting ? [1, 0] : 1,
            x: isApproving ? [0, 0, 60] : isRejecting ? [0, 0] : 0,
            scale: isApproving ? [1, 1.05, 0.8] : isRejecting ? [1, 0.95, 0] : 1,
            rotateX: isApproving || isRejecting || isFlipped ? 0 : tilt.rotateX,
            rotateY: isApproving || isRejecting || isFlipped ? 0 : tilt.rotateY,
          }}
          transition={
            isApproving
              ? { layout: { duration: 0.35 }, opacity: { duration: 0.35 }, x: { duration: 0.35 }, scale: { duration: 0.35 } }
              : isRejecting
              ? { layout: { duration: 0.4 }, opacity: { duration: 0.4 }, scale: { duration: 0.4 } }
              : { layout: { duration: 0.15 }, rotateX: spring, rotateY: spring }
          }
          whileHover={!decision ? { y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' } : {}}
          style={{
            transformOrigin: 'center center',
            backgroundColor: isRejecting ? 'rgba(220,38,38,0.08)' : isApproving ? 'rgba(34,197,94,0.08)' : isSelected ? 'rgba(220,38,38,0.04)' : '#fff',
            border: isRejecting ? '1px solid rgba(220,38,38,0.3)' : isApproving ? '1px solid rgba(34,197,94,0.3)' : isSelected ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(0,0,0,0.06)',
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer"
        >
          {/* Confetti burst */}
          <AnimatePresence>
            {confetti && <Confetti x={confetti.x} y={confetti.y} color={confetti.color} />}
          </AnimatePresence>

          {/* Swipe hint arrows */}
          <AnimatePresence>
            {tilt.rotateY > 2 && (
              <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute -left-1 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}>
                  <Check size={6} className="text-green-600" />
                </div>
              </motion.div>
            )}
            {tilt.rotateY < -2 && (
              <motion.div initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute -right-1 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(220,38,38,0.2)' }}>
                  <X size={6} className="text-red-600" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

          {onApprove && (
            <button
              onClick={handleApprove}
              className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all hover:brightness-110"
              style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
              title="Approve (or swipe right)"
            >
              <Check size={9} strokeWidth={3} />
            </button>
          )}

          {onReject && (
            <button
              onClick={handleReject}
              className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all hover:brightness-110"
              style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
              title="Reject (or swipe left)"
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

        {/* Back face — enriched data */}
        <motion.div
          className="absolute inset-0 rounded-lg px-3 py-2 flex flex-col justify-center"
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            backfaceVisibility: 'hidden',
            rotateY: 180,
          }}
        >
          <p className="text-[10px] font-semibold text-neutral-800 mb-1.5 truncate">{candidate.handle}</p>
          {enrichedData ? (
            <div className="space-y-0.5">
              {enrichedData.followers && (
                <p className="text-[9px] text-neutral-500">Followers: <span className="font-medium text-neutral-700">{enrichedData.followers}</span></p>
              )}
              {enrichedData.posts && (
                <p className="text-[9px] text-neutral-500">Posts: <span className="font-medium text-neutral-700">{enrichedData.posts}</span></p>
              )}
              {enrichedData.avgViews && (
                <p className="text-[9px] text-neutral-500">Avg views: <span className="font-medium text-neutral-700">{enrichedData.avgViews}</span></p>
              )}
              {enrichedData.outlierRatio != null && (
                <p className="text-[9px] text-neutral-500">Outlier: <span className="font-medium text-neutral-700">{enrichedData.outlierRatio.toFixed(2)}×</span></p>
              )}
            </div>
          ) : (
            <p className="text-[9px] text-neutral-400">Double-click to flip</p>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
            className="absolute top-1 right-1 text-neutral-300 hover:text-neutral-500 text-[9px]"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
