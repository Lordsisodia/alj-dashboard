'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Bookmark, ArrowRight, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { NICHE_COLORS } from '@/features/intelligence/constants';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { DrawerPost } from '@/features/intelligence/types';
import { timeAgo } from '@/features/intelligence/utils';
import { SavedCard } from './SavedCard';
import { SendToPipelineModal } from './SendToPipelineModal';

const SORT_OPTIONS = [
  { value: 'newest',         label: 'Newest' },
  { value: 'most-likes',     label: 'Most Likes' },
  { value: 'most-views',     label: 'Most Views' },
  { value: 'most-saves',     label: 'Most Saves' },
  { value: 'top-engagement', label: 'Top Engagement' },
] as const;

type SortId = typeof SORT_OPTIONS[number]['value'];
type PipelineStatus = 'all' | 'unassigned' | 'sent';

interface SavedTabContentProps {
  onBrowseVault: () => void;
}

export function SavedTabContent({ onBrowseVault }: SavedTabContentProps) {
  const [searchQuery,     setSearchQuery]     = useState('');
  const [niche,           setNiche]           = useState<string>('all');
  const [sortBy,          setSortBy]          = useState<SortId>('newest');
  const [pipelineStatus,  setPipelineStatus]  = useState<PipelineStatus>('all');
  const [drawerIndex,     setDrawerIndex]     = useState<number | null>(null);
  const [modalPost,       setModalPost]       = useState<any | null>(null);

  const toggleSave = useMutation(api.intelligence.toggleSave);

  const savedPosts = useQuery(api.intelligence.getSavedPostsWithPipelineState, {
    niche:          niche === 'all' ? undefined : niche,
    sortBy,
    search:         searchQuery || undefined,
    pipelineStatus: pipelineStatus === 'all' ? undefined : pipelineStatus,
  });

  const stats = useQuery(api.intelligence.getSavedStatsV2);

  // Dynamic niches from real data
  const availableNiches = useMemo(() => {
    if (!savedPosts) return ['all'];
    const niches = new Set(savedPosts.map((p: any) => p.niche));
    return ['all', ...Array.from(niches).sort()];
  }, [savedPosts]);

  const drawerPosts: DrawerPost[] = (savedPosts ?? []) as DrawerPost[];
  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort';

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#fafafa' }}>

      {/* ── Status strip ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-wrap"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          {/* Pulsing active dot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#2563eb' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#2563eb' }} />
            </span>
            <span className="text-xs font-semibold text-neutral-800">Saved</span>
          </div>

          <div className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />

          <StatPill value={stats?.total      ?? '-'} label="reels"    />
          <StatPill value={stats?.unassigned ?? '-'} label="awaiting" accent="#d97706" />
          <StatPill value={stats?.sentToPipeline ?? '-'} label="sent" accent="#2563eb" />
          <StatPill value={stats?.creators   ?? '-'} label="creators" accent="#7c3aed" />

          {(stats?.sentThisWeek ?? 0) > 0 && (
            <>
              <div className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#2563eb' }}>+{stats!.sentThisWeek} this week</span>
            </>
          )}

          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            {stats?.lastSavedAt ? (
              <>
                <Clock size={10} className="text-neutral-400" />
                <span className="text-[11px] text-neutral-400">Last saved {timeAgo(stats.lastSavedAt)}</span>
              </>
            ) : (
              <span className="text-[11px] text-neutral-400">No saves yet</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Search + filters ───────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-3 space-y-2">
        {/* Search bar */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved reels..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)' }}
          />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={11} className="text-neutral-400 flex-shrink-0" />

          {/* Niche pills */}
          {availableNiches.map(n => {
            const active = niche === n;
            const color  = n === 'all' ? '#2563eb' : (NICHE_COLORS[n] ?? '#2563eb');
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

          {/* Pipeline status 3-state segment */}
          {(['unassigned', 'sent', 'all'] as PipelineStatus[]).map(s => {
            const active = pipelineStatus === s;
            const labels: Record<PipelineStatus, string> = { unassigned: 'Unassigned', sent: 'Sent', all: 'All' };
            return (
              <button
                key={s}
                onClick={() => setPipelineStatus(s)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={
                  active
                    ? { background: '#171717', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                }
              >
                {labels[s]}
              </button>
            );
          })}

          <div className="ml-auto">
            <SortDropdown value={sortBy} onChange={setSortBy} label={sortLabel} />
          </div>
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {savedPosts === undefined ? (
            // Loading skeleton
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="aspect-[4/5]" style={{ backgroundColor: '#f0f0f0' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded-full" style={{ backgroundColor: '#f0f0f0', width: '75%' }} />
                    <div className="h-3 rounded-full" style={{ backgroundColor: '#f0f0f0', width: '50%' }} />
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
                {searchQuery ? 'No reels match your search' : 'Nothing saved yet'}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 mb-4">
                {searchQuery ? 'Try a different keyword or clear the search' : 'Bookmark reels from the Vault to build your library'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onBrowseVault}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}
                >
                  Browse the Vault
                  <ArrowRight size={12} />
                </button>
              )}
            </motion.div>
          ) : (
            // Grid
            <motion.div
              key={`${niche}-${pipelineStatus}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {savedPosts.map((post: any, i: number) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                >
                  <SavedCard
                    post={post}
                    onSendToPipeline={() => setModalPost(post)}
                    onUnsave={() => toggleSave({ postId: post._id })}
                    onOpenDrawer={() => setDrawerIndex(i)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Post detail drawer ─────────────────────────────────────── */}
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

      {/* ── Send to Pipeline modal ────────────────────────────────── */}
      <SendToPipelineModal
        open={modalPost !== null}
        post={modalPost}
        onClose={() => setModalPost(null)}
        onSuccess={() => setModalPost(null)}
      />
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
                  color:           value === opt.value ? '#2563eb' : '#555',
                  backgroundColor: value === opt.value ? 'rgba(37,99,235,0.06)' : 'transparent',
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
