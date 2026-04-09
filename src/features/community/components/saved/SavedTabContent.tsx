'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Bookmark, ArrowRight, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { NICHE_COLORS } from '@/features/intelligence/constants';
import { PostCard } from '@/features/intelligence/components/feed/PostCard';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { DrawerPost } from '@/features/intelligence/types';
import { timeAgo } from '@/features/intelligence/utils';

const SORT_OPTIONS = [
  { value: 'newest',          label: 'Newest' },
  { value: 'most-likes',     label: 'Most Likes' },
  { value: 'most-views',     label: 'Most Views' },
  { value: 'most-saves',     label: 'Most Saves' },
  { value: 'top-engagement',  label: 'Top Engagement' },
] as const;

type SortId = typeof SORT_OPTIONS[number]['value'];

interface SavedTabContentProps {
  onBrowseVault: () => void;
}

export function SavedTabContent({ onBrowseVault }: SavedTabContentProps) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [niche,        setNiche]        = useState<string>('all');
  const [contentType,  setContentType]  = useState<string>('all');
  const [sortBy,       setSortBy]       = useState<SortId>('newest');
  const [drawerIndex,  setDrawerIndex]  = useState<number | null>(null);

  const savedPosts = useQuery(api.intelligence.getSavedPosts, {
    niche:       niche       === 'all' ? undefined : niche,
    contentType: contentType === 'all' ? undefined : contentType,
    sortBy,
    search:      searchQuery || undefined,
  });

  const stats = useQuery(api.intelligence.getSavedStats);

  // Dynamically derive available niches from real data
  const availableNiches = useMemo(() => {
    if (!savedPosts) return ['all'] as const;
    const niches = new Set(savedPosts.map(p => p.niche));
    return ['all', ...Array.from(niches).sort()] as const;
  }, [savedPosts]);

  const drawerPosts: DrawerPost[] = (savedPosts ?? []) as DrawerPost[];
  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort';

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#fafafa' }}>

      {/* ── Status strip ──────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          {/* Pulsing active dot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#ff0069' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#ff0069' }} />
            </span>
            <span className="text-xs font-semibold text-neutral-800">Saved</span>
          </div>

          <div className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />

          <StatPill value={stats?.total  ?? '-'} label="posts"    accent="#ff0069" />
          <StatPill value={stats?.creators ?? '-'} label="creators" accent="#833ab4" />

          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            {stats?.lastSavedAt ? (
              <>
                <Clock size={10} className="text-neutral-400" />
                <span className="text-[11px] text-neutral-400">Saved {timeAgo(stats.lastSavedAt)}</span>
              </>
            ) : (
              <span className="text-[11px] text-neutral-400">No saves yet</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Search + filters ───────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-3 space-y-2">
        {/* Search bar */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved posts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
          />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={11} className="text-neutral-400 flex-shrink-0" />

          {/* Niche pills — dynamic from real data */}
          {availableNiches.map(n => {
            const active = niche === n;
            const color  = n === 'all' ? '#ff0069' : (NICHE_COLORS[n] ?? '#833ab4');
            return (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={
                  active
                    ? { background: color, color: '#fff' }
                    : { backgroundColor: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                }
              >
                {n === 'all' ? 'All' : n}
              </button>
            );
          })}

          <div className="w-px h-4 mx-1" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />

          {/* Content type pills */}
          {(['all', 'reel', 'post', 'carousel'] as const).map(t => {
            const active = contentType === t;
            return (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize"
                style={
                  active
                    ? { background: '#171717', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                }
              >
                {t === 'all' ? 'All' : `${t}s`}
              </button>
            );
          })}

          <div className="ml-auto">
            <SortDropdown value={sortBy} onChange={setSortBy} label={sortLabel} />
          </div>
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {savedPosts === undefined ? (
            // Loading skeleton
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gap-4"
              style={{ columns: '1 180px, 2 280px, 3 360px, 4 480px' }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-4">
                  <div
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    <div className="aspect-[4/5]" style={{ backgroundColor: '#f0f0f0' }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded-full" style={{ backgroundColor: '#f0f0f0', width: '75%' }} />
                      <div className="h-3 rounded-full" style={{ backgroundColor: '#f0f0f0', width: '50%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : savedPosts.length === 0 ? (
            // Empty state
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <Bookmark size={24} className="text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-500">
                {searchQuery ? 'No posts match your search' : 'Nothing saved yet'}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 mb-4">
                {searchQuery ? 'Try a different keyword or clear the search' : 'Bookmark content from the Vault to build your library'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onBrowseVault}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }}
                >
                  Browse the Vault
                  <ArrowRight size={12} />
                </button>
              )}
            </motion.div>
          ) : (
            // Masonry grid — keys change on filter to trigger fade
            <motion.div
              key={`${niche}-${contentType}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="gap-4"
              style={{ columns: '1 180px, 2 280px, 3 360px, 4 480px' }}
            >
              {savedPosts.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="break-inside-avoid mb-4"
                >
                  <PostCard
                    post={post as any}
                    visibility={{ brandDetails: true, likeCount: true, viewCount: true, saveCount: true }}
                    onPostClick={() => setDrawerIndex(i)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Post detail drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {drawerIndex !== null && (
          <PostDetailDrawer
            key="saved-drawer"
            posts={drawerPosts as any}
            initialIndex={drawerIndex}
            onClose={() => setDrawerIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ value, label, accent = '#2563eb' }: { value: string | number; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold" style={{ color: accent }}>{value}</span>
      <span className="text-[11px] text-neutral-400">{label}</span>
    </div>
  );
}

function SortDropdown({ value, onChange, label }: { value: SortId; onChange: (v: SortId) => void; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', color: '#555' }}
      >
        {label}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-20 rounded-xl py-1 shadow-xl min-w-[140px]"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-[11px] font-medium transition-colors"
                style={{
                  color:        value === opt.value ? '#ff0069' : '#555',
                  backgroundColor: value === opt.value ? 'rgba(255,0,105,0.06)' : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
