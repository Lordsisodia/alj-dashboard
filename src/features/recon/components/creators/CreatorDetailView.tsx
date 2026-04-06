'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, ExternalLink } from 'lucide-react';
import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { DrawerPost } from '@/features/intelligence/types';
import { DEFAULT_VISIBILITY } from '@/isso/ui/FeedControls';
import type { Competitor } from '../../types';
import { ScoreBadge } from './ScoreBadge';

interface Props { creator: Competitor; onBack: () => void; }

export function CreatorDetailView({ creator: c, onBack }: Props) {
  const [drawer, setDrawer] = useState<{ posts: DrawerPost[]; index: number } | null>(null);

  const statItems = [
    { label: 'Followers',    value: c.followers },
    { label: 'Eng. Rate',    value: c.engagementRate },
    { label: 'Posts / Week', value: String(c.postsPerWeek) },
    { label: 'Posts Today',  value: String(c.postsToday) },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="w-full">
        <div className="px-5 pt-4 pb-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors mb-4">
            <ArrowLeft size={13} /> Back to Creators
          </button>

          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {c.favorited && <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', padding: '2.5px', borderRadius: '50%', margin: '-2.5px' }} />}
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>
                {c.initials}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-neutral-900">{c.displayName}</h2>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}>{c.niche}</span>
                <ScoreBadge score={c.score} />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Instagram size={12} className="text-neutral-400" />
                <span className="text-sm text-neutral-400">{c.handle}</span>
                <a href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-neutral-500 transition-colors">
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
              {statItems.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">{s.value}</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-3">Reels</p>
          <FeedView sortBy="newest" visibility={DEFAULT_VISIBILITY} viewMode="grid" handle={c.handle} contentType="reel" onPostClick={(index, posts) => setDrawer({ index, posts })} />
        </div>
      </motion.div>

      {drawer && <PostDetailDrawer posts={drawer.posts} initialIndex={drawer.index} onClose={() => setDrawer(null)} />}
    </>
  );
}
