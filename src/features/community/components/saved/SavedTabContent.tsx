'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ArrowRight } from 'lucide-react';
import { PostCard } from '../feed/PostCard';
import { POSTS, NICHE_CONFIG } from '../../constants';
import type { Niche } from '../../types';

const NICHES: { id: 'all' | Niche; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'fitness',   label: 'Fitness'   },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'fashion',   label: 'Fashion'   },
  { id: 'wellness',  label: 'Wellness'  },
];

interface SavedTabContentProps {
  onBrowseVault: () => void;
}

export function SavedTabContent({ onBrowseVault }: SavedTabContentProps) {
  const [niche, setNiche] = useState<'all' | Niche>('all');

  const savedPosts = POSTS.filter(p => p.saved);

  const filtered = savedPosts.filter(p =>
    niche === 'all' || p.niche === niche
  );

  // Group by niche for display
  const niches: Niche[] = ['fitness', 'lifestyle', 'fashion', 'wellness'];
  const grouped = niches
    .map(n => ({ niche: n, posts: filtered.filter(p => p.niche === n) }))
    .filter(g => g.posts.length > 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#fafafa' }}>
      {/* Niche filters */}
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
        <span className="text-[10px] text-neutral-400 ml-1">
          {savedPosts.length} saved
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <Bookmark size={24} className="text-neutral-300" />
          </div>
          <p className="text-sm font-medium text-neutral-500">Nothing saved yet</p>
          <p className="text-xs text-neutral-400 mt-0.5 mb-4">Bookmark content from the Vault to save it here</p>
          <button
            onClick={onBrowseVault}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }}
          >
            Browse the Vault
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Grouped by niche */}
      <AnimatePresence mode="wait">
        <motion.div
          key={niche}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-5"
        >
          {niche === 'all'
            ? grouped.map(({ niche: n, posts }) => (
                <NicheGroup
                  key={n}
                  niche={n}
                  posts={posts}
                />
              ))
            : filtered.length > 0 && (
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
  );
}

function NicheGroup({ niche, posts }: { niche: Niche; posts: ReturnType<typeof POSTS.filter> }) {
  const cfg = NICHE_CONFIG[niche];
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px]">📌</span>
        <span className="text-xs font-bold" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {posts.length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {posts.map((post, i) => (
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
    </div>
  );
}
