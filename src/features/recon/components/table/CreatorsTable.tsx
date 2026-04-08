'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Heart, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPETITORS, computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import { DEFAULT_FILTERS, POSTS_OPTS, type CreatorFilters } from './filters/CreatorsFilterBar';
import { TableToolbar } from './TableToolbar';
import { ColumnFilterHeader } from './filters/ColumnFilterHeader';
import { CreatorRow } from './rows/CreatorRow';
import { CreatorCard } from './cards/CreatorCard';
import { BulkActionBar } from './BulkActionBar';
import { COLUMN_DEFS, DEFAULT_COL_VISIBILITY, buildGridCols, computeTableWidth, COL_BORDER, applyFilters, applyStatusFilter, STATUS_VIEWS, relativeTime, formatFollowers, NICHE_OPTS, HEALTH_OPTS, type ColVisibility, type StatusView } from './tableUtils';
import { useEnrich } from '../../hooks/useEnrich';
import { useCreatorsTab } from '../../hooks/useCreatorsTab';

interface CreatorsTableProps {
  onOpen: (c: Competitor) => void;
  extraCreators?: Competitor[];
  searchQuery?: string;
  statusCounts: Record<StatusView, number>;
  onStatusCountsChange: (c: Record<StatusView, number>) => void;
  viewMode: 'list' | 'grid';
  colVis: ColVisibility;
  onColVisChange: (v: ColVisibility) => void;
}

