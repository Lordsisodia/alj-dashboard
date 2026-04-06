'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COMPETITORS } from '../../../creatorData';
import type { Competitor } from '../../../types';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  discovering: boolean;
  columnBg?: string;
}

function getProgress(c: Competitor): { scraped: number; total: number } {
  // Target: ~15 months of posts backfill, minimum 180 so breakdown numbers always look real
  const weeklyRate = Math.max(c.postsPerWeek, 3);
  const total      = weeklyRate * 60;
  // postsToday is the actual scraped count from the last session - multiply to simulate cumulative
  const scraped    = Math.min(c.postsToday * 6, Math.round(total * 0.85));
  return { scraped, total };
}

function getBreakdown(scraped: number) {
  const reels     = Math.round(scraped * 0.50);
  const photos    = Math.round(scraped * 0.24);
  const carousels = Math.round(scraped * 0.15);
  const stories   = Math.max(scraped - reels - photos - carousels, 0);
  return { reels, photos, carousels, stories };
}

function pctColor(pct: number): string {
  if (pct >= 80) return '#dc2626';
  if (pct >= 50) return '#b91c1c';
  if (pct >= 25) return '#991b1b';
  return '#7f1d1d';
}

function TypePill({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      <span className="text-[9px] font-semibold tabular-nums" style={{ color: '#7f1d1d' }}>{count}</span>
      <span className="text-[9px] text-neutral-400">{label}</span>
    </span>
  );
}

function ScrapingRow({ competitor, discovering, liveScraped }: { competitor: Competitor; discovering: boolean; liveScraped: number }) {
  const { total } = getProgress(competitor);
  const pct       = Math.min(Math.round((liveScraped / total) * 100), 100);
  const color     = pctColor(pct);
  const isLive    = discovering && competitor.jobStatus === 'running';
  const { reels, photos, carousels, stories } = getBreakdown(liveScraped);

  return (
    <div
      className="px-3 py-3 rounded-xl bg-white space-y-2"
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(127,29,29,0.08)', color: '#7f1d1d' }}
        >
          {competitor.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-neutral-800 truncate">{competitor.handle}</p>
            <span className="text-[9px] text-neutral-400 flex-shrink-0">{competitor.niche}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <TypePill label="Reels" count={reels} />
            <span className="text-neutral-200 text-[8px]">·</span>
            <TypePill label="Photos" count={photos} />
            <span className="text-neutral-200 text-[8px]">·</span>
            <TypePill label="Carousels" count={carousels} />
            <span className="text-neutral-200 text-[8px]">·</span>
            <TypePill label="Stories" count={stories} />
          </div>
        </div>

        <div className="flex-shrink-0 mt-0.5">
          {isLive ? (
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#dc2626' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <span className="text-[9px] tabular-nums font-semibold" style={{ color }}>{pct}%</span>
          )}
        </div>
      </div>

      {/* Progress bar with shimmer */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-neutral-400 tabular-nums">{liveScraped} / {total} posts scraped</span>
        </div>
        <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ backgroundColor: `${color}15` }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ backgroundColor: color }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ScrapingColumn({ discovering, columnBg = '#fff' }: Props) {
  const active = COMPETITORS.filter(c => c.status === 'active');

  // Live scraping ticker - increments each competitor's scraped count every 1.5s
  const [liveProgress, setLiveProgress] = useState<Record<number, number>>(() =>
    Object.fromEntries(active.map(c => [c.id, getProgress(c).scraped]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(prev => {
        const next = { ...prev };
        active.forEach(c => {
          const { total } = getProgress(c);
          const cur = next[c.id] ?? 0;
          if (cur >= total) {
            // New cycle: reset to a random 20-40% so each creator restarts at a different point
            const resetPct = 0.20 + Math.random() * 0.20;
            next[c.id] = Math.round(total * resetPct);
          } else {
            // Variable increment - looks like real scraping bursts, not a metronome
            const step = Math.floor(Math.random() * 8) + 3;
            next[c.id] = Math.min(cur + step, total);
          }
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: columnBg }}>
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: discovering ? '#dc2626' : '#d1d5db' }}
          animate={discovering ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#7f1d1d' }}>Scraping</p>
        <InfoTooltip text="Active data collection. Oracle is pulling posts, reels, photos, carousels and stories from each creator's profile. This feeds the intelligence layer - the more we scrape, the sharper the pattern analysis gets." />
        <span
          className="ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: 'rgba(127,29,29,0.1)', color: '#7f1d1d' }}
        >
          {active.length}
        </span>
      </div>

      <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5">
        {active.map(c => (
          <ScrapingRow
            key={c.id}
            competitor={c}
            discovering={discovering}
            liveScraped={liveProgress[c.id] ?? getProgress(c).scraped}
          />
        ))}
      </div>
    </div>
  );
}
