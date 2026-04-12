'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Radio, CheckCircle2, Bookmark, LayoutGrid, List, Search, User, ChevronDown, Check } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import { FilterPill } from '@/features/recon/components/table/filters/FilterPill';
import { ViewToggle } from '@/components/ui/view-toggle';
import { LeaderboardSidebar } from '../sidebar/LeaderboardSidebar';
import { POSTS } from '../../constants';
import type { SortId } from '@/features/intelligence/types';

const NICHE_OPTS = [
  { value: 'fitness',   label: 'Fitness'   },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'fashion',   label: 'Fashion'   },
  { value: 'wellness',  label: 'Wellness'  },
];

const TYPE_OPTS = [
  { value: 'Reel',     label: 'Reels'     },
  { value: 'Post',     label: 'Posts'     },
  { value: 'Carousel', label: 'Carousels' },
];

const SORT_OPTS: { value: SortId; label: string }[] = [
  { value: 'top-engagement', label: 'Top Engagement' },
  { value: 'most-views',     label: 'Most Views'     },
  { value: 'most-likes',     label: 'Most Likes'     },
  { value: 'most-saves',     label: 'Most Saves'     },
  { value: 'newest',         label: 'Newest'         },
  { value: 'trending',       label: 'Trending'       },
];

interface VaultTabContentProps {
  onStartSession: () => void;
}

export function VaultTabContent({ onStartSession }: VaultTabContentProps) {
  const [niche,    setNiche]    = useState('');
  const [type,     setType]     = useState('');
  const [sortBy,   setSortBy]   = useState<SortId>('top-engagement');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [handle,   setHandle]   = useState('');

  const accounts = useQuery(api.trackedAccounts.list) ?? [];

  const total    = POSTS.length;
  const approved = POSTS.filter(p => p.approved).length;
  const saved    = POSTS.filter(p => p.saved).length;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fafafa' }}>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 flex-shrink-0">
        <div
          className="flex items-center gap-0 px-4 py-2.5 rounded-xl bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {/* Status */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-[11px] font-bold text-neutral-700">Vault</span>
          </div>

          <span className="w-px h-4 bg-neutral-200 mx-4 flex-shrink-0" />

          {/* Totals */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Radio size={10} className="text-blue-500" />
              <span className="font-semibold text-neutral-800">{total}</span> posts
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <CheckCircle2 size={10} className="text-blue-500" />
              <span className="font-semibold text-neutral-800">{approved}</span> approved
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Bookmark size={10} className="text-blue-500" />
              <span className="font-semibold text-neutral-800">{saved}</span> saved
            </span>
          </div>

          <span className="w-px h-4 bg-neutral-200 mx-4 flex-shrink-0" />

          {/* Filters inline */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <FilterPill
              label="Niche"
              options={NICHE_OPTS}
              value={niche}
              onChange={v => setNiche(v as string)}
              accentColor="#2563eb"
            />
            <FilterPill
              label="Type"
              options={TYPE_OPTS}
              value={type}
              onChange={v => setType(v as string)}
              accentColor="#2563eb"
            />
            <FilterPill
              label="Sort"
              options={SORT_OPTS}
              value={sortBy}
              onChange={v => setSortBy(v as SortId)}
              accentColor="#2563eb"
              neutral
            />
            <CreatorPill
              accounts={accounts}
              value={handle}
              onChange={setHandle}
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View toggle */}
          <ViewToggle
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'grid', icon: <LayoutGrid size={11} /> },
              { value: 'list', icon: <List size={11} /> },
            ]}
          />

          <span className="w-px h-4 bg-neutral-200 mx-3 flex-shrink-0" />

          {/* Start Swipe */}
          <button
            onClick={onStartSession}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-white flex-shrink-0 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            <Play size={10} className="fill-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main area */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">

          {/* Feed */}
          <FeedView
            sortBy={sortBy}
            niche={niche}
            contentType={type}
            handle={handle || undefined}
            viewMode={viewMode}
            columns={3}
            visibility={{ brandDetails: true, likeCount: true, viewCount: true, saveCount: true }}
            onPostClick={() => {}}
          />
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block w-72 flex-shrink-0 flex flex-col py-4">
          <LeaderboardSidebar />
        </div>
      </div>
    </div>
  );
}

// ── Creator filter pill with search ──────────────────────────────────────────

interface CreatorPillProps {
  accounts: { handle: string }[];
  value: string;
  onChange: (v: string) => void;
}

function CreatorPill({ accounts, value, onChange }: CreatorPillProps) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const filtered = accounts
    .map(a => a.handle)
    .filter(h => h.toLowerCase().includes(search.toLowerCase()));

  const isActive = !!value;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap border"
        style={isActive
          ? { backgroundColor: 'rgba(37,99,235,0.06)', color: '#2563eb', borderColor: 'rgba(37,99,235,0.18)' }
          : { color: '#525252', borderColor: 'transparent', backgroundColor: 'transparent' }
        }
      >
        <User size={10} />
        {isActive ? value : 'Creator'}
        <ChevronDown size={10} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] w-52 rounded-xl z-50 overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          {/* Search */}
          <div className="px-2 pt-2 pb-1">
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search creator..."
                className="w-full pl-7 pr-3 py-1.5 rounded-lg text-[11px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
                style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid transparent' }}
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto py-1">
            {value && (
              <button
                onClick={() => { onChange(''); setSearch(''); setOpen(false); }}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-400 hover:bg-black/[0.04] transition-colors"
              >
                Clear filter
              </button>
            )}
            {filtered.length === 0 && (
              <p className="px-3 py-3 text-[11px] text-neutral-400 text-center">No creators found</p>
            )}
            {filtered.map(h => (
              <button
                key={h}
                onClick={() => { onChange(h); setSearch(''); setOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                {h}
                {value === h && <Check size={11} style={{ color: '#2563eb' }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
