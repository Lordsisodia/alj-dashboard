'use client';

import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import type { DrawerPost } from '@/features/intelligence/types';
import { useFeedTab } from '../../hooks/useFeedTab';

export function ReconFeedTab({ onPostClick, onAnalyzeClick }: { onPostClick: (index: number, posts: DrawerPost[]) => void; onAnalyzeClick?: (index: number, posts: DrawerPost[]) => void }) {
  const { sortBy, visibility, viewMode, columns, creatorStatsMap, nicheERMap } = useFeedTab();
  return (
    <FeedView
      sortBy={sortBy}
      visibility={visibility}
      viewMode={viewMode}
      columns={columns}
      onPostClick={onPostClick}
      onAnalyzeClick={onAnalyzeClick}
      creatorStatsMap={creatorStatsMap}
      nicheERMap={nicheERMap}
    />
  );
}