export function CreatorsTable({ onOpen, extraCreators = [], searchQuery = '', statusCounts, onStatusCountsChange, viewMode, colVis, onColVisChange }: CreatorsTableProps) {
  const { showFavorites, setShowFavorites, creatorsStatusView, setCreatorsStatusView } = useCreatorsTab();
  const [creators, setCreators]     = useState<Competitor[]>([...extraCreators, ...COMPETITORS]);
  const [filters, setFilters]       = useState<CreatorFilters>(DEFAULT_FILTERS);
  const [selected, setSelected]     = useState<Set<number>>(new Set());
  const showFavoritesOnly = showFavorites;
  const statusView = creatorsStatusView;
  const { enrich, isEnriching }     = useEnrich();
  const scrollRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof CreatorFilters>(key: K, val: CreatorFilters[K]) => setFilters(f => ({ ...f, [key]: val }));

  useEffect(() => {
    if (extraCreators.length > 0) {
      setCreators(prev => {
        const ids = new Set(prev.map(c => c.id));
        const fresh = extraCreators.filter(c => !ids.has(c.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCreators]);

  const liveStats  = useQuery(api.intelligence.getCreatorStats, {});
  const candidates = useQuery(api.candidates.list, { status: 'approved' });

  const merged = creators.map(c => {
    const live = liveStats?.find(s => s.handle === c.handle);
    const cand = candidates?.find(y => y.handle === c.handle);
    return {
      ...c,
      ...(live && {
        followers:      live.followerCount > 0 ? formatFollowers(live.followerCount) : c.followers,
        engagementRate: live.avgEngagement  > 0 ? `${live.avgEngagement}%`           : c.engagementRate,
        postsPerWeek:   live.postsThisWeek  >= 0 ? live.postsThisWeek                : c.postsPerWeek,
        trend:          live.trendBuckets.some((v: number) => v > 0) ? live.trendBuckets : c.trend,
        lastScraped:    relativeTime(live.lastScrapedAt ?? live.lastPostAt),
        ...(live.bio                           && { bio:                    live.bio                   }),
        ...(live.avatarUrl                     && { profilePicUrl:          live.avatarUrl             }),
        ...(live.verified          != null        && { verified:            live.verified              }),
        ...(live.followsCount      != null        && { followsCount:        live.followsCount          }),
        ...(live.postsCount        != null        && { postsCount:          live.postsCount            }),
        ...(live.externalUrl                   && { externalUrl:            live.externalUrl           }),
        ...(live.isBusinessAccount != null        && { isBusinessAccount:   live.isBusinessAccount     }),
        ...(live.isProfessionalAccount != null    && { isProfessionalAccount: live.isProfessionalAccount }),
        ...(live.businessCategoryName          && { businessCategoryName:   live.businessCategoryName  }),
        ...(live.businessEmail                 && { businessEmail:          live.businessEmail         }),
        ...(live.isPrivate         != null        && { isPrivate:           live.isPrivate             }),
        ...(live.igtvVideoCount    != null        && { igtvVideoCount:      live.igtvVideoCount        }),
        ...(live.instagramId                   && { instagramId:            live.instagramId           }),
        _totalPosts:   live.totalPosts,
        _totalLikes:   live.totalLikes,
        _totalViews:   live.totalViews,
        _enrichStatus: live.enrichStatus,
        postsThisWeek: live.postsThisWeek,
      }),
      ...(cand && {
        aiScore:          cand.aiScore,
        aiVerdict:        cand.aiVerdict,
        aiReason:         cand.aiReason,
        highlightReelCount: cand.highlightReelCount,
        source:           cand.source,
      }),
    };
  });

  const q = searchQuery.toLowerCase().trim();
  const searchFiltered = merged.filter(c =>
    (!showFavoritesOnly || c.favorited) &&
    (!q || c.handle.toLowerCase().includes(q) || c.displayName.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q))
  );

  // Status counts (computed before status filter applied)
  const computedStatusCounts = Object.fromEntries(
    STATUS_VIEWS.map(sv => [sv.key, applyStatusFilter(searchFiltered as any, sv.key).length])
  ) as Record<StatusView, number>;

  // Sync counts to parent so StatusDropdown stays in sync
  useEffect(() => { onStatusCountsChange(computedStatusCounts); }, [computedStatusCounts, onStatusCountsChange]);

  const statusFiltered = applyStatusFilter(searchFiltered as any, statusView);
  const filtered       = applyFilters(statusFiltered as any, filters);

  const gridCols   = buildGridCols(colVis);
  const tableWidth = computeTableWidth(colVis);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  // -- Row interactions ----------------------------------------------------------
  function toggleSelect(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  function toggleFavorite(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c));
  }
  function toggleStatus(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
  }

  // -- Select-all ----------------------------------------------------------------
  const allFilteredIds   = filtered.map(c => c.id);
  const allSelected      = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id));
  const someSelected     = allFilteredIds.some(id => selected.has(id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.delete(id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); allFilteredIds.forEach(id => s.add(id)); return s; });
    }
  }

  // -- Bulk actions --------------------------------------------------------------
  function bulkEnrich() {
    const handles = filtered.filter(c => selected.has(c.id)).map(c => c.handle);
    handles.forEach(h => enrich(h));
  }
  function bulkFavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: true } : c));
  }
  function bulkUnfavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: false } : c));
  }

  const enrichingCount = filtered.filter(c => selected.has(c.id) && isEnriching(c.handle)).length;

  // -- Header helpers ------------------------------------------------------------
  const hdrCell = { borderRight: COL_BORDER };
  const hdrBase = 'flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400';

  const visibleCols = COLUMN_DEFS.filter(c => colVis[c.key]);

  return (
    <div className="w-full relative">
      <TableToolbar
        count={filtered.length}
        total={merged.length}
        filters={filters}
        onClearFilters={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <SearchX size={28} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No creators match</p>
            <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
            {filtered.map(c => (
              <CreatorCard
                key={c.id}
                creator={c as Competitor & { _totalPosts?: number }}
                isEnriching={isEnriching(c.handle)}
                isSelected={selected.has(c.id)}
                onOpen={() => onOpen(c)}
                onSelect={e => toggleSelect(c.id, e)}
                onFavorite={e => toggleFavorite(c.id, e)}
                onEnrich={e => { e.stopPropagation(); enrich(c.handle); }}
              />
            ))}
          </div>
        )
      ) : (
        /* LIST VIEW */
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="grid" style={{ gridTemplateColumns: gridCols, height: 36, backgroundColor: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.10)', width: tableWidth, minWidth: '100%' }}>
            {/* Select-all checkbox */}
            <div
              className="flex items-center justify-center cursor-pointer"
              style={hdrCell}
              onClick={toggleSelectAll}
            >
              <div className={cn(
                'w-3.5 h-3.5 rounded flex items-center justify-center border transition-all',
                allSelected  ? 'bg-blue-500 border-blue-500' :
                someSelected ? 'bg-blue-200 border-blue-300' :
                               'border-neutral-300 bg-white hover:border-neutral-400',
              )}>
                {allSelected  && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {someSelected && !allSelected && <div className="w-1.5 h-0.5 rounded-full bg-blue-500" />}
              </div>
            </div>

            <div className={hdrBase} style={hdrCell}>#</div>
            <ColumnFilterHeader label="Creator" style={hdrCell} />
            {visibleCols.map(col => {
              if (col.key === 'health')    return <ColumnFilterHeader key={col.key} label="Profile" options={HEALTH_OPTS} value={filters.health} onChange={v => set('health', v as string)} style={hdrCell} />;
              if (col.key === 'niche')     return <ColumnFilterHeader key={col.key} label="Niche" options={NICHE_OPTS} multi value={filters.niche} onChange={v => set('niche', v as string[])} style={hdrCell} />;
              if (col.key === 'followers') return <div key={col.key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Followers</div>;
              if (col.key === 'following') return <div key={col.key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Following</div>;
              if (col.key === 'posts')     return <ColumnFilterHeader key={col.key} label="Posts" options={POSTS_OPTS} value={filters.posts} align="right" onChange={v => set('posts', v as string)} style={hdrCell} />;
              if (col.key === 'engRate')  return <div key={col.key} className={`${hdrBase} justify-end pr-3`} style={hdrCell}>Eng. Rate</div>;
              if (col.key === 'score')     return <div key={col.key} className={hdrBase} style={hdrCell}>Score</div>;
              if (col.key === 'postsThisWeek') return <div key={col.key} className={hdrBase} style={hdrCell}>Posts/Wk</div>;
              if (col.key === 'category')  return <div key={col.key} className={hdrBase} style={hdrCell}>IG Category</div>;
              if (col.key === 'linkInBio') return <div key={col.key} className={`${hdrBase} justify-center`} style={hdrCell}>Link</div>;
              if (col.key === 'email')     return <div key={col.key} className={hdrBase} style={hdrCell}>Email</div>;
              if (col.key === 'verified')  return <div key={col.key} className={hdrBase} style={hdrCell}>Verified</div>;
              if (col.key === 'private')   return <div key={col.key} className={hdrBase} style={hdrCell}>Private</div>;
              if (col.key === 'enrichStatus') return <div key={col.key} className={hdrBase} style={hdrCell}>Enrich</div>;
              if (col.key === 'source')    return <div key={col.key} className={hdrBase} style={hdrCell}>Source</div>;
              if (col.key === 'igtvVideoCount') return <div key={col.key} className={hdrBase} style={hdrCell}>IGTV</div>;
              if (col.key === 'highlightReels') return <div key={col.key} className={hdrBase} style={hdrCell}>Highlights</div>;
              return null;
            })}
            <div className={hdrBase} style={hdrCell} title="Favorites"><Heart size={11} /></div>
            <div />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <SearchX size={28} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No creators match</p>
              <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
            </div>
          ) : (
            <div ref={scrollRef} style={{ height: 'calc(100vh - 340px)', overflowY: 'auto', minWidth: tableWidth }}>
              <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: tableWidth }}>
                {rowVirtualizer.getVirtualItems().map(vRow => {
                  const c = filtered[vRow.index];
                  return (
                    <div key={c.id} style={{ position: 'absolute', top: 0, left: 0, width: tableWidth, transform: `translateY(${vRow.start}px)` }}>
                      <CreatorRow
                        creator={c as Competitor & { _totalPosts?: number }}
                        rowIdx={vRow.index}
                        isSelected={selected.has(c.id)}
                        isEnriching={isEnriching(c.handle)}
                        anySelected={selected.size > 0}
                        colVis={colVis}
                        gridCols={gridCols}
                        onOpen={() => onOpen(c)}
                        onSelect={e => toggleSelect(c.id, e)}
                        onFavorite={e => toggleFavorite(c.id, e)}
                        onToggleStatus={e => toggleStatus(c.id, e)}
                        onEnrich={e => { e.stopPropagation(); enrich(c.handle); }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating bulk action bar */}
      <BulkActionBar
        count={selected.size}
        enrichingCount={enrichingCount}
        onEnrich={bulkEnrich}
        onFavorite={bulkFavorite}
        onUnfavorite={bulkUnfavorite}
        onClear={() => setSelected(new Set())}
      />
    </div>
  );
}
