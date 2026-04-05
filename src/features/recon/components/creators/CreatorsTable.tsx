'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Pause, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPETITORS, containerVariants, fadeUp } from '../../constants';
import type { Competitor } from '../../types';
import { ScoreBadge } from './ScoreBadge';
import { ScoreColumnHeader } from './ScoreColumnHeader';

// Columns: Creator | Trend | Niche | Followers | Eng.Rate | Score | Last Scraped | ♥ | →
const TABLE_COLS = '1fr 80px 80px 88px 88px 72px 130px 36px 28px';

interface SparklineProps { values: number[]; color: string; }
function Sparkline({ values, color }: SparklineProps) {
  const w = 64, h = 24, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <polyline
        points={`${pad},${h} ${pts} ${w - pad},${h}`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  );
}

interface CreatorsTableProps {
  showFavoritesOnly: boolean;
  onOpen: (c: Competitor) => void;
}

export function CreatorsTable({ showFavoritesOnly, onOpen }: CreatorsTableProps) {
  const [creators, setCreators] = useState<Competitor[]>(COMPETITORS);
  const filtered = creators.filter(c => !showFavoritesOnly || c.favorited);

  function toggleFavorite(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c));
  }
  function toggleStatus(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="grid items-center px-5 py-2.5 border-b"
        style={{ gridTemplateColumns: TABLE_COLS, borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Creator</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Trend</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Niche</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Followers</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Eng. Rate</span>
        <ScoreColumnHeader />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Last Scraped</span>
        <span /><span />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {filtered.map(c => {
          const isActive = c.status === 'active';
          return (
            <motion.div
              key={c.id}
              variants={fadeUp}
              onClick={() => onOpen(c)}
              className="grid items-center px-5 py-3 border-b transition-colors group cursor-pointer relative hover:bg-neutral-50/80"
              style={{
                gridTemplateColumns: TABLE_COLS,
                borderColor: 'rgba(0,0,0,0.06)',
              }}
            >
              {/* Niche-color left accent bar on hover */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r"
                style={{ backgroundColor: c.nicheColor }}
              />

              {/* Creator cell */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                {/* Avatar with optional favorited ring */}
                <div className="relative flex-shrink-0">
                  {c.favorited && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #ff0069, #833ab4)',
                        padding: '2px',
                        borderRadius: '50%',
                        margin: '-2px',
                      }}
                    />
                  )}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10"
                    style={{ backgroundColor: c.avatarColor, boxShadow: c.favorited ? 'none' : undefined }}
                  >
                    {c.initials}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{c.displayName}</p>
                  <p className="text-xs text-neutral-400 truncate">{c.handle}</p>
                </div>
              </div>

              {/* Sparkline trend */}
              <div className="flex items-center">
                <Sparkline values={c.trend} color={c.nicheColor} />
              </div>

              {/* Niche badge — translucent */}
              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${c.nicheColor}18`,
                    color: c.nicheColor,
                  }}
                >
                  {c.niche}
                </span>
              </div>

              {/* Followers */}
              <span className="text-sm font-medium text-neutral-800 tabular-nums">{c.followers}</span>

              {/* Engagement rate */}
              <span className="text-sm font-medium text-neutral-800 tabular-nums">{c.engagementRate}</span>

              {/* Score + progress bar */}
              <div className="flex flex-col gap-1">
                <ScoreBadge score={c.score} />
                <div className="w-11 h-0.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.score}%`,
                      backgroundColor:
                        c.score >= 80 ? '#16a34a' :
                        c.score >= 65 ? '#2563eb' :
                        c.score >= 50 ? '#d97706' : '#dc2626',
                    }}
                  />
                </div>
              </div>

              {/* Last scraped */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? '#78c257' : '#f59e0b' }} />
                <span className="text-xs text-neutral-400 truncate">{c.lastScraped}</span>
              </div>

              {/* Favorite toggle */}
              <button
                onClick={(e) => toggleFavorite(c.id, e)}
                className={cn('w-7 h-7 flex items-center justify-center rounded-lg transition-all', c.favorited ? 'text-[#ff0069]' : 'text-neutral-300 hover:text-neutral-400')}
              >
                <Heart size={14} fill={c.favorited ? '#ff0069' : 'none'} />
              </button>

              {/* Row-end: actions on hover → chevron always visible */}
              <div className="flex items-center justify-end">
                {/* Pause + external link, hover only */}
                <div className="absolute right-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => toggleStatus(c.id, e)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border transition-colors hover:bg-neutral-100"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}
                  >
                    {isActive ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <a
                    href={`https://instagram.com/${c.handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border transition-colors hover:bg-neutral-100"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                {/* Chevron always faintly visible, brightens on hover */}
                <ChevronRight size={14} className="text-neutral-200 group-hover:text-neutral-400 transition-colors flex-shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Heart size={28} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">No creators found</p>
          <p className="text-xs mt-1 opacity-70">{showFavoritesOnly ? 'Heart a creator to see them here' : 'Adjust your filters'}</p>
        </div>
      )}
    </div>
  );
}
