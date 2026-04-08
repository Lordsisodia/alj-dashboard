'use client';

import { useEffect, useState } from 'react';
import { ScoreBadge } from '../shared/ScoreBadge';
import type { Competitor } from '../../types';
import { computeProfileHealth } from '../../constants';

// -- Trend Sparkline Card --------------------------------------------------------

export function TrendCard({ c }: { c: Competitor }) {
  const trend = c.trend ?? [];
  const mid = Math.floor(trend.length / 2);
  const prior = trend.slice(0, mid);
  const recent = trend.slice(mid);
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const pct = prior.length && avg(prior) !== 0
    ? Math.round(((avg(recent) - avg(prior)) / avg(prior)) * 100)
    : 0;
  const positive = pct >= 0;

  return (
    <div className="rounded-xl px-4 py-3" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">7-day posting trend</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
          style={{
            backgroundColor: positive ? 'rgba(22,163,74,0.10)' : 'rgba(220,38,38,0.10)',
            color: positive ? '#16a34a' : '#dc2626',
          }}
        >
          {positive ? '+' : ''}{pct}%
        </span>
      </div>
      <div className="w-full h-[52px] flex items-end">
        <svg viewBox="0 0 280 52" preserveAspectRatio="none" className="w-full h-full" fill="none">
          {trend.length >= 2 && (() => {
            const w = 280, h = 52, pad = 2;
            const min = Math.min(...trend), max = Math.max(...trend);
            const range = max - min || 1;
            const pts = trend.map((v, i) => {
              const x = pad + (i / (trend.length - 1)) * (w - pad * 2);
              const y = h - pad - ((v - min) / range) * (h - pad * 2);
              return `${x},${y}`;
            }).join(' ');
            const fill = positive ? '#16a34a' : '#dc2626';
            return (
              <>
                <polyline points={pts} stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
                <polyline points={`${pad},${h} ${pts} ${w - pad},${h}`} fill={fill} opacity="0.08" />
              </>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

// -- Profile Health Breakdown ----------------------------------------------------

function staleDot(lastScraped: string) {
  const days = Math.floor((Date.now() - new Date(lastScraped).getTime()) / 86_400_000);
  return days <= 7 ? '#16a34a' : days <= 21 ? '#d97706' : '#dc2626';
}

export function ProfileHealthSection({ c }: { c: Competitor }) {
  const health = computeProfileHealth(c);
  const postDayPct = Math.min(Math.round((c.postsPerWeek / 7) * 100), 100);
  const scorePct = Math.min(c.score, 100);
  const dotColor = staleDot(c.lastScraped);

  return (
    <div className="rounded-xl px-4 py-3" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 block mb-3">Profile health</span>
      <div className="grid grid-cols-3 gap-4">
        {/* Posts/day avg */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wide">Posts/day avg</span>
          <span className="text-sm font-bold text-neutral-900 tabular-nums">{(c.postsPerWeek / 7).toFixed(1)}</span>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${postDayPct}%`, background: 'linear-gradient(135deg, #ff0069, #833ab4)' }} />
          </div>
        </div>

        {/* ISSO Score */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wide">ISSO Score</span>
          <div className="flex items-center gap-1.5">
            <ScoreBadge score={c.score} />
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${scorePct}%`, background: 'linear-gradient(135deg, #ff0069, #833ab4)' }} />
          </div>
        </div>

        {/* Last scraped */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wide">Last scraped</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
            <span className="text-[11px] font-medium text-neutral-700 truncate">{c.lastScraped}</span>
          </div>
          <span className="text-[10px] text-neutral-400">Health: {health}%</span>
        </div>
      </div>
    </div>
  );
}

// -- Notes Field -----------------------------------------------------------------

export function NotesField({ handle }: { handle: string }) {
  const key = `recon-note-${handle}`;
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setNote(saved);
  }, [key]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    localStorage.setItem(key, e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Internal notes</label>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Add notes about this creator..."
        rows={2}
        className="w-full resize-none rounded-lg px-3 py-2 text-xs text-neutral-700 placeholder-neutral-300 outline-none transition-all"
        style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: 'rgba(0,0,0,0.015)' }}
      />
    </div>
  );
}
