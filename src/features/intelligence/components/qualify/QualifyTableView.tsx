'use client';

import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search, Check, Play, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NICHE_COLORS, GRAD } from '../../constants';
import { fmtNum } from '../../utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type QualifyPost = {
  _id: string;
  externalId: string;
  handle: string;
  platform: string;
  contentType: string;
  niche: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  reach: number;
  engagementRate: number;
  postedAt: number;
  scrapedAt: number;
  outlierRatio?: number;
  baselineScore: number;
  savedForPipeline?: boolean;
  saved?: boolean;
};

interface Props {
  view:         'table' | 'kanban';
  onViewChange:  (v: 'table' | 'kanban') => void;
  days:         number;
  onDaysChange:  (d: number) => void;
  niche?:       string;
  platform?:    string;
}

// ── Band helpers ────────────────────────────────────────────────────────────────

function getBand(score: number): { label: string; color: string; bg: string } {
  if (score < 1)  return { label: 'Below Baseline', color: 'text-neutral-400',    bg: 'bg-neutral-100' };
  if (score < 5)  return { label: '2×',            color: 'text-blue-400',       bg: 'bg-blue-50' };
  if (score < 10) return { label: '5×',            color: 'text-emerald-400',    bg: 'bg-emerald-50' };
  if (score < 20) return { label: '10×',           color: 'text-yellow-400',     bg: 'bg-yellow-50' };
  if (score < 50) return { label: '20×',           color: 'text-orange-400',     bg: 'bg-orange-50' };
  return           { label: '🔥 50×+',            color: 'text-pink-500',        bg: 'bg-pink-50' };
}

function baselineColor(score: number): string {
  if (score < 1)  return 'text-neutral-400';
  if (score < 5)  return 'text-blue-400';
  if (score < 10) return 'text-emerald-400';
  if (score < 20) return 'text-yellow-400';
  if (score < 50) return 'text-orange-400';
  return 'text-pink-500';
}

// ── Column definitions ──────────────────────────────────────────────────────────

type SortKey = 'baselineScore' | 'views' | 'likes' | 'comments' | 'handle' | 'niche';

