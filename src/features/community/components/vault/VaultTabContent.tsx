'use client';

import { useState } from 'react';
import { Shuffle, SlidersHorizontal } from 'lucide-react';
import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import { FilterPill } from '@/features/recon/components/table/filters/FilterPill';
import { LeaderboardSidebar } from '../sidebar/LeaderboardSidebar';
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
  const [niche,  setNiche]  = useState('');
  const [type,   setType]   = useState('');
  const [sortBy, setSortBy] = useState<SortId>('top-engagement');

  return (
    <div className="flex h-full" style={{ backgroundColor: '#fafafa' }}>
      {/* Main area */}
      <div className="flex-1 min-w-0 overflow-y-auto p-4 space-y-3">

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={12} className="text-neutral-400 flex-shrink-0" />
            <FilterPill
              label="Niche"
              options={NICHE_OPTS}
              value={niche}
              onChange={v => setNiche(v as string)}
            />
            <FilterPill
              label="Type"
              options={TYPE_OPTS}
              value={type}
              onChange={v => setType(v as string)}
            />
            <FilterPill
              label="Sort"
              options={SORT_OPTS}
              value={sortBy}
              onChange={v => setSortBy(v as SortId)}
            />
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

        {/* Feed — real Convex data */}
        <FeedView
          sortBy={sortBy}
          niche={niche}
          contentType={type}
          viewMode="grid"
          columns={3}
          visibility={{ brandDetails: true, likeCount: true, viewCount: true, saveCount: true }}
          onPostClick={() => {}}
        />
      </div>

      {/* Sidebar — top creators only */}
      <div
        className="hidden xl:block w-72 flex-shrink-0 overflow-y-auto p-4"
        style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}
      >
        <LeaderboardSidebar />
      </div>
    </div>
  );
}
