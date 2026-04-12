'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { Search, Filter, ChevronDown, BookmarkPlus, X, Layers, Eye, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GRAD } from '../../constants';
import { fmtNum } from '../../utils';
import { VirtualTable } from '@/components/table/VirtualTable';
import { SelectCheckbox } from '@/features/recon/components/table/shared/SelectCheckbox';
import { TableCard } from '@/features/recon/components/table/shared/TableCard';

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
  creatorMedianViews?: number;
  creatorMedianLikes?: number;
  creatorMedianComments?: number;
  savedForPipeline?: boolean;
  saved?: boolean;
};

interface Props {
  days:      number;
  niche?:    string;
  platform?: string;
}

// ── Column layout ──────────────────────────────────────────────────────────────

const COL        = '36px 40px 200px 80px 90px 76px 76px 66px 110px 100px';
const TABLE_WIDTH = 874; // sum of COL widths
const DIV        = { borderRight: '1px solid rgba(0,0,0,0.06)' } as const;

type SortKey = 'baselineScore' | 'views' | 'likes' | 'comments' | 'handle' | 'postedAt' | 'medianViews' | 'likeRate';

// ── Band helpers ────────────────────────────────────────────────────────────────

function baselineColor(score: number): string {
  if (score < 1)  return 'text-neutral-400';
  if (score < 5)  return 'text-blue-400';
  if (score < 10) return 'text-emerald-400';
  if (score < 20) return 'text-yellow-400';
  if (score < 50) return 'text-orange-400';
  return 'text-pink-500';
}

