'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LOG_ENTRIES } from '../../../constants';

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtTs(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Avatar ─────────────────────────────────────────────────────────────────────

function CreatorAvatar({ handle, avatarUrl }: { handle: string; avatarUrl?: string | null }) {
  const [err, setErr] = useState(false);
  const initial = handle.replace('@', '').charAt(0).toUpperCase();
  const proxied = avatarUrl && !err ? avatarUrl : null;

  if (!proxied) {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #ef4444 100%)' }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={proxied}
      alt={handle}
      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ActivityFeed() {
  const live = useQuery(api.intelligence.getRecentActivity);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const prevLen      = useRef(0);
  const [flashIds, setFlashIds]       = useState<Set<number>>(new Set());
  const [unreadAbove, setUnreadAbove] = useState(false);

  // Detect new entries → flash + unread badge
  useEffect(() => {
    if (!live) return;
    if (live.length > prevLen.current) {
      const newCount = live.length - prevLen.current;
      setFlashIds(new Set(live.slice(0, newCount).map(e => e.id)));
      setTimeout(() => setFlashIds(new Set()), 2200);
      if ((scrollRef.current?.scrollTop ?? 0) > 80) setUnreadAbove(true);
    }
    prevLen.current = live.length;
  }, [live?.length]);

  function handleScroll() {
    if ((scrollRef.current?.scrollTop ?? 0) < 40) setUnreadAbove(false);
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setUnreadAbove(false);
  }

  const entries = live && live.length > 0
    ? live.map(e => ({
        id:            e.id,
        handle:        e.handle,
        count:         e.count,
        contentType:   e.contentType,
        timestamp:     fmtTs(e.ts),
        avatarUrl:     e.avatarUrl,
        followerCount: e.followerCount,
        isNew:         flashIds.has(e.id),
      }))
    : LOG_ENTRIES.map((e, i) => ({
        id:            i,
        handle:        e.handle,
        count:         1,
        contentType:   'reel',
        timestamp:     e.timestamp,
        avatarUrl:     null,
        followerCount: null,
        isNew:         false,
      }));

  return (
    <div className="flex flex-col h-full">

      {/* Header — never moves */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
          Live Activity
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-medium">
            {live && live.length > 0 ? 'Live' : 'Sample'}
          </span>
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative"
        onScroll={handleScroll}
      >
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => {
            const isLast = i === entries.length - 1;
            const label  = `${entry.count} ${entry.contentType}${entry.count !== 1 ? 's' : ''}`;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundColor: entry.isNew ? ['#fefce8', '#ffffff'] : '#ffffff',
                }}
                transition={{ duration: entry.isNew ? 2 : 0.2 }}
                className="flex gap-3 px-4 py-3 relative"
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
              >
                {/* Connector line */}
                {!isLast && (
                  <div
                    className="absolute left-[27px] top-12 bottom-0 w-px"
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  />
                )}

                {/* Avatar */}
                <div className="flex-shrink-0 mt-0.5 z-10">
                  <CreatorAvatar handle={entry.handle} avatarUrl={entry.avatarUrl} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <p className="text-xs text-neutral-700 leading-snug">
                    Scraped{' '}
                    <span className="font-semibold text-neutral-900">{label}</span>
                    {' '}from{' '}
                    <span className="font-semibold" style={{ color: '#ff0069' }}>{entry.handle}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-neutral-400">{entry.timestamp}</span>
                    {entry.followerCount != null && (
                      <>
                        <span className="text-neutral-200 text-[10px]">·</span>
                        <span className="text-[10px] text-neutral-400">
                          {fmtFollowers(entry.followerCount)} followers
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ↑ New badge */}
      <AnimatePresence>
        {unreadAbove && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white shadow-lg"
              style={{ backgroundColor: '#ff0069' }}
            >
              <ArrowUp size={11} />
              New activity
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
