'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Rss } from 'lucide-react';
import { PostCard } from '../feed/PostCard';
import { LeaderboardSidebar } from '../sidebar/LeaderboardSidebar';
import { POSTS, NICHE_CONFIG } from '../../constants';
import type { Niche, ContentType } from '../../types';

const NICHES: { id: 'all' | Niche; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'fitness',   label: 'Fitness'   },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'fashion',   label: 'Fashion'   },
  { id: 'wellness',  label: 'Wellness'  },
];

const TYPES: { id: 'all' | ContentType; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'Reel',      label: 'Reels'     },
  { id: 'Post',      label: 'Posts'     },
  { id: 'Carousel',  label: 'Carousels' },
];

interface VaultTabContentProps {
  onStartSession: () => void;
}

export function VaultTabContent({ onStartSession }: VaultTabContentProps) {
  const [niche, setNiche]   = useState<'all' | Niche>('all');
  const [type,  setType]    = useState<'all' | ContentType>('all');

  const filtered = POSTS.filter(p => {
    const matchNiche = niche === 'all' || p.niche === niche;
    const matchType  = type  === 'all' || p.type  === type;
    return matchNiche && matchType;
  });

  const reelCount     = POSTS.filter(p => p.type === 'Reel').length;
  const postCount     = POSTS.filter(p => p.type === 'Post').length;
  const carouselCount = POSTS.filter(p => p.type === 'Carousel').length;
  const approvedCount = POSTS.filter(p => p.approved).length;

  return (
    <div className="flex h-full" style={{ backgroundColor: '#fafafa' }}>
      {/* Main area */}
      <div className="flex-1 min-w-0 overflow-y-auto p-4 space-y-3">
        {/* Toolbar */}
        <div className="flex flex-col gap-2">
          {/* Row 1: niche + swipe CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {NICHES.map(n => {
                const active = niche === n.id;
                const cfg = n.id !== 'all' ? NICHE_CONFIG[n.id] : null;
                return (
                  <button
                    key={n.id}
                    onClick={() => setNiche(n.id)}
                    className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                    style={
                      active
                        ? {
                            background: cfg
                              ? cfg.color
                              : 'linear-gradient(135deg, #ff0069, #833ab4)',
                            color: '#fff',
                          }
                        : { background: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                    }
                  >
                    {n.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={onStartSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              <Shuffle size={12} />
              Start Swipe Session
            </button>
          </div>

          {/* Row 2: type filters */}
          <div className="flex items-center gap-1.5">
            {TYPES.map(t => {
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={
                    active
                      ? { background: '#171717', color: '#fff' }
                      : { background: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats bar */}
        <p className="text-[10px] text-neutral-400">
          {POSTS.length} total · {reelCount} reels · {postCount} posts · {carouselCount} carousels · {approvedCount} approved
        </p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${niche}-${type}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Rss size={24} className="text-neutral-300" />
                </div>
                <p className="text-sm font-medium text-neutral-500">Nothing here</p>
                <p className="text-xs text-neutral-400 mt-0.5">No posts match the current filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Leaderboard sidebar */}
      <div
        className="hidden xl:block w-72 flex-shrink-0 overflow-y-auto p-4"
        style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}
      >
        <LeaderboardSidebar />
      </div>
    </div>
  );
}
