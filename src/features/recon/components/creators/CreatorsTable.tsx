'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Heart } from 'lucide-react';
import { COMPETITORS } from '../../constants';
import type { Competitor } from '../../types';
import { ScoreColumnHeader } from './ScoreColumnHeader';
import { CreatorsFilterBar, DEFAULT_FILTERS, type CreatorFilters } from './CreatorsFilterBar';
import { CreatorRow } from './CreatorRow';
import { TABLE_COLS, COL_BORDER, applyFilters, relativeTime, formatFollowers } from './tableUtils';
import { cn } from '@/lib/utils';

interface CreatorsTableProps {
  showFavoritesOnly: boolean;
  onOpen: (c: Competitor) => void;
  extraCreators?: Competitor[];
}

export function CreatorsTable({ showFavoritesOnly, onOpen, extraCreators = [] }: CreatorsTableProps) {
  const [creators, setCreators]   = useState<Competitor[]>([...extraCreators, ...COMPETITORS]);
  const [filters, setFilters]     = useState<CreatorFilters>(DEFAULT_FILTERS);
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [enriching, setEnriching] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (extraCreators.length > 0) {
      setCreators(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const fresh = extraCreators.filter(c => !existingIds.has(c.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCreators]);

  const liveStats = useQuery(api.intelligence.getCreatorStats, {});
  const mergedCreators = creators.map(c => {
    const live = liveStats?.find(s => s.handle === c.handle);
    if (!live || live.totalPosts === 0) return c;
    return {
      ...c,
      followers:      live.followerCount > 0 ? formatFollowers(live.followerCount) : c.followers,
      engagementRate: live.avgEngagement  > 0 ? `${live.avgEngagement}%`           : c.engagementRate,
      postsPerWeek:   live.postsThisWeek  >= 0 ? live.postsThisWeek                : c.postsPerWeek,
      trend:          live.trendBuckets.some((v: number) => v > 0) ? live.trendBuckets : c.trend,
      lastScraped:    relativeTime(live.lastScrapedAt ?? live.lastPostAt),
      _totalPosts: live.totalPosts, _totalLikes: live.totalLikes, _totalViews: live.totalViews,
    };
  });

  const filtered = applyFilters(
    mergedCreators.filter(c => !showFavoritesOnly || c.favorited),
    filters,
  );

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  function toggleSelect(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  function toggleFavorite(id: number, e: React.MouseEvent) { e.stopPropagation(); setCreators(prev => prev.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c)); }
  function toggleStatus(id: number, e: React.MouseEvent)  { e.stopPropagation(); setCreators(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c)); }
  function handleEnrich(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setEnriching(id);
    setTimeout(() => setEnriching(null), 2000);
  }

  return (
    <div className="w-full">
      <CreatorsFilterBar filters={filters} onChange={setFilters} />
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="grid min-w-0 border-b" style={{ gridTemplateColumns: TABLE_COLS, height: 36, backgroundColor: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
          <div className="flex items-center justify-center h-full" style={{ borderRight: COL_BORDER }} />
          <div className="flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300" style={{ borderRight: COL_BORDER }}>#</div>
          {(['Creator', 'Niche'] as string[]).concat(['Followers', 'Eng. Rate']).map((label, i) => (
            <div key={label} className={cn('flex items-center h-full px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400', i > 1 && 'justify-end')} style={{ borderRight: COL_BORDER }}>
              {label}
            </div>
          ))}
          <div className="flex items-center h-full px-3" style={{ borderRight: COL_BORDER }}><ScoreColumnHeader /></div>
          <div className="flex items-center h-full px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400" style={{ borderRight: COL_BORDER }}>Profile Health</div>
          <div className="flex items-center h-full px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400" style={{ borderRight: COL_BORDER }}>Trend</div>
          <div />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <Heart size={28} className="mb-3 opacity-30" /><p className="text-sm font-medium">No creators match</p>
            <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
          </div>
        ) : (
          <div ref={scrollRef} style={{ height: 'calc(100vh - 340px)', overflowY: 'auto' }}>
            <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const c = filtered[virtualRow.index];
                return (
                  <div
                    key={c.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <CreatorRow
                      creator={c as Competitor & { _totalPosts?: number }}
                      rowIdx={virtualRow.index}
                      isSelected={selected.has(c.id)}
                      isEnriching={enriching === c.id}
                      onOpen={() => onOpen(c)}
                      onSelect={(e) => toggleSelect(c.id, e)}
                      onFavorite={(e) => toggleFavorite(c.id, e)}
                      onToggleStatus={(e) => toggleStatus(c.id, e)}
                      onEnrich={(e) => handleEnrich(c.id, e)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