// ── Skeleton ───────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="grid items-center px-4 gap-4"
          style={{ gridTemplateColumns: '48px 1fr 80px 72px 64px 56px 80px', height: 48, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="h-3 w-4 rounded bg-neutral-100 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-12 rounded bg-neutral-100 animate-pulse flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-neutral-100 animate-pulse" />
              <div className="h-2 w-10 rounded bg-neutral-100 animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-12 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-10 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-8 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div className="h-3 w-10 rounded bg-neutral-100 animate-pulse ml-auto" />
          <div />
        </div>
      ))}
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function QualifyToolbar({
  search,
  onSearch,
  band,
  onBand,
  total,
  onSaveTop,
  isSaving,
  view,
  onViewChange,
  days,
  onDaysChange,
}: {
  search: string;
  onSearch: (s: string) => void;
  band: number;
  onBand: (b: number) => void;
  total: number;
  savedCount: number;
  onSaveTop: () => void;
  isSaving: boolean;
  view: 'table' | 'kanban';
  onViewChange: (v: 'table' | 'kanban') => void;
  days: number;
  onDaysChange: (d: number) => void;
}) {
  const BANDS = [
    { label: 'All',   value: 0 },
    { label: '2×+',  value: 1 },
    { label: '5×+',  value: 5 },
    { label: '10×+', value: 10 },
    { label: '20×+', value: 20 },
  ];

  const DAYS_OPTIONS = [
    { label: '7d',  value: 7 },
    { label: '30d', value: 30 },
    { label: '90d', value: 90 },
  ];

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
    >
      {/* Left: search + band chips */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
        >
          <Search size={11} className="text-neutral-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Filter by handle..."
            className="text-[11px] text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none w-36"
          />
        </div>

        {/* Band filter chips */}
        <div className="flex items-center gap-1">
          {BANDS.map(b => (
            <button
              key={b.value}
              onClick={() => onBand(b.value)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all active:scale-95"
              style={band === b.value
                ? { background: GRAD, color: '#fff' }
                : { color: '#9ca3af', backgroundColor: 'transparent' }
              }
            >
              {b.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-neutral-400 tabular-nums">{savedCount} saved · {total} shown</span>
      </div>

      {/* Right: days pills + Table/Kanban + Save */}
      <div className="flex items-center gap-2">
        {/* 7d / 30d / 90d pills */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
          {DAYS_OPTIONS.map(d => (
            <button
              key={d.value}
              onClick={() => onDaysChange(d.value)}
              className="px-2.5 py-1.5 text-[10px] font-semibold transition-all active:scale-95"
              style={days === d.value
                ? { background: GRAD, color: '#fff' }
                : { color: '#9ca3af' }
              }
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Table | Kanban toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.09)' }}
        >
          {(['table', 'kanban'] as const).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className="px-3 py-1.5 text-[11px] font-semibold capitalize transition-all active:scale-95"
              style={view === v
                ? { background: GRAD, color: '#fff' }
                : { color: '#9ca3af' }
              }
            >
              {v}
            </button>
          ))}
        </div>

        <button
          onClick={onSaveTop}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-50 transition-all hover:brightness-105 active:scale-95"
          style={{ background: GRAD }}
        >
          {isSaving ? (
            <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={11} />
          )}
          Save Top 10%
        </button>
      </div>
    </div>
  );
}

// ── Table row ──────────────────────────────────────────────────────────────────

function QualifyRow({
  post,
  rowIdx,
  sortKey,
  sortAsc,
  onSort,
}: {
  post: QualifyPost;
  rowIdx: number;
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (k: SortKey) => void;
}) {
  const isPink = post.baselineScore >= 50;
  const nicheColor = NICHE_COLORS[post.niche] ?? '#833ab4';

  return (
    <div
      className="grid items-center px-4 cursor-default transition-colors hover:bg-black/[0.04]"
      style={{
        gridTemplateColumns: '48px 1fr 80px 72px 64px 56px 80px',
        height: 48,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: isPink ? 'rgba(255,0,105,0.03)' : '#fff',
      }}
    >
      {/* # */}
      <span className="text-[11px] text-neutral-400 tabular-nums">{rowIdx + 1}</span>

      {/* Creator */}
      <div className="flex items-center gap-2 min-w-0 pr-4" title={post.caption}>
        {/* Thumbnail */}
        <div
          className="relative w-8 h-12 rounded overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer"
          style={{ background: post.thumbnailUrl.startsWith('http') ? undefined : post.thumbnailUrl }}
        >
          <Play size={10} className="text-white/70" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
          <p className="text-[9px] text-neutral-400 capitalize">{post.platform}</p>
        </div>
      </div>

      {/* Niche */}
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white self-center"
        style={{ backgroundColor: nicheColor, width: 'fit-content' }}
      >
        {post.niche}
      </span>

      {/* Views */}
      <span className="text-[11px] text-neutral-600 text-right tabular-nums">{fmtNum(post.views)}</span>

      {/* Likes */}
      <span className="text-[11px] text-neutral-600 text-right tabular-nums">{fmtNum(post.likes)}</span>

      {/* Comments */}
      <span className="text-[11px] text-neutral-600 text-right tabular-nums">{fmtNum(post.comments)}</span>

      {/* Baseline Score */}
      <div className="flex items-center justify-end gap-1">
        <span className={cn('text-[12px] font-bold', baselineColor(post.baselineScore))}>
          {post.baselineScore.toFixed(1)}×
        </span>
      </div>

      {/* Saved */}
      <div className="flex items-center justify-center">
        {post.savedForPipeline && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GRAD }}>
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function QualifyTableView({ view, onViewChange, days, onDaysChange, niche = 'all', platform = 'all' }: Props) {
  const [search,   setSearch]   = useState('');
  const [band,     setBand]     = useState(0);
  const [sortKey,  setSortKey]  = useState<SortKey>('baselineScore');
  const [sortAsc,  setSortAsc]  = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const raw = useQuery(api.intelligence.getQualifyPosts, {}) as QualifyPost[] | undefined;
  const saveTop = useMutation(api.intelligence.saveTopPostsForPipeline);

  const isLoading = raw === undefined;
  const savedCount = raw?.filter(p => p.savedForPipeline).length ?? 0;

  function handleSort(k: SortKey) {
    if (sortKey === k) setSortAsc(a => !a);
    else { setSortKey(k); setSortAsc(false); }
  }

  const filtered = useMemo(() => {
    if (!raw) return [];
    const q = search.toLowerCase().trim();
    return raw
      .filter(p => !q || p.handle.toLowerCase().includes(q))
      .filter(p => band === 0 || p.baselineScore >= band);
  }, [raw, search, band]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === 'baselineScore') { av = a.baselineScore; bv = b.baselineScore; }
      else if (sortKey === 'views')    { av = a.views;         bv = b.views; }
      else if (sortKey === 'likes')   { av = a.likes;         bv = b.likes; }
      else if (sortKey === 'comments'){ av = a.comments;      bv = b.comments; }
      else if (sortKey === 'handle')  { av = a.handle;        bv = b.handle; }
      else if (sortKey === 'niche')   { av = a.niche;         bv = b.niche; }
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);

  const rowVirtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  async function handleSaveTop10() {
    if (!raw || raw.length === 0) return;
    setIsSaving(true);
    try {
      const top10Pct = Math.ceil(raw.length * 0.1);
      const topPosts = raw.slice(0, top10Pct);
      const ids = topPosts.map(p => p._id as any);
      await saveTop({ postIds: ids });
      toast(`Saved ${topPosts.length} reels to pipeline`);
    } finally {
      setIsSaving(false);
    }
  }

  // Column header
  function SortHeader({ k, label, align }: { k: SortKey; label: string; align?: 'right' }) {
    return (
      <button
        onClick={() => handleSort(k)}
        className={cn(
          'flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-wide transition-colors',
          align === 'right' ? 'text-right pr-3' : 'text-left',
          sortKey === k ? 'text-neutral-700' : 'text-neutral-400',
        )}
      >
        {label}
        {sortKey === k ? (sortAsc ? '↑' : '↓') : '↕'}
      </button>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>
      <QualifyToolbar
        search={search}
        onSearch={setSearch}
        band={band}
        onBand={setBand}
        total={isLoading ? 0 : sorted.length}
        savedCount={isLoading ? 0 : savedCount}
        onSaveTop={handleSaveTop10}
        isSaving={isSaving}
        view={view}
        onViewChange={onViewChange}
        days={days}
        onDaysChange={onDaysChange}
      />

      {/* Header row — matches Recon CreatorsTable style */}
      <div
        className="grid px-4"
        style={{
          gridTemplateColumns: '48px 1fr 80px 72px 64px 56px 80px',
          height: 36,
          borderBottom: '1px solid rgba(0,0,0,0.10)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div className="flex items-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">#</div>
        <SortHeader k="handle"        label="Creator" />
        <SortHeader k="niche"         label="Niche" />
        <SortHeader k="views"         label="Views"    align="right" />
        <SortHeader k="likes"         label="Likes"    align="right" />
        <SortHeader k="comments"      label="Comments" align="right" />
        <SortHeader k="baselineScore" label="Baseline ×" align="right" />
        <div className="flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400" title="Saved to pipeline">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#f5f5f4' }}>
            <Filter size={20} className="text-neutral-300" />
          </div>
          {search || band > 0 ? (
            <>
              <p className="text-sm font-semibold text-neutral-600">No reels match your filters</p>
              <p className="text-xs text-neutral-400">Try a broader search or lower the multiplier threshold</p>
              <button
                onClick={() => { setSearch(''); setBand(0); }}
                className="mt-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: '#f5f5f4', color: '#666' }}
              >
                Clear filters
              </button>
            </>
          ) : (
            <p className="text-sm font-medium text-neutral-400">No reels indexed yet</p>
          )}
        </div>
      ) : (
        <div ref={scrollRef} style={{ height: 'calc(100vh - 380px)', overflowY: 'auto' }}>
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map(vRow => {
              const post = sorted[vRow.index];
              return (
                <div key={post._id} style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${vRow.start}px)` }}>
                  <QualifyRow
                    post={post}
                    rowIdx={vRow.index}
                    sortKey={sortKey}
                    sortAsc={sortAsc}
                    onSort={handleSort}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
