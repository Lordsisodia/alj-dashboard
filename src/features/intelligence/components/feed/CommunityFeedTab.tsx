'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useFeedTab } from '@/features/recon/hooks/useFeedTab';
import { PipelineStatusStrip } from '../dashboard/PipelineStatusStrip';
import { FeedView } from './FeedView';
import { PostDetailDrawer } from '../drawer/PostDetailDrawer';
import { FeedFilterDropdown } from './FeedFilterDropdown';
import { SortPill, DensityPill, VisibilityPill } from '@/isso/ui/FeedControls';
import type { SortId, DensityId, DrawerPost } from '../../types';

export function CommunityFeedTab() {
  const stats = useQuery(api.intelligence.getStats, {});

  const {
    visibility,
    setVisibility,
    viewMode,
    creatorStatsMap,
    nicheERMap,
  } = useFeedTab();

  const [sortBy,      setSortBy]      = useState<SortId>('newest');
  const [columns,     setColumns]     = useState<DensityId>(4);
  const [niche,       setNiche]       = useState('');
  const [contentType, setContentType] = useState('');
  const [drawerPosts, setDrawerPosts] = useState<DrawerPost[]>([]);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  function handlePostClick(index: number, posts: DrawerPost[]) {
    setDrawerPosts(posts);
    setDrawerIndex(index);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <PipelineStatusStrip
        totalIndexed={stats?.totalIndexed ?? 0}
        postsThisWeek={stats?.postsThisWeek ?? 0}
        latestScrapeAt={stats?.latestScrapeAt ?? 0}
        analysedCount={stats?.analysedCount}
        avgHookScore={stats?.avgHookScore}
        controlsSlot={
          <div className="flex items-center gap-1.5">
            <FeedFilterDropdown
              niche={niche}
              onNicheChange={setNiche}
              contentType={contentType}
              onContentTypeChange={setContentType}
            />
            <SortPill value={sortBy as any} onChange={v => setSortBy(v as SortId)} />
            <DensityPill value={columns} onChange={v => setColumns(v)} />
            <VisibilityPill value={visibility} onChange={setVisibility} />
          </div>
        }
      />

      <FeedView
        sortBy={sortBy}
        niche={niche}
        contentType={contentType}
        visibility={visibility}
        viewMode={viewMode}
        columns={columns}
        onlyAnalyzed
        onPostClick={handlePostClick}
        creatorStatsMap={creatorStatsMap}
        nicheERMap={nicheERMap}
      />

      <AnimatePresence>
        {drawerOpen && drawerPosts.length > 0 && (
          <PostDetailDrawer
            posts={drawerPosts}
            initialIndex={drawerIndex}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
