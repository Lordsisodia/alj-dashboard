'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Heart, SearchX,
  Users, Hash, BarChart2, TrendingUp,
  ExternalLink, CheckCircle, Lock,
  Zap, Globe, Tv, Star, Award, Eye,
  AlignLeft, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPETITORS, computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import { DEFAULT_FILTERS, POSTS_OPTS, type CreatorFilters } from './filters/CreatorsFilterBar';
import { TableToolbar } from './TableToolbar';
import { ColumnFilterHeader } from './filters/ColumnFilterHeader';
import { RangeFilterHeader } from './filters/RangeFilterHeader';
import { CreatorRow } from './rows/CreatorRow';
import { CreatorCard } from './cards/CreatorCard';
import { BulkActionBar } from './BulkActionBar';
import { COLUMN_DEFS, DEFAULT_COL_VISIBILITY, buildGridCols, computeTableWidth, COL_BORDER, applyFilters, applyStatusFilter, STATUS_VIEWS, relativeTime, formatFollowers, NICHE_OPTS, HEALTH_OPTS, FOLLOW_OPTS, FOLLOWING_OPTS, ENG_OPTS, SCORE_OPTS, type ColVisibility, type StatusView } from './tableUtils';
import { useEnrich } from '../../hooks/useEnrich';
import { useCreatorsTab } from '../../hooks/useCreatorsTab';
import { useScrapeCreatorPosts } from '../../hooks/useScrapeCreatorPosts';
import { ScrapeProgressPanel } from './ScrapeProgressPanel';
import { VirtualTable } from '@/components/table/VirtualTable';
import { computeCreatorScore } from '@/features/recon/utils/creatorScore';
import { loadWeights, type CreatorScoreWeights } from '@/features/recon/constants/creatorScoreWeights';
import { CreatorScoreWeightsPanel } from './CreatorScoreWeightsPanel';
import { SelectCheckbox } from './shared/SelectCheckbox';
import { TableCard } from './shared/TableCard';

interface CreatorsTableProps {
  onOpen: (c: Competitor) => void;
  extraCreators?: Competitor[];
  searchQuery?: string;
  statusCounts: Record<StatusView, number>;
  onStatusCountsChange: (c: Record<StatusView, number>) => void;
  viewMode: 'list' | 'grid';
  colVis: ColVisibility;
  onColVisChange: (v: ColVisibility) => void;
  scrapeAllTrigger?: number;
}

