'use client';

import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import type { DrawerPost, SortId, VisibilityState } from '@/features/intelligence/types';
import type { DensityId } from '@/isso/ui/FeedControls';
import type { NicheERMap, CreatorStats } from '@/features/intelligence/utils';

interface ReconFeedTabProps {
  onPostClick:      (index: number, posts: DrawerPost[]) => void;
  onAnalyzeClick?:  (index: number, posts: DrawerPost[]) => void;
  sortBy:           SortId;
  visibility:       VisibilityState;
  viewMode:         'grid' | 'list';
  columns:          DensityId;
  creatorStatsMap:  Record<string, CreatorStats>;
  nicheERMap:       NicheERMap;
}

export function ReconFeedTab({ onPostClick, onAnalyzeClick, sortBy, visibility, viewMode, columns, creatorStatsMap, nicheERMap }: ReconFeedTabProps) {
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
