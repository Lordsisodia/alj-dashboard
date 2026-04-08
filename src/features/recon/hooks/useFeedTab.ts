import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { DensityId } from '@/isso/ui/FeedControls';
import type { DrawerState } from '../types';
import type { NicheERMap } from '@/features/intelligence/utils';
import type { CreatorStats } from '@/features/intelligence/utils';
import type { SortId, VisibilityState } from '@/features/intelligence/types';
import { DEFAULT_VISIBILITY } from '@/features/intelligence/types';

export function useFeedTab() {
  const [sortBy, setSortBy]                 = useState<SortId>('newest');
  const [visibility, setVisibility]         = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid');
  const [columns, setColumns]               = useState<DensityId>(4);
  const [drawer, setDrawer]                 = useState<DrawerState | null>(null);

  const creatorStats = useQuery(api.intelligence.getCreatorStats, {});
  const trends       = useQuery(api.intelligence.getTrends, { days: 30 });

  // Build nicheERMap from trends data: niche -> avgER
  const nicheERMap: NicheERMap = {};
  for (const n of trends?.nicheStats ?? []) {
    nicheERMap[n.niche] = n.avgER;
  }

  // Build creatorStatsMap: handle -> CreatorStats
  const creatorStatsMap: Record<string, CreatorStats> = {};
  for (const c of creatorStats ?? []) {
    creatorStatsMap[c.handle] = {
      handle:        c.handle,
      postsThisWeek: c.postsThisWeek,
      trendBuckets:  c.trendBuckets ?? [],
    };
  }

  return {
    sortBy,
    setSortBy,
    visibility,
    setVisibility,
    viewMode,
    setViewMode,
    columns,
    setColumns,
    drawer,
    setDrawer,
    creatorStatsMap,
    nicheERMap,
  };
}
