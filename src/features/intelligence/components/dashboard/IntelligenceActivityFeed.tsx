'use client';

import { motion } from 'framer-motion';
import { Flame, Anchor, TrendingUp, Zap, Activity } from 'lucide-react';
import type { TrendsData } from '../../types';

interface Props {
  trends: TrendsData;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionLabel({
  children,
  right,
  first,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div className={`px-4 ${first ? 'pt-3' : 'pt-4'} pb-1.5 flex items-center justify-between flex-shrink-0`}>
      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.06em]">
        {children}
      </span>
      {right && (
        <span className="text-[9px] text-neutral-400 tabular-nums">{right}</span>
      )}
    </div>
  );
}

// ── Live event row ─────────────────────────────────────────────────────────────

function EventRow({
  icon,
  label,
  value,
  sublabel,
  accent = '#ff0069',
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  accent?: string;
  index?: number;
}) {
  const isQuoted =
    sublabel != null &&
    (sublabel.startsWith('"') || sublabel.endsWith('"'));

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index ?? 0) * 0.04, duration: 0.2 }}
      className="w-full flex items-start px-3 py-2.5 gap-2.5 hover:bg-neutral-50 transition-colors"
    >
      {/* Left accent rail */}
      <div
        className="w-0.5 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: accent }}
      />

      {/* Icon tile */}
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: accent + '18' }}
      >
        {icon}
      </span>

      {/* Content col */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[12px] font-semibold text-neutral-800 truncate">{label}</span>
        {sublabel && (
          <span className={`text-[11px] text-neutral-500 leading-snug line-clamp-2${isQuoted ? ' italic' : ''}`}>
            {sublabel}
          </span>
        )}
      </div>

      {/* Right metric chip */}
      <div
        className="flex-shrink-0 ml-auto px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums"
        style={{ backgroundColor: accent + '14', color: accent }}
      >
        {value}
      </div>
    </motion.div>
  );
}

// ── Intelligence Activity Feed ───────────────────────────────────────────────

export function IntelligenceActivityFeed({ trends }: Props) {
  const outliers = trends.outlierPosts ?? [];
  const topHooks = trends.topHooks ?? [];
  const formatStats = trends.formatStats ?? [];
  const nicheStats = trends.nicheStats ?? [];

  const topFormat = [...formatStats].sort((a, b) => b.avgER - a.avgER)[0];
  const topNiche = [...nicheStats].sort((a, b) => b.avgER - a.avgER)[0];

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <Activity size={13} style={{ color: '#7c3aed' }} />
          <p className="text-xs font-bold text-neutral-800">
            Live Intelligence
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-medium">Live</span>
        </div>
      </div>

      {/* Scrollable events */}
      <div className="flex-1 overflow-y-auto pt-1 pb-4">

        {/* ── Outliers ── */}
        <SectionLabel first right={String(outliers.slice(0, 4).length)}>
          Top Outliers
        </SectionLabel>
        {outliers.length === 0 ? (
          <p className="px-4 py-4 text-xs text-neutral-400 text-center">No outliers detected yet</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {outliers.slice(0, 4).map((post, i) => (
              <EventRow
                key={post._id}
                icon={<Flame size={12} style={{ color: '#ff0069' }} />}
                label={`@${post.handle}`}
                value={`${post.outlierRatio.toFixed(1)}x`}
                sublabel={post.hook ? `"${post.hook.slice(0, 56)}${post.hook.length > 56 ? '...' : ''}"` : post.contentType}
                accent="#ff0069"
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Top Hooks ── */}
        <SectionLabel right={String(topHooks.slice(0, 4).length)}>
          Top Hooks
        </SectionLabel>
        {topHooks.length === 0 ? (
          <p className="px-4 py-4 text-xs text-neutral-400 text-center">No hooks scored yet</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {topHooks.slice(0, 4).map((hook, i) => (
              <EventRow
                key={hook._id}
                icon={<Anchor size={12} style={{ color: '#7c3aed' }} />}
                label={`@${hook.handle}`}
                value={`${(hook.engagementRate * 100).toFixed(1)}%`}
                sublabel={hook.hook ? `"${hook.hook.slice(0, 52)}${hook.hook.length > 52 ? '...' : ''}"` : hook.contentType}
                accent="#7c3aed"
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Trending Now (Format + Niche two-up grid) ── */}
        {(topFormat || topNiche) && (
          <>
            <SectionLabel>Trending Now</SectionLabel>
            <div className="grid grid-cols-2 gap-2 px-3 pt-1 pb-3">
              {topFormat && (
                <div
                  className="rounded-xl p-3 flex flex-col gap-1.5"
                  style={{ backgroundColor: 'rgba(74,158,255,0.06)', border: '1px solid rgba(74,158,255,0.12)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={11} style={{ color: '#4a9eff' }} />
                    <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: '#4a9eff' }}>Format</span>
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-800">
                    {topFormat.format.charAt(0).toUpperCase() + topFormat.format.slice(1)}
                  </p>
                  <p className="text-[11px] font-bold tabular-nums" style={{ color: '#4a9eff' }}>
                    {(topFormat.avgER * 100).toFixed(1)}% ER
                  </p>
                  <p className="text-[9px] text-neutral-400">{topFormat.count} posts</p>
                </div>
              )}
              {topNiche && (
                <div
                  className="rounded-xl p-3 flex flex-col gap-1.5"
                  style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap size={11} style={{ color: '#22c55e' }} />
                    <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: '#22c55e' }}>Niche</span>
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-800">
                    {topNiche.niche.charAt(0).toUpperCase() + topNiche.niche.slice(1)}
                  </p>
                  <p className="text-[11px] font-bold tabular-nums" style={{ color: '#22c55e' }}>
                    {(topNiche.avgER * 100).toFixed(1)}% ER
                  </p>
                  <p className="text-[9px] text-neutral-400">{topNiche.count} posts</p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
