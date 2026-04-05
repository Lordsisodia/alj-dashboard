'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Rss, TrendingUp, Bookmark, Plus } from 'lucide-react';
import type { Tab } from '../types';
import { POSTS } from '../constants';
import { PostCard } from './feed/PostCard';
import { LeaderboardSidebar } from './sidebar/LeaderboardSidebar';

// Re-export for Recon's existing import path
export { LeaderboardSidebar } from './sidebar/LeaderboardSidebar';

export default function CommunityFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPosts = POSTS.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reels')     return post.type === 'Reel';
    if (activeFilter === 'posts')     return post.type === 'Post';
    if (activeFilter === 'carousels') return post.type === 'Carousel';
    return true;
  }).filter(post => {
    if (activeTab === 'saved')    return post.saved;
    if (activeTab === 'trending') return post.likes > 6000;
    return true;
  });

  return (
    <ContentPageShell
      icon={<ProductIcon product="hub" size={32} />}
      title="Content Feed"
      stat={{ label: 'New posts', value: 12 }}
      searchPlaceholder="Search posts, creators..."
      actionLabel="New Post"
      actionIcon={<Plus size={14} />}
      tabs={[
        { id: 'feed',     label: 'Feed',     icon: <Rss size={13} /> },
        { id: 'trending', label: 'Trending', icon: <TrendingUp size={13} /> },
        { id: 'saved',    label: 'Saved',    icon: <Bookmark size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'reels',     label: 'Reels' },
        { id: 'posts',     label: 'Posts' },
        { id: 'carousels', label: 'Carousels' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      <div className="flex h-full" style={{ backgroundColor: '#fafafa' }}>
        {/* Main feed (3/4) */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredPosts.length === 0 ? (
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
                  {filteredPosts.map((post, i) => (
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

        {/* Leaderboard sidebar (1/4) */}
        <div
          className="hidden xl:block w-72 flex-shrink-0 overflow-y-auto p-4"
          style={{ borderLeft: '1px solid rgba(0,0,0,0.06)' }}
        >
          <LeaderboardSidebar />
        </div>
      </div>
    </ContentPageShell>
  );
}
