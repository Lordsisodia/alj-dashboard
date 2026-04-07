'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search, Check, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NICHE_COLORS, GRAD } from '../../constants';
import { fmtNum } from '../../utils';
import { motion } from 'framer-motion';

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
  days:        number;
  onDaysChange: (d: number) => void;
  niche?:      string;
  platform?:   string;
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

type SortKey = 'baselineScore' | 'views' | 'likes' | 'comments' | 'handle' | 'postedAt';

const AVATAR_COLORS = ['#f43f5e','#8b5cf6','#3b82f6','#10b981','#f59e0b','#ec4899','#6366f1','#14b8a6'];
function handleInitials(handle: string): string {
  const clean = handle.replace(/^@/, '');
  const words = clean.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)/g) ?? [clean];
  return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
}
function handleColor(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="grid items-center px-4 gap-4"
          style={{ gridTemplateColumns: COL, height: 48, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
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
  savedCount,
  days,
  onDaysChange,
}: {
  search: string;
  onSearch: (s: string) => void;
  band: number;
  onBand: (b: number) => void;
  total: number;
  savedCount: number;
  days: number;
  onDaysChange: (d: number) => void;
}) {
  const [bandOpen, setBandOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBandOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

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

        {/* Band filter dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setBandOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
            style={band === 0
              ? { border: '1px solid rgba(0,0,0,0.09)', color: '#6b7280', backgroundColor: '#fff' }
              : { border: '1px solid rgba(0,0,0,0.09)', background: GRAD, color: '#fff' }
            }
          >
            <span>{BANDS.find(b => b.value === band)?.label ?? 'All bands'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {bandOpen && (
            <div
              className="absolute left-0 top-[calc(100%+4px)] w-36 rounded-xl z-50 overflow-hidden"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
            >
              {BANDS.map(b => (
                <button
                  key={b.value}
                  onClick={() => { onBand(b.value); setBandOpen(false); }}
                  className="w-full flex items-center px-3 py-2.5 text-[11px] text-neutral-700 hover:bg-black/[0.04] transition-colors text-left"
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
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

      </div>
    </div>
  );
}

// ── Table row ──────────────────────────────────────────────────────────────────

const COL = '40px 200px 90px 80px 76px 80px 90px';
const DIV = { borderRight: '1px solid rgba(0,0,0,0.06)' } as const;

function QualifyRow({ post, rowIdx }: { post: QualifyPost; rowIdx: number }) {
  const isPink = post.baselineScore >= 50;

  return (
    <div
      className="grid items-stretch cursor-default transition-colors hover:bg-black/[0.04] relative group"
      style={{
        gridTemplateColumns: COL,
        height: 48,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: isPink ? 'rgba(255,0,105,0.03)' : '#fff',
      }}
    >
      {/* Left border accent on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(to bottom, #a855f7, #ec4899)' }}
      />
      {/* # */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-400 tabular-nums">{rowIdx + 1}</span>
      </div>

      {/* Creator */}
      <div className="flex items-center gap-2 min-w-0 px-3 h-full" title={post.caption} style={DIV}>
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: handleColor(post.handle) }}
        >
          {handleInitials(post.handle)}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
        </div>
      </div>

      {/* Posted */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-500 tabular-nums">{timeAgo(post.postedAt)}</span>
      </div>

      {/* Views */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.views)}</span>
      </div>

      {/* Likes */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.likes)}</span>
      </div>

      {/* Comments */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.comments)}</span>
      </div>

      {/* Baseline Score */}
      <div className="flex items-center justify-center h-full">
        <span className={cn('text-[12px] font-bold', baselineColor(post.baselineScore))}>
          {post.baselineScore.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function QualifyTableView({ days, onDaysChange, niche = 'all', platform = 'all' }: Props) {
  const [search,  setSearch]  = useState('');
  const [band,    setBand]    = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('baselineScore');
  const [sortAsc, setSortAsc] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const raw = useQuery(api.intelligence.getQualifyPosts, {}) as QualifyPost[] | undefined;

  const isLoading = raw === undefined;
  const savedCount = raw?.filter(p => p.savedForPipeline).length ?? 0;

  function handleSort(k: SortKey, asc: boolean) {
    setSortKey(k);
    setSortAsc(asc);
  }

  const filtered = useMemo(() => {
    if (!raw) return [];
    const q = search.toLowerCase().trim();
    return raw
      .filter(p => (niche === 'all' || p.niche === niche))
      .filter(p => (platform === 'all' || p.platform === platform))
      .filter(p => !q || p.handle.toLowerCase().includes(q))
      .filter(p => band === 0 || p.baselineScore >= band);
  }, [raw, niche, platform, search, band]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === 'baselineScore') { av = a.baselineScore; bv = b.baselineScore; }
      else if (sortKey === 'views')    { av = a.views;         bv = b.views; }
      else if (sortKey === 'likes')    { av = a.likes;         bv = b.likes; }
      else if (sortKey === 'comments') { av = a.comments;      bv = b.comments; }
      else if (sortKey === 'handle')   { av = a.handle;        bv = b.handle; }
      else if (sortKey === 'postedAt') { av = a.postedAt;      bv = b.postedAt; }
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

  // Column header with sort dropdown
  function SortColumnHeader({ k, label, align = 'left', divider = false }: { k: SortKey; label: string; align?: 'left' | 'right' | 'center'; divider?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isActive = sortKey === k;
    const isText = k === 'handle';
    const opts = isText
      ? [{ label: 'A → Z', asc: true }, { label: 'Z → A', asc: false }]
      : [{ label: 'High → Low', asc: false }, { label: 'Low → High', asc: true }];

    useEffect(() => {
      if (!open) return;
      function onDown(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener('mousedown', onDown);
      return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    return (
      <div ref={ref} className={cn('relative flex items-center h-full', align === 'right' && 'justify-end', align === 'center' && 'justify-center')} style={divider ? { borderRight: '1px solid rgba(0,0,0,0.06)' } : undefined}>
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'flex items-center gap-1 h-full w-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-neutral-100/80 group/hdr whitespace-nowrap',
            align === 'right' ? 'justify-end pr-1' : align === 'center' ? 'justify-center' : 'justify-start pl-3',
            isActive ? 'text-neutral-700' : 'text-neutral-400',
          )}
        >
          {label}
          <ChevronDown
            size={9}
            className={cn(
              'flex-shrink-0 transition-transform duration-150',
              open && 'rotate-180',
              isActive ? 'text-neutral-500' : 'text-neutral-300 group-hover/hdr:text-neutral-400',
            )}
          />
        </button>
        {open && (
          <div
            className={cn('absolute top-full z-50 mt-1 rounded-xl bg-white py-1 min-w-[140px]', align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0')}
            style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
          >
            {opts.map(opt => {
              const checked = isActive && sortAsc === opt.asc;
              return (
                <button
                  key={String(opt.asc)}
                  onClick={() => { handleSort(k, opt.asc); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className={cn('w-3.5 h-3.5 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors', checked ? 'bg-blue-500 border-blue-500' : 'border-neutral-200')}>
                    {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className={checked ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
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
        days={days}
        onDaysChange={onDaysChange}
      />

      {/* Header row */}
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: COL,
          height: 36,
          borderBottom: '1px solid rgba(0,0,0,0.10)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div className="flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400" style={DIV}>#</div>
        <SortColumnHeader k="handle"        label="Creator"  align="left"   divider />
        <SortColumnHeader k="postedAt"      label="Posted"   align="center" divider />
        <SortColumnHeader k="views"         label="Views"    align="center" divider />
        <SortColumnHeader k="likes"         label="Likes"    align="center" divider />
        <SortColumnHeader k="comments"      label="Comments" align="center" divider />
        <SortColumnHeader k="baselineScore" label="vs Median" align="center" />
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
                  <QualifyRow post={post} rowIdx={vRow.index} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
