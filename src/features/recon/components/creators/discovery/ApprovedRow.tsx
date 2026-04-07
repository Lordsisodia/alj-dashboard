'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Loader2 } from 'lucide-react';

interface Props {
  candidate: {
    handle: string;
    displayName: string;
    niche: string;
    initials: string;
    avatarColor: string;
    outlierRatio: number;
    followersRaw: number;
    engagementRate: string;
  };
  index?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onScrapeComplete?: (relatedHandles: string[]) => void;
  onScrapeStart?: () => void;
  onScrapeEnd?: () => void;
  isScraping?: boolean;
}

function ScrapeButton({ handle, onScrapeComplete, onScrapeStart, onScrapeEnd }: {
  handle: string;
  onScrapeComplete?: (related: string[]) => void;
  onScrapeStart?: () => void;
  onScrapeEnd?: () => void;
}) {
  const [scraping, setScraping] = useState(false);

  async function handleScrape(e: React.MouseEvent) {
    e.stopPropagation();
    setScraping(true);
    onScrapeStart?.();
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ handle }),
      });
      setScraping(false);
      onScrapeEnd?.();
      if (!res.ok) { const err = await res.json().catch(() => ({})); console.error('[scrape] failed', res.status, err); return; }
      const data = await res.json();
      if (data.relatedHandles?.length) onScrapeComplete?.(data.relatedHandles);
    } catch (err) {
      console.error('Scrape failed', err);
      setScraping(false);
      onScrapeEnd?.();
    }
  }

  return (
    <button
      onClick={handleScrape}
      disabled={scraping}
      className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-[9px] font-semibold transition-all hover:brightness-110 disabled:opacity-50 flex-shrink-0"
      style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
    >
      {scraping ? <Loader2 size={8} className="animate-spin" /> : <ExternalLink size={8} />}
      Scrape
    </button>
  );
}

function getTierRing(ratio: number): string {
  if (ratio >= 2) return ratio >= 5 ? '#16a34a' : '#d97706';
  return 'transparent';
}

function ShimmerCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      {/* Shimmer skeleton */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        animate={{ backgroundColor: ['#d1d5db', '#e5e7eb', '#d1d5db'] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="w-5 h-5 rounded flex-shrink-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ backgroundColor: '#f3f4f6' }}
      />
      <motion.div
        className="h-3 flex-1 rounded"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        style={{ backgroundColor: '#f3f4f6' }}
      />
      <motion.div
        className="w-12 h-3 rounded flex-shrink-0"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
        style={{ backgroundColor: '#f3f4f6' }}
      />
    </motion.div>
  );
}

export function ApprovedRow({ candidate, index = 0, isSelected, onSelect, onScrapeComplete, onScrapeStart, onScrapeEnd, isScraping }: Props) {
  const ringColor = getTierRing(candidate.outlierRatio);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const spring = { stiffness: 300, damping: 30 };

  function handleMouseMove(e: React.MouseEvent) {
    if (isScraping) return;
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

  const motionDiv = (
    <motion.div
      ref={cardRef}
      layout
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        isScraping
          ? { opacity: [1, 0.6], scale: [1, 0.97] }
          : { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }
      }
      whileHover={!isScraping ? { y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' } : {}}
      transition={
        isScraping
          ? { duration: 0.3 }
          : { layout: { duration: 0.15 }, rotateX: spring, rotateY: spring }
      }
      style={{
        perspective: 600,
        transformOrigin: 'center center',
        border: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
      }}
      className="relative overflow-hidden flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer"
    >
      {/* Green ripple burst on scrape start */}
      <AnimatePresence>
        {isScraping && (
          <motion.div
            key="ripple"
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
          />
        )}
      </AnimatePresence>

      {/* Status dot — amber for approved/awaiting scrape */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        animate={isScraping ? { backgroundColor: '#16a34a', scale: [1, 1.5, 1] } : { backgroundColor: '#d97706' }}
        transition={{ duration: 0.25 }}
      />

      {/* Avatar with tier ring */}
      <div
        className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{
          backgroundColor: 'rgba(153,27,27,0.08)',
          color: '#991b1b',
          boxShadow: `0 0 0 1.5px ${ringColor}`,
        }}
      >
        {candidate.initials}
      </div>

      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{candidate.handle}</p>
      <ScrapeButton
        handle={candidate.handle}
        onScrapeComplete={onScrapeComplete}
        onScrapeStart={onScrapeStart}
        onScrapeEnd={onScrapeEnd}
      />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {motionDiv}
    </motion.div>
  );
}
