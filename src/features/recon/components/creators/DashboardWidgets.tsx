'use client';

import { useState } from 'react';
import { X, Play, UserPlus, Download } from 'lucide-react';
import { SEED_CANDIDATES } from './discovery/discoveryData';
import { COMPETITORS } from '../../constants';

// ── Viral Alert Banner ────────────────────────────────────────────────────────

export function ViralAlertBanner({ onDismiss }: { onDismiss: () => void }) {
  const viralCount = SEED_CANDIDATES.filter(c => c.outlierRatio >= 2.0).length;
  if (viralCount === 0) return null;

  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-2.5"
      style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
    >
      <span className="text-sm font-medium text-amber-700">
        🔥 {viralCount} new viral signal{viralCount > 1 ? 's' : ''} detected - view in Discovery
      </span>
      <button
        onClick={onDismiss}
        className="ml-4 text-amber-500 hover:text-amber-700 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Top Performer Card ────────────────────────────────────────────────────────

export function TopPerformerCard() {
  const top = [...COMPETITORS].sort((a, b) => b.postsToday - a.postsToday)[0];
  if (!top) return null;

  return (
    <div
      className="flex items-center gap-4 rounded-xl bg-white px-4 py-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${top.avatarColor}, #833ab4)` }}
      >
        {top.initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-neutral-900 truncate">{top.displayName}</p>
        <p className="text-[11px] text-neutral-400 truncate">{top.handle}</p>
      </div>

      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ color: top.nicheColor, background: `${top.nicheColor}18` }}
      >
        {top.niche}
      </span>

      <div className="text-center flex-shrink-0">
        <p
          className="text-lg font-bold leading-none"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {top.postsToday}
        </p>
        <p className="text-[10px] text-neutral-400 mt-0.5">posts today</p>
      </div>

      <button
        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        View
      </button>
    </div>
  );
}

// ── Quick Actions Row ─────────────────────────────────────────────────────────

export function QuickActionsRow({ onRunAll }: { onRunAll: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRunAll}
        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        <Play size={11} />
        Run All Scrapers
      </button>

      <button
        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#333' }}
      >
        <UserPlus size={11} />
        Add Creator
      </button>

      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg opacity-40 cursor-not-allowed"
          style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#333' }}
        >
          <Download size={11} />
          Export CSV
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex">
          <span className="text-[10px] bg-neutral-800 text-white px-2 py-1 rounded-md whitespace-nowrap">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