/** Stable numeric id from any string — djb2 hash, always unique across Convex IDs */
function stableId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function mapTrackedAccountToCompetitor(acc: {
  _id: string;
  handle: string;
  displayName?: string;
  niche: string;
  avatarColor?: string;
  followerCount: number;
  avgEngagementRate?: number;
  status: 'active' | 'paused';
  lastScrapedAt?: number;
  avatarUrl?: string;
  bio?: string;
  verified?: boolean;
  followsCount?: number;
  postsCount?: number;
  externalUrl?: string;
  isBusinessAccount?: boolean;
  isProfessionalAccount?: boolean;
  businessCategoryName?: string;
  businessEmail?: string;
  isPrivate?: boolean;
  igtvVideoCount?: number;
  instagramId?: string;
  avgViews?:           number;
  outlierRatio?:       number;
  highlightReelCount?: number;
  postsPerWeek?:       number;
}): Competitor {
  const handle = acc.handle;
  const initials = (acc.displayName ?? handle)
    .replace(/^@/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');
  const followers = acc.followerCount >= 1_000_000
    ? `${(acc.followerCount / 1_000_000).toFixed(1)}M`
    : acc.followerCount >= 1_000
    ? `${Math.round(acc.followerCount / 1_000)}K`
    : String(acc.followerCount);

  return {
    id:              stableId(acc._id),
    handle,
    displayName:     acc.displayName ?? handle,
    niche:           acc.niche,
    nicheColor:      '#6366f1',
    avatarColor:     acc.avatarColor ?? '#833ab4',
    initials,
    followers,
    engagementRate:  acc.avgEngagementRate != null ? `${Number(acc.avgEngagementRate).toFixed(1)}%` : '0%',
    postsPerWeek:    acc.postsPerWeek ?? 0,
    lastScraped:     acc.lastScrapedAt ? relativeTime(acc.lastScrapedAt) : 'Never',
    status:          acc.status,
    trend:           [],
    postsToday:      0,
    jobStatus:       'idle',
    score:           0,
    favorited:       false,
    // enrichable fields
    ...(acc.avatarUrl              && { profilePicUrl:          acc.avatarUrl             }),
    ...(acc.bio                    && { bio:                    acc.bio                   }),
    ...(acc.verified        != null && { verified:              acc.verified              }),
    ...(acc.followsCount    != null && { followsCount:          acc.followsCount          }),
    ...(acc.postsCount      != null && { postsCount:            acc.postsCount            }),
    ...(acc.externalUrl            && { externalUrl:            acc.externalUrl           }),
    ...(acc.isBusinessAccount != null && { isBusinessAccount:   acc.isBusinessAccount     }),
    ...(acc.isProfessionalAccount != null && { isProfessionalAccount: acc.isProfessionalAccount }),
    ...(acc.businessCategoryName   && { businessCategoryName:   acc.businessCategoryName  }),
    ...(acc.businessEmail          && { businessEmail:          acc.businessEmail         }),
    ...(acc.isPrivate       != null && { isPrivate:             acc.isPrivate             }),
    ...(acc.igtvVideoCount  != null && { igtvVideoCount:         acc.igtvVideoCount        }),
    ...(acc.instagramId            && { instagramId:            acc.instagramId           }),
    ...(acc.avgViews           != null && { avgViews:           acc.avgViews           }),
    ...(acc.outlierRatio       != null && { outlierRatio:       acc.outlierRatio       }),
    ...(acc.highlightReelCount != null && { highlightReelCount: acc.highlightReelCount }),
  };
}

export function CreatorsTable({ onOpen, extraCreators = [], searchQuery = '', statusCounts, onStatusCountsChange, viewMode, colVis, onColVisChange, scrapeAllTrigger }: CreatorsTableProps) {
  const { showFavorites, setShowFavorites, creatorsStatusView, setCreatorsStatusView } = useCreatorsTab();
  // Keep rawAccounts as the dep — stable ref when Convex data unchanged.
  // Inline ?? [] creates a new [] every render, causing an infinite loop.
  const rawAccounts = useQuery(api.trackedAccounts.list, {});
  const liveAccounts = rawAccounts ?? [];
  const [creators, setCreators]     = useState<Competitor[]>([...COMPETITORS, ...extraCreators]);
  const [filters, setFilters]       = useState<CreatorFilters>(DEFAULT_FILTERS);
  const [selected, setSelected]     = useState<Set<number>>(new Set());
  const [weights, setWeights]       = useState<CreatorScoreWeights>(() => loadWeights());
  const [weightsPanelOpen, setWeightsPanelOpen] = useState(false);
  const [percentile, setPercentile] = useState<number>(100);
  const showFavoritesOnly = showFavorites;
  const statusView = creatorsStatusView;
  const { enrich, isEnriching }     = useEnrich();
  const { scrapeMany, isScraping, activeBatches, dismissBatch } = useScrapeCreatorPosts();

  const set = <K extends keyof CreatorFilters>(key: K, val: CreatorFilters[K]) => setFilters(f => ({ ...f, [key]: val }));

  // Sync from rawAccounts when Convex data arrives; fall back to COMPETITORS + extraCreators.
  // Must dep on rawAccounts (stable Convex ref), NOT liveAccounts (?? [] creates new ref every render).
  useEffect(() => {
    const accounts = rawAccounts ?? [];
    const sourceRows: Competitor[] = accounts.length > 0
      ? accounts.map(mapTrackedAccountToCompetitor)
      : [...COMPETITORS, ...extraCreators];
    setCreators(sourceRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAccounts]);

  // Merge extraCreators into fallback set (only when liveAccounts is empty)
  useEffect(() => {
    if (liveAccounts.length > 0) return;
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
        engagementRate: live.avgEngagement  > 0 ? `${Number(live.avgEngagement).toFixed(1)}%` : c.engagementRate,
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
        _totalPosts:      live.totalPosts,
        _totalLikes:      live.totalLikes,
        _totalViews:      live.totalViews,
        _enrichStatus:    live.enrichStatus,
        postsThisWeek:    live.postsThisWeek,
        // scoring fields — kept numeric for computeCreatorScore
        _followerCount:   live.followerCount,
        _avgEngagement:   live.avgEngagement,
        _avgEngagementRate: live.avgEngagementRate,
        _outlierRatio:    live.outlierRatio,
        _avgViews:        live.avgViews,
        _highlightReelCount: live.highlightReelCount,
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

  const scored = merged.map(c => {
    const scoreInput = {
      followerCount:      (c as any)._followerCount      ?? 0,
      followsCount:       c.followsCount,
      postsCount:         c.postsCount,
      avgViews:           (c as any)._avgViews           ?? undefined,
      outlierRatio:       (c as any)._outlierRatio       ?? undefined,
      avgEngagementRate:  (c as any)._avgEngagementRate  ?? undefined,
      verified:           c.verified,
      isPrivate:          c.isPrivate,
      isBusinessAccount:  c.isBusinessAccount,
      externalUrl:        c.externalUrl,
      highlightReelCount: c.highlightReelCount ?? (c as any)._highlightReelCount ?? undefined,
      igtvVideoCount:     c.igtvVideoCount,
      avgEngagement:      (c as any)._avgEngagement      ?? undefined,
      postsThisWeek:      c.postsThisWeek,
      totalPosts:         (c as any)._totalPosts         ?? undefined,
    };
    return {
      ...c,
      _creatorScore: computeCreatorScore(scoreInput, weights).score,
    };
  });

  const q = searchQuery.toLowerCase().trim();
  const searchFiltered = scored.filter(c =>
    (!showFavoritesOnly || c.favorited) &&
    (!q || c.handle.toLowerCase().includes(q) || c.displayName.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q))
  );

  // Status counts (computed before status filter applied)
  const computedStatusCounts = Object.fromEntries(
    STATUS_VIEWS.map(sv => [sv.key, applyStatusFilter(searchFiltered as any, sv.key).length])
  ) as Record<StatusView, number>;

  // Sync counts to parent so StatusDropdown stays in sync
  // Use JSON.stringify to avoid infinite loop — computedStatusCounts is a new object ref every render
  const countsJson = JSON.stringify(computedStatusCounts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onStatusCountsChange(computedStatusCounts); }, [countsJson]);

  const statusFiltered = applyStatusFilter(searchFiltered as any, statusView);
  const filtered       = applyFilters(statusFiltered as any, filters);

  // Percentile filter — applied last, after all other filters
  const percentileFiltered = percentile < 100
    ? (() => {
        const sortedByScore = [...filtered].sort(
          (a, b) => ((b as any)._creatorScore ?? 0) - ((a as any)._creatorScore ?? 0)
        );
        const cutoff = Math.max(1, Math.ceil(sortedByScore.length * percentile / 100));
        return sortedByScore.slice(0, cutoff);
      })()
    : filtered;

  const gridCols   = buildGridCols(colVis);
  const tableWidth = computeTableWidth(colVis);

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
  const allFilteredIds   = percentileFiltered.map(c => c.id);
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
    const handles = percentileFiltered.filter(c => selected.has(c.id)).map(c => c.handle);
    handles.forEach(h => enrich(h));
  }
  function bulkFavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: true } : c));
  }
  function bulkUnfavorite() {
    setCreators(prev => prev.map(c => selected.has(c.id) ? { ...c, favorited: false } : c));
  }
  function bulkScrapeSelected() {
    const handles = percentileFiltered.filter(c => selected.has(c.id)).map(c => c.handle);
    scrapeMany(handles);
  }

  const enrichingCount = percentileFiltered.filter(c => selected.has(c.id) && isEnriching(c.handle)).length;

  // -- Scrape-all trigger (toolbar dropdown) -------------------------------------
  useEffect(() => {
    if (!scrapeAllTrigger) return;
    scrapeMany(percentileFiltered.map(r => r.handle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapeAllTrigger]);

  // -- Header helpers ------------------------------------------------------------
  const hdrCell = { borderRight: COL_BORDER };
  const hdrBase = 'flex items-center justify-center h-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400';

  const visibleCols = COLUMN_DEFS.filter(c => colVis[c.key]);

  function renderHeader() {
    return (
      <div className="grid" style={{ gridTemplateColumns: gridCols, height: 36, backgroundColor: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
        {/* Select-all checkbox */}
        <div
          className="flex items-center justify-center cursor-pointer"
          style={hdrCell}
          onClick={toggleSelectAll}
        >
          <SelectCheckbox
            state={allSelected ? 'all' : someSelected ? 'some' : 'none'}
            tint="blue"
          />
        </div>

        <div className={hdrBase} style={hdrCell}>#</div>
        <ColumnFilterHeader label="Creator" icon={<Users size={9} />} style={hdrCell} />
        {visibleCols.map(col => {
          if (col.key === 'health')    return <ColumnFilterHeader key={col.key} label="Profile" icon={<Star size={9} />} options={HEALTH_OPTS} value={filters.health} onChange={v => set('health', v as string)} style={hdrCell} />;
          if (col.key === 'niche')     return <ColumnFilterHeader key={col.key} label="Niche" icon={<Hash size={9} />} options={NICHE_OPTS} multi value={filters.niche} onChange={v => set('niche', v as string[])} style={hdrCell} />;
          if (col.key === 'followers') return <RangeFilterHeader key={col.key} label="Followers" icon={<TrendingUp size={9} />} min={filters.followers.min} max={filters.followers.max} step={1000} align="right" onChange={v => set('followers', v)} style={hdrCell} />;
          if (col.key === 'avgViews')  return <ColumnFilterHeader key={col.key} label="Latest Views" icon={<Eye size={9} />} options={[]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'following') return <RangeFilterHeader key={col.key} label="Following" icon={<Users size={9} />} min={filters.following.min} max={filters.following.max} step={100} align="right" onChange={v => set('following', v)} style={hdrCell} />;
          if (col.key === 'posts')     return <ColumnFilterHeader key={col.key} label="Posts" icon={<BarChart2 size={9} />} options={POSTS_OPTS} value={filters.posts} align="right" onChange={v => set('posts', v as string)} style={hdrCell} />;
          if (col.key === 'engRate')  return <RangeFilterHeader key={col.key} label="Eng. Rate" icon={<Zap size={9} />} min={filters.engRate.min} max={filters.engRate.max} step={0.1} suffix="%" align="right" onChange={v => set('engRate', v)} style={hdrCell} />;
          if (col.key === 'score')    return <RangeFilterHeader key={col.key} label="Score" icon={<Award size={9} />} min={filters.score.min} max={filters.score.max} step={1} align="right" onChange={v => set('score', v)} style={hdrCell} />;
          if (col.key === 'outlierRatio') return <ColumnFilterHeader key={col.key} label="Outlier" icon={<TrendingUp size={9} />} options={[]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'postsThisWeek') return <ColumnFilterHeader key={col.key} label="Posts/Wk" icon={<BarChart2 size={9} />} options={[{ value: '0', label: '0' }, { value: '1-3', label: '1-3' }, { value: '4+', label: '4+' }]} value="" align="right" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'category')  return <ColumnFilterHeader key={col.key} label="IG Category" icon={<Globe size={9} />} options={[{ value: 'Personal blog', label: 'Personal blog' }, { value: 'Business', label: 'Business' }, { value: 'Entertainment', label: 'Entertainment' }, { value: 'Sports', label: 'Sports' }, { value: 'Other', label: 'Other' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'bio')        return <ColumnFilterHeader key={col.key} label="Bio" icon={<AlignLeft size={9} />} options={[]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'linkInBio') return <ColumnFilterHeader key={col.key} label="Link" icon={<ExternalLink size={9} />} options={[{ value: 'yes', label: 'Has Link' }, { value: 'no', label: 'No Link' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'verified')  return <ColumnFilterHeader key={col.key} label="Verified" icon={<CheckCircle size={9} />} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'private')   return <ColumnFilterHeader key={col.key} label="Private" icon={<Lock size={9} />} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'enrichStatus') return <ColumnFilterHeader key={col.key} label="Enrich" icon={<Zap size={9} />} options={[{ value: 'done', label: 'Done' }, { value: 'idle', label: 'Idle' }, { value: 'error', label: 'Error' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'source')    return <ColumnFilterHeader key={col.key} label="Source" icon={<Globe size={9} />} options={[{ value: 'scraper', label: 'Scraper' }, { value: 'pre_approved', label: 'Pre-approved' }, { value: 'manual', label: 'Manual' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'igtvVideoCount') return <ColumnFilterHeader key={col.key} label="IGTV" icon={<Tv size={9} />} options={[{ value: 'yes', label: 'Has IGTV' }, { value: 'no', label: 'None' }]} value="" onChange={() => {}} style={hdrCell} />;
          if (col.key === 'highlightReels') return <ColumnFilterHeader key={col.key} label="Highlights" icon={<Star size={9} />} options={[{ value: 'yes', label: 'Has Highlights' }, { value: 'no', label: 'None' }]} value="" onChange={() => {}} style={hdrCell} />;
          return null;
        })}
        <div className={hdrBase} style={hdrCell} title="Favorites"><Heart size={11} /></div>
        <div />
      </div>
    );
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
      <SearchX size={28} className="mb-3 opacity-30" />
      <p className="text-sm font-medium">No creators match</p>
      <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
    </div>
  );

  return (
    <div className="w-full relative">
      <TableToolbar
        count={percentileFiltered.length}
        total={scored.length}
        filters={filters}
        onClearFilters={() => setFilters(DEFAULT_FILTERS)}
        percentile={percentile}
        onPercentileChange={setPercentile}
        onOpenWeights={() => setWeightsPanelOpen(true)}
      />

      {/* Card wrapper */}
      <TableCard>
        {/* GRID VIEW */}
        {viewMode === 'grid' ? (
          percentileFiltered.length === 0 ? emptyState : (
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
              {percentileFiltered.map(c => (
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
          /* LIST VIEW — uses shared VirtualTable */
          <VirtualTable
            data={percentileFiltered}
            keyExtractor={c => c.id}
            gridCols={gridCols}
            tableWidth={tableWidth}
            rowHeight={48}
            containerHeight="calc(100vh - 340px)"
            renderHeader={renderHeader}
            renderRow={(c, idx) => (
              <CreatorRow
                creator={c as Competitor & { _totalPosts?: number; _creatorScore?: number }}
                rowIdx={idx}
                isSelected={selected.has(c.id)}
                isEnriching={isEnriching(c.handle)}
                isScraping={isScraping(c.handle)}
                anySelected={selected.size > 0}
                colVis={colVis}
                gridCols={gridCols}
                onOpen={() => onOpen(c)}
                onSelect={e => toggleSelect(c.id, e)}
                onFavorite={e => toggleFavorite(c.id, e)}
                onToggleStatus={e => toggleStatus(c.id, e)}
                onEnrich={e => { e.stopPropagation(); enrich(c.handle); }}
                onScrape={() => scrapeMany([c.handle])}
              />
            )}
            emptyState={emptyState}
          />
        )}
      </TableCard>

      {/* Floating bulk action bar */}
      <BulkActionBar
        count={selected.size}
        enrichingCount={enrichingCount}
        onEnrich={bulkEnrich}
        onFavorite={bulkFavorite}
        onUnfavorite={bulkUnfavorite}
        onClear={() => setSelected(new Set())}
        onScrapeSelected={bulkScrapeSelected}
      />

      {/* Score weights panel */}
      <CreatorScoreWeightsPanel
        open={weightsPanelOpen}
        onClose={() => setWeightsPanelOpen(false)}
        weights={weights}
        onChange={(w) => { setWeights(w); }}
      />

      {/* Scrape progress panel — most recent batch only */}
      {activeBatches.length > 0 && (() => {
        const latest = activeBatches[activeBatches.length - 1];
        return (
          <ScrapeProgressPanel
            handles={latest.handles}
            startedAt={latest.startedAt}
            onDismiss={() => dismissBatch(latest.id)}
          />
        );
      })()}
    </div>
  );
}