// ── Avatar helpers ──────────────────────────────────────────────────────────────

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
  search, onSearch, band, onBand, total, savedCount, creatorCount, groupByCreator, onGroupByCreator,
  creatorFilter, onCreatorFilter, creators,
}: {
  search: string; onSearch: (s: string) => void;
  band: number;   onBand: (b: number) => void;
  total: number;  savedCount: number; creatorCount: number;
  groupByCreator: boolean; onGroupByCreator: (v: boolean) => void;
  creatorFilter: string; onCreatorFilter: (h: string) => void;
  creators: Array<{ handle: string; count: number }>;
}) {
  const [bandOpen, setBandOpen]       = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [infoOpen, setInfoOpen]       = useState(false);
  const dropdownRef    = useRef<HTMLDivElement>(null);
  const creatorDropRef = useRef<HTMLDivElement>(null);
  const infoRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setBandOpen(false);
      if (creatorDropRef.current && !creatorDropRef.current.contains(e.target as Node)) setCreatorOpen(false);
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfoOpen(false);
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

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}
    >
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

        {/* Creator filter dropdown */}
        <div className="relative" ref={creatorDropRef}>
          <button
            onClick={() => setCreatorOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
            style={creatorFilter
              ? { border: '1px solid rgba(0,0,0,0.09)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }
              : { border: '1px solid rgba(0,0,0,0.09)', color: '#6b7280', backgroundColor: '#fff' }
            }
          >
            <span>{creatorFilter || 'All creators'}</span>
            {creatorFilter
              ? <X size={9} className="opacity-70" onClick={e => { e.stopPropagation(); onCreatorFilter(''); }} />
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="M6 9l6 6 6-6"/></svg>
            }
          </button>
          {creatorOpen && (
            <div
              className="absolute left-0 top-[calc(100%+4px)] w-44 rounded-xl z-50 overflow-hidden overflow-y-auto"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', maxHeight: 240 }}
            >
              <button
                onClick={() => { onCreatorFilter(''); setCreatorOpen(false); }}
                className="w-full flex items-center px-3 py-2.5 text-[11px] text-neutral-700 hover:bg-black/[0.04] transition-colors text-left"
                style={!creatorFilter ? { color: '#6366f1', fontWeight: 600 } : undefined}
              >
                All creators
              </button>
              {creators.map(({ handle: h, count }) => (
                <button
                  key={h}
                  onClick={() => { onCreatorFilter(h); setCreatorOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] hover:bg-black/[0.04] transition-colors text-left"
                  style={creatorFilter === h ? { color: '#6366f1', fontWeight: 600 } : { color: '#374151' }}
                >
                  <span className="truncate">@{h}</span>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[11px] text-neutral-400 tabular-nums">{creatorCount} creators · {total} posts · {savedCount} saved</span>

        <button
          onClick={() => onGroupByCreator(!groupByCreator)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
          style={groupByCreator
            ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: '1px solid transparent' }
            : { border: '1px solid rgba(0,0,0,0.09)', color: '#6b7280', backgroundColor: '#fff' }
          }
        >
          <Layers size={10} />
          Group by creator
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={infoRef}>
          <button
            onClick={() => setInfoOpen(v => !v)}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={infoOpen
              ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: '1px solid transparent' }
              : { border: '1px solid rgba(0,0,0,0.09)', color: '#9ca3af', backgroundColor: '#fff' }
            }
            title="Column definitions"
          >
            <Eye size={12} />
          </button>
          {infoOpen && (
            <div
              className="absolute right-0 top-[calc(100%+6px)] z-50 rounded-xl overflow-hidden"
              style={{ width: 320, backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fafafa' }}>
                <p className="text-[11px] font-semibold text-neutral-700">Column definitions</p>
              </div>
              <div className="py-1">
                {[
                  { col: 'Thumbnail', desc: 'Post preview. Type badge at bottom: post or carousel (Reels show no badge).' },
                  { col: 'Creator', desc: 'Account handle and niche tag.' },
                  { col: 'Posted', desc: 'Time since the post was published.' },
                  { col: 'Views', desc: 'Total video plays. Reels only - photos and carousels always show 0 since Instagram doesn\'t expose view counts on non-video posts.' },
                  { col: 'Likes', desc: 'Total likes received on the post.' },
                  { col: 'Cmts', desc: 'Comment count - measures audience conversation depth.' },
                  { col: 'Like%', desc: 'Likes / Views. Quality signal independent of reach. Green >=5%, yellow >=2%, grey <2%.' },
                  { col: 'Med Views', desc: 'This creator\'s median reel views, computed from all scraped posts with views > 0. The baseline for vs Median.' },
                  { col: 'vs Median', desc: 'This post\'s views / creator median. 2.0x = post got double the creator\'s typical views. Shows - if no view data.' },
                ].map(({ col, desc }) => (
                  <div key={col} className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-[10px] font-semibold text-neutral-700 uppercase tracking-[0.08em] mb-0.5">{col}</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Table row ──────────────────────────────────────────────────────────────────

function QualifyRow({
  post, rowIdx, isSelected, anySelected, onSelect, avatarByHandle, isFirstInGroup,
}: {
  post: QualifyPost;
  rowIdx: number;
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  avatarByHandle: Map<string, string | undefined>;
  isFirstInGroup?: boolean;
}) {
  const isPink = post.baselineScore >= 50;
  const [imgErr, setImgErr]     = useState(false);
  const [thumbErr, setThumbErr] = useState(false);
  const avatarUrl = avatarByHandle.get(post.handle);

  return (
    <div
      className={cn(
        'grid items-stretch cursor-default transition-colors relative group',
        !isSelected && 'hover:bg-[#f9f8ff]',
      )}
      style={{
        gridTemplateColumns: COL,
        height: 48,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        borderTop: isFirstInGroup ? '2px solid rgba(139,92,246,0.15)' : undefined,
        backgroundColor: isSelected
          ? 'rgba(139, 92, 246, 0.06)'
          : isPink
            ? 'rgba(255,0,105,0.03)'
            : undefined,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom, #a855f7, #ec4899)' }} />

      {/* Checkbox */}
      <div className="flex items-center justify-center h-full pl-2" style={DIV} onClick={onSelect}>
        <SelectCheckbox
          state={isSelected ? 'all' : 'none'}
          tint="violet"
          visible={anySelected || isSelected}
        />
      </div>

      {/* Thumbnail + content type badge */}
      <div className="relative flex items-center justify-center h-full overflow-hidden" style={DIV}>
        {post.thumbnailUrl && !thumbErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setThumbErr(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${handleColor(post.handle)}40, ${handleColor(post.handle)}20)` }} />
        )}
        {post.contentType && post.contentType !== 'reel' && (
          <span
            className="absolute bottom-0.5 left-0 right-0 text-center text-[7px] font-bold uppercase tracking-wide leading-none py-0.5"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
          >
            {post.contentType === 'carousel' ? 'car' : post.contentType}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 min-w-0 px-3 h-full" title={post.caption} style={DIV}>
        {avatarUrl && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={post.handle}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: handleColor(post.handle) }}
          >
            {handleInitials(post.handle)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
          {post.niche && post.niche !== 'Unknown' && (
            <span className="text-[9px] font-medium px-1 py-0.5 rounded" style={{ backgroundColor: `${handleColor(post.niche)}20`, color: handleColor(post.niche) }}>
              {post.niche}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-500 tabular-nums">{timeAgo(post.postedAt)}</span>
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.views)}</span>
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.likes)}</span>
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.comments)}</span>
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        {post.views > 0 ? (
          <span className="text-[11px] tabular-nums" style={{
            color: post.likes / post.views >= 0.05 ? '#16a34a'
                 : post.likes / post.views >= 0.02 ? '#ca8a04'
                 : '#9ca3af',
          }}>
            {(post.likes / post.views * 100).toFixed(1)}%
          </span>
        ) : (
          <span className="text-[11px] text-neutral-300">—</span>
        )}
      </div>

      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-400 tabular-nums">
          {post.creatorMedianViews ? fmtNum(post.creatorMedianViews) : '-'}
        </span>
      </div>

      <div className="flex items-center justify-center h-full">
        <span className={cn('text-[12px] font-bold', baselineColor(post.baselineScore))}>
          {post.baselineScore.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function QualifyTableView({ days, niche = 'all', platform = 'all' }: Props) {
  const [search,         setSearch]         = useState('');
  const [band,           setBand]           = useState(0);
  const [sortKey,        setSortKey]        = useState<SortKey>('baselineScore');
  const [sortAsc,        setSortAsc]        = useState(false);
  const [selected,       setSelected]       = useState<Set<string>>(new Set());
  const [groupByCreator, setGroupByCreator] = useState(false);
  const [creatorFilter,  setCreatorFilter]  = useState('');

  const raw               = useQuery(api.intelligence.getQualifyPosts, {}) as QualifyPost[] | undefined;
  const trackedAccounts   = useQuery(api.trackedAccounts.list, {}) ?? [];
  const saveForPipeline   = useMutation(api.intelligence.saveTopPostsForPipeline);

  const avatarByHandle = useMemo(
    () => new Map(trackedAccounts.map(a => [a.handle, a.avatarUrl as string | undefined])),
    [trackedAccounts],
  );

  const isLoading  = raw === undefined;
  const savedCount = raw?.filter(p => p.savedForPipeline).length ?? 0;

  // Unique creators with post counts, sorted A→Z for the dropdown
  const creators = useMemo(() => {
    if (!raw) return [];
    const counts = new Map<string, number>();
    for (const p of raw) counts.set(p.handle, (counts.get(p.handle) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([handle, count]) => ({ handle, count }));
  }, [raw]);

  function handleSort(k: SortKey, asc: boolean) {
    setSortKey(k);
    setSortAsc(asc);
  }

  const filtered = useMemo(() => {
    if (!raw) return [];
    const q      = search.toLowerCase().trim();
    const cutoff = days > 0 ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
    return raw
      .filter(p => niche === 'all' || p.niche === niche)
      .filter(p => platform === 'all' || p.platform === platform)
      .filter(p => !creatorFilter || p.handle === creatorFilter)
      .filter(p => !q || p.handle.toLowerCase().includes(q))
      .filter(p => band === 0 || p.baselineScore >= band)
      .filter(p => cutoff === 0 || (p.scrapedAt ?? 0) >= cutoff);
  }, [raw, niche, platform, search, band, days, creatorFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === 'baselineScore') { av = a.baselineScore;                  bv = b.baselineScore; }
      else if (sortKey === 'views')       { av = a.views;                         bv = b.views; }
      else if (sortKey === 'likes')       { av = a.likes;                         bv = b.likes; }
      else if (sortKey === 'comments')    { av = a.comments;                      bv = b.comments; }
      else if (sortKey === 'handle')      { av = a.handle;                        bv = b.handle; }
      else if (sortKey === 'postedAt')    { av = a.postedAt;                      bv = b.postedAt; }
      else if (sortKey === 'medianViews') { av = a.creatorMedianViews ?? 0;                                            bv = b.creatorMedianViews ?? 0; }
      else if (sortKey === 'likeRate')    { av = a.views > 0 ? a.likes / a.views : 0; bv = b.views > 0 ? b.likes / b.views : 0; }
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    if (!groupByCreator) return arr;
    // When grouping: sort by handle A→Z, then by baselineScore desc within each group
    return arr.sort((a, b) => {
      if (a.handle !== b.handle) return a.handle.localeCompare(b.handle);
      return b.baselineScore - a.baselineScore;
    });
  }, [filtered, sortKey, sortAsc, groupByCreator]);

  // -- Selection helpers ----------------------------------------------------------
  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  const allFilteredIds = sorted.map(p => p._id);
  const allSelected    = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id));
  const someSelected   = allFilteredIds.some(id => selected.has(id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.delete(id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.add(id)); return s; });
    }
  }

  // Sort column header (defined inside component so it closes over sortKey/sortAsc/handleSort)
  function SortColumnHeader({ k, label, align = 'left', divider = false, tooltip }: { k: SortKey; label: string; align?: 'left' | 'right' | 'center'; divider?: boolean; tooltip?: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isActive = sortKey === k;
    const isText   = k === 'handle';
    const opts     = isText
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
          {tooltip && (
            <span className="relative group/tip flex-shrink-0" onClick={e => e.stopPropagation()}>
              <Info size={8} className="text-neutral-300 hover:text-neutral-500 cursor-default" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-2.5 py-2 rounded-lg text-[10px] text-neutral-600 leading-relaxed bg-white shadow-lg border border-neutral-100 opacity-0 group-hover/tip:opacity-100 pointer-events-none z-[200] whitespace-normal text-left font-normal normal-case tracking-normal">
                {tooltip}
              </div>
            </span>
          )}
          <ChevronDown size={9} className={cn('flex-shrink-0 transition-transform duration-150', open && 'rotate-180', isActive ? 'text-neutral-500' : 'text-neutral-300 group-hover/hdr:text-neutral-400')} />
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

  function renderHeader() {
    return (
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: COL, height: 36, borderBottom: '1px solid rgba(0,0,0,0.10)', backgroundColor: '#f9f9f9' }}
      >
        {/* Select-all checkbox */}
        <div
          className="flex items-center justify-center cursor-pointer h-full"
          style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}
          onClick={toggleSelectAll}
        >
          <SelectCheckbox
            state={allSelected ? 'all' : someSelected ? 'some' : 'none'}
            tint="violet"
          />
        </div>

        <div className="flex items-center justify-center h-full text-neutral-300" style={DIV}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        </div>
        <SortColumnHeader k="handle"        label="Creator"   align="left"   divider tooltip="Account handle and niche tag." />
        <SortColumnHeader k="postedAt"      label="Posted"    align="center" divider tooltip="Time since the post was published." />
        <SortColumnHeader k="views"         label="Views"     align="center" divider tooltip="Total video plays. Reels only - photos and carousels show 0 since Instagram doesn't expose view counts on non-video posts." />
        <SortColumnHeader k="likes"         label="Likes"     align="center" divider tooltip="Total likes received on the post." />
        <SortColumnHeader k="comments"      label="Cmts"      align="center" divider tooltip="Comment count - measures audience conversation depth." />
        <SortColumnHeader k="likeRate"      label="Like%"     align="center" divider tooltip="Likes ÷ Views. Quality signal independent of reach. Green ≥5%, yellow ≥2%, grey <2%." />
        <SortColumnHeader k="medianViews"   label="Med Views" align="center" divider tooltip="This creator's median reel views across all scraped posts with views > 0." />
        <SortColumnHeader k="baselineScore" label="vs Median" align="center" tooltip="This post's views ÷ creator median. 2.0× = double the creator's typical views." />
      </div>
    );
  }

  const emptyState = (
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
  );

  return (
    <TableCard className="relative flex flex-col flex-1 min-h-0">
      <QualifyToolbar
        search={search}
        onSearch={setSearch}
        band={band}
        onBand={setBand}
        total={isLoading ? 0 : sorted.length}
        savedCount={isLoading ? 0 : savedCount}
        creatorCount={creators.length}
        groupByCreator={groupByCreator}
        onGroupByCreator={setGroupByCreator}
        creatorFilter={creatorFilter}
        onCreatorFilter={setCreatorFilter}
        creators={creators}
      />

      <VirtualTable
        data={sorted}
        isLoading={isLoading}
        keyExtractor={p => p._id}
        gridCols={COL}
        tableWidth={TABLE_WIDTH}
        rowHeight={48}
        renderHeader={renderHeader}
        renderRow={(post, idx) => (
          <QualifyRow
            post={post}
            rowIdx={idx}
            isSelected={selected.has(post._id)}
            anySelected={selected.size > 0}
            onSelect={e => toggleSelect(post._id, e)}
            avatarByHandle={avatarByHandle}
            isFirstInGroup={groupByCreator && idx > 0 && sorted[idx - 1]?.handle !== post.handle}
          />
        )}
        loadingState={<TableSkeleton />}
        emptyState={emptyState}
      />

      {/* Floating bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{    y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 rounded-2xl shadow-xl"
            style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', minWidth: 340 }}
          >
            {/* Count pill */}
            <div className="flex items-center gap-2 px-2 mr-1">
              <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white tabular-nums">{selected.size}</span>
              </div>
              <span className="text-[12px] font-medium text-white/70">
                {selected.size === 1 ? '1 post selected' : `${selected.size} posts selected`}
              </span>
            </div>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Save to pipeline */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
              style={{ backgroundColor: 'rgba(139,92,246,0.20)', color: '#d8b4fe' }}
              title="Save to pipeline"
              onClick={async () => {
                try {
                  await saveForPipeline({ postIds: [...selected] as Id<'scrapedPosts'>[] });
                  toast.success(`${selected.size} post${selected.size === 1 ? '' : 's'} saved to pipeline`);
                  setSelected(new Set());
                } catch {
                  toast.error('Failed to save posts to pipeline');
                }
              }}
            >
              <BookmarkPlus size={11} />
              Save to pipeline
            </button>

            {/* Dismiss */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
              title="Dismiss"
              onClick={() => { /* TODO: wire bulk dismiss mutation */ }}
            >
              <X size={11} />
              Dismiss
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Clear selection */}
            <button
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] transition-all"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              title="Clear selection"
              onClick={() => setSelected(new Set())}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </TableCard>
  );
}
