'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Trash2, Users, CheckCircle, Database, XCircle, TrendingUp, Tag, Clock } from 'lucide-react';
import { groupScrapedByDate } from './scrapedGrouping';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { CandidateStatus } from '../../types';
import {
  CandidateRow,
  EmptyState,
  ApprovedRow,
  ScrapingColumn,
  SkeletonRow,
  DraggableCard,
  DroppableZone,
  DragGhost,
  SourceChart,
  FollowerScaleChart,
  PipelineStats,
  DetailPanel,
  PipelineColumn,
  RejectedPanel,
  ScrapedRow,
  PRE_APPROVED,
  convexToCandidate,
  type MappedCandidate,
} from '.';
import { COMPETITORS } from '../../creatorData';
import { useDiscoveryTab } from '../../hooks/useDiscoveryTab';
import { StatusStrip, timeAgo } from '@/components/ui/status-strip';

// -- Main component ---------------------------------------------------------------

export function DiscoveryTab({
  extraCandidates,
  showAnalytics: showAnalyticsProp,
}: {
  extraCandidates?: unknown[];
  showAnalytics?: boolean;
} = {}) {
  const {
    searchQuery,
    setSearchQuery,
    runDiscoveryTrigger,
    setRunDiscoveryTrigger,
    scheduleHours,
    setScheduleHours,
    showAnalytics: showAnalyticsHook,
    setShowAnalytics,
  } = useDiscoveryTab();

  // Parent can override showAnalytics via prop; falls back to internal hook state
  const showAnalytics = showAnalyticsProp ?? showAnalyticsHook;
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [discovering,   setDiscovering]   = useState(false);
  const [seeding,       setSeeding]       = useState(false);
  const [scrapingItems, setScrapingItems] = useState<{ handle: string; displayName: string; initials: string; startedAt: number }[]>([]);
  const [activeId,      setActiveId]       = useState<string | null>(null);
  const [overColumn,    setOverColumn]    = useState<'unapproved' | 'approved' | 'scraped' | null>(null);
  const [approvedGlow,  setApprovedGlow]  = useState(0);
  const [scrapingGlow, setScrapingGlow]  = useState(0);
  const [scrapedGlow,  setScrapedGlow]   = useState(0);
  const seededRef = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Convex
  const pipelineStats  = useQuery(api.intelligence.getStats, {});
  const rawCandidates  = useQuery(api.candidates.list, {}) ?? undefined;
  const blockedHandles = useQuery(api.candidates.listBlocked, {}) ?? [];
  const seedPreApproved = useMutation(api.candidates.seedPreApproved);
  const updateStatus    = useMutation(api.candidates.updateStatus);
  const upsertCandidate = useMutation(api.candidates.upsert);
  const clearDuplicates       = useMutation(api.candidates.clearDuplicates);
  const deleteAndBlock        = useMutation(api.candidates.deleteAndBlock);
  const setEnrichStatus       = useMutation(api.candidates.setEnrichStatus);
  const approveTrackedAccount = useMutation(api.trackedAccounts.approveCandidate);

  // Seed pre-approved on first load if DB is empty
  useEffect(() => {
    if (seededRef.current || rawCandidates === undefined) return;
    seededRef.current = true;
    setSeeding(true);
    seedPreApproved({ accounts: PRE_APPROVED }).finally(() => setSeeding(false));
  }, [rawCandidates, seedPreApproved]);

  const allMapped: MappedCandidate[] = useMemo(
    () => (rawCandidates ?? []).map(c => convexToCandidate(c as Parameters<typeof convexToCandidate>[0])),
    [rawCandidates],
  );

  // Build numericId → _id map
  const idMap = useMemo(() => {
    const m = new Map<number, string>();
    allMapped.forEach(c => m.set(c.id, c._convexId));
    return m;
  }, [allMapped]);

  const blockedSet = useMemo(() => new Set(blockedHandles.map(b => b.handle)), [blockedHandles]);

  // Filter + sort
  const q = searchQuery.toLowerCase().trim();
  const matches = (c: MappedCandidate) =>
    !q || c.handle.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q) || c.displayName.toLowerCase().includes(q);

  const pending    = allMapped.filter(c => c.status === 'pending'  && matches(c)).sort((a, b) => b.outlierRatio - a.outlierRatio);
  const approved   = allMapped.filter(c => c.status === 'approved' && matches(c));
  const scrapingHandles = new Set(scrapingItems.map(i => i.handle));
  const approvedPending = approved.filter(c => c.enrichStatus !== 'done' && !scrapingHandles.has(c.handle));
  const scrapedFlat   = approved.filter(c => c.enrichStatus === 'done');
  const scrapedGroups = groupScrapedByDate(scrapedFlat);
  const scraped       = scrapedFlat; // kept for stats (avgViews, avgEngagement, etc.)
  const rejected  = allMapped.filter(c => c.status === 'rejected' && matches(c));

  // Header stats
  const avgViews      = scraped.length > 0 ? scraped.reduce((s, c) => s + (c.avgViews ?? 0), 0) / scraped.length : 0;
  const avgEngagement = scraped.length > 0 ? scraped.reduce((s, c) => s + (parseFloat(c.engagementRate) || 0), 0) / scraped.length : 0;
  const avgFollowers  = scraped.length > 0 ? scraped.reduce((s, c) => s + (c.followersRaw ?? 0), 0) / scraped.length : 0;
  const nicheCount   = new Map<string, number>();
  approved.forEach(c => { if (c.niche) nicheCount.set(c.niche, (nicheCount.get(c.niche) ?? 0) + 1); });
  const topNiche = [...nicheCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  // Duplicate detection
  const handleCount = new Map<string, number>();
  pending.forEach(c => handleCount.set(c.handle.toLowerCase(), (handleCount.get(c.handle.toLowerCase()) ?? 0) + 1));
  const duplicateHandles = new Set([...handleCount.entries()].filter(([, n]) => n > 1).map(([h]) => h));
  const duplicateCount = pending.filter(c => duplicateHandles.has(c.handle.toLowerCase())).length;

  // Selected
  const selected = allMapped.find(c => c._convexId === selectedId) ?? null;

  // -- Actions ------------------------------------------------------------------

  async function handleApprove(c: MappedCandidate) {
    await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'approved' }).catch(console.error);
    setApprovedGlow(n => n + 1);
    await approveTrackedAccount({
      handle:            c.handle,
      displayName:       c.displayName,
      niche:             c.niche || 'Unknown',
      avatarColor:       c.avatarColor || '#833ab4',
      followerCount:     c.followersRaw ?? 0,
      avgEngagementRate: parseFloat(c.engagementRate) || 0,
      // Extended signals — pass whatever the candidate has
      ...(c.avgViews           !== undefined && { avgViews:           c.avgViews }),
      ...(c.outlierRatio       !== undefined && { outlierRatio:       c.outlierRatio }),
      ...(c.highlightReelCount !== undefined && { highlightReelCount: c.highlightReelCount }),
      ...(c.postsPerWeek       !== undefined && { postsPerWeek:       c.postsPerWeek }),
      ...(c.followsCount       !== undefined && { followsCount:       c.followsCount }),
      ...(c.postsCount         !== undefined && { postsCount:         c.postsCount }),
      ...(c.bio                !== undefined && { bio:                c.bio }),
      ...(c.avatarUrl          !== undefined && { avatarUrl:          c.avatarUrl }),
      ...(c.verified           !== undefined && { verified:           c.verified }),
      ...(c.isPrivate          !== undefined && { isPrivate:          c.isPrivate }),
      ...(c.isBusinessAccount  !== undefined && { isBusinessAccount:  c.isBusinessAccount }),
      ...(c.externalUrl        !== undefined && { externalUrl:        c.externalUrl }),
      ...(c.igtvVideoCount     !== undefined && { igtvVideoCount:     c.igtvVideoCount }),
      ...(c.instagramId        !== undefined && { instagramId:        c.instagramId }),
    }).catch(console.error);
    if (!c.avatarUrl && !c.followersRaw) {
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    }
  }

  async function handleReject(c: MappedCandidate) {
    await deleteAndBlock({ id: c._convexId as Id<'creatorCandidates'> }).catch(console.error);
  }

  async function handleDecision(numId: number, status: CandidateStatus) {
    const convexId = idMap.get(numId);
    if (convexId) await updateStatus({ id: convexId as Id<'creatorCandidates'>, status }).catch(console.error);
    setSelectedId(null);
  }

  function addScraping(c: MappedCandidate) {
    setScrapingGlow(n => n + 1);
    setScrapingItems(prev =>
      prev.some(i => i.handle === c.handle) ? prev : [...prev, { handle: c.handle, displayName: c.displayName, initials: c.initials, startedAt: Date.now() }]
    );
  }

  function removeScraping(handle: string) {
    setScrapingItems(prev => prev.filter(i => i.handle !== handle));
  }

  async function triggerScrape(c: MappedCandidate) {
    addScraping(c);
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: c.handle }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.relatedHandles?.length) {
          const filtered = data.relatedHandles.filter((h: string) => !blockedSet.has(`@${h.replace('@', '')}`.toLowerCase()));
          await Promise.allSettled(
            filtered.slice(0, 30).map((h: string) =>
              upsertCandidate({ handle: `@${h.replace('@', '')}`, displayName: h.replace('@', ''), status: 'pending', source: 'scraper', suggestedBy: c.handle }).catch(() => {})
            )
          );
          setScrapedGlow(n => n + 1);
        }
      }
    } catch (err) {
      console.error('[triggerScrape]', err);
    } finally {
      removeScraping(c.handle);
    }
  }

  async function runDiscovery() {
    setDiscovering(true);
    await new Promise(r => setTimeout(r, 3000));
    setDiscovering(false);
  }

  // Temp seed
  useEffect(() => {
    const { current } = { current: false };
    if (current || rawCandidates === undefined) return;
    upsertCandidate({ handle: '@tongohmm', displayName: 'Tongohmm Klaatawan', niche: 'Lifestyle', status: 'pending', source: 'manual' }).catch(() => {});
  }, [rawCandidates]);

  useEffect(() => {
    if (!runDiscoveryTrigger) return;
    runDiscovery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runDiscoveryTrigger]);

  void discovering;

  // -- DnD handlers -----------------------------------------------------------

  const activeCandidate = activeId ? allMapped.find(c => c._convexId === activeId) ?? null : null;

  function onDragStart(e: DragStartEvent) { setActiveId(e.active.id as string); }
  function onDragOver(e: DragOverEvent)    { setOverColumn((e.over?.id as typeof overColumn) ?? null); }

  async function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    setOverColumn(null);
    const { active, over } = e;
    if (!over) return;
    const from = active.data.current?.column as 'unapproved' | 'approved' | 'scraped';
    const to   = over.id as typeof from;
    if (from === to) return;
    const c = allMapped.find(c => c._convexId === active.id);
    if (!c) return;
    if (from === 'unapproved' && to === 'approved')              await handleApprove(c);
    else if (from === 'unapproved' && to === 'scraped')            { await handleApprove(c); triggerScrape(c); }
    else if (from === 'approved'   && to === 'unapproved')        await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error);
    else if (from === 'approved'   && to === 'scraped')           triggerScrape(c);
    else if (from === 'scraped'    && to === 'unapproved')        { await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error); await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error); }
    else if (from === 'scraped'    && to === 'approved')          await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    else if (from === 'scraped'    && to === 'scraped')           triggerScrape(c);
  }

  const loading = rawCandidates === undefined || seeding;

  return (
    <div className="px-6 py-6 w-full space-y-4 overflow-visible">
      <StatusStrip
        status={{ label: scrapingItems.length > 0 ? 'Scraping active' : 'Pipeline idle', active: scrapingItems.length > 0 }}
        stats={[
          { icon: <Users       size={10} />, value: pending.length,                   label: 'pending'  },
          { icon: <CheckCircle size={10} />, value: approved.length,                  label: 'approved' },
          { icon: <Database    size={10} />, value: scraped.length,                   label: 'scraped'  },
          { icon: <XCircle     size={10} />, value: rejected.length,                  label: 'rejected' },
          ...(topNiche       ? [{ icon: <Tag        size={10} />, value: topNiche,                         label: 'top niche' }] : []),
          ...(scraped.length > 0 ? [{ icon: <TrendingUp size={10} />, value: avgEngagement.toFixed(1) + '%', label: 'avg ER'   }] : []),
        ]}
        rightSlot={
          <>
            <Clock size={10} className="text-red-600" />
            <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(pipelineStats?.latestScrapeAt ?? 0)}</span></span>
          </>
        }
      />

      <AnimatePresence>
        {showAnalytics && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="grid grid-cols-3 gap-4 overflow-hidden">
            <PipelineStats candidates={allMapped} />
            <SourceChart candidates={allMapped} />
            <FollowerScaleChart candidates={allMapped} />
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>

          {/* Unapproved */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col gap-2">
            <DroppableZone id="unapproved" isOver={overColumn === 'unapproved'}>
              <PipelineColumn title="Unapproved" count={pending.length} accentColor="#dc2626" columnBg="rgba(220,38,38,0.035)" tooltip="Oracle scans Instagram for creators with unusually high view-to-follower ratios. Pending candidates need a decision." headerExtra={duplicateCount > 0 ? (
                <button onClick={() => clearDuplicates().then(() => window.location.reload())} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ml-auto" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
                  <Trash2 size={9} />{duplicateCount} dupes
                </button>
              ) : undefined}>
                {loading ? <AnimatePresence>{[0,1,2,3].map(i => <SkeletonRow key={i} />)}</AnimatePresence> : pending.length === 0 ? <EmptyState filter="pending" /> : (
                  <AnimatePresence>{pending.map((c, i) => (
                    <DraggableCard key={c._convexId} id={c._convexId} column="unapproved">
                      <CandidateRow candidate={c} index={i} isSelected={selectedId === c._convexId} disableSelect onApprove={e => { e.stopPropagation(); handleApprove(c); }} onReject={e => { e.stopPropagation(); handleReject(c); }} />
                    </DraggableCard>
                  ))}</AnimatePresence>
                )}
              </PipelineColumn>
            </DroppableZone>
            <RejectedPanel candidates={rejected} />
          </motion.div>

          {/* Approved */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <DroppableZone id="approved" isOver={overColumn === 'approved'}>
              <PipelineColumn title="Approved" count={approvedPending.length} accentColor="#991b1b" columnBg="rgba(153,27,27,0.045)" tooltip="Creators cleared for active tracking. Click Scrape or drag to Scraped to pull their full profile data." glowKey={approvedGlow}>
                {approvedPending.length === 0 ? <p className="text-[11px] text-center py-8" style={{ color: 'rgba(153,27,27,0.4)' }}>No approved candidates yet</p> : (
                  <AnimatePresence>{approvedPending.map((c, i) => (
                    <DraggableCard key={c._convexId} id={c._convexId} column="approved">
                      <ApprovedRow candidate={c} index={i} isScraping={scrapingItems.some(s => s.handle === c.handle)} onSelect={() => setSelectedId(selectedId === c._convexId ? null : c._convexId)} onScrapeComplete={handles => handles.forEach(h => upsertCandidate({ handle: `@${h.replace('@', '')}`, displayName: h.replace('@', ''), status: 'pending', source: 'scraper', suggestedBy: c.handle }).catch(() => {}))} onScrapeStart={() => addScraping(c)} onScrapeEnd={() => removeScraping(c.handle)} />
                    </DraggableCard>
                  ))}</AnimatePresence>
                )}
              </PipelineColumn>
            </DroppableZone>
          </motion.div>

          {/* Scraping */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <ScrapingColumn liveItems={scrapingItems} columnBg="rgba(127,29,29,0.055)" glowKey={scrapingGlow} />
          </motion.div>

          {/* Scraped */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <DroppableZone id="scraped" isOver={overColumn === 'scraped'}>
              <PipelineColumn title="Scraped" count={scraped.length} accentColor="#7f1d1d" columnBg="rgba(127,29,29,0.03)" tooltip="Approved creators with enriched profile data pulled from Instagram." glowKey={scrapedGlow}>
                {scraped.length === 0 ? <p className="text-[11px] text-center py-8" style={{ color: 'rgba(127,29,29,0.3)' }}>Scrape an approved card to see results</p> : (
                  scrapedGroups.map((group, groupIdx) => (
                    <React.Fragment key={group.label}>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400 select-none"
                        style={{
                          borderTop: groupIdx > 0 ? '1px solid rgba(0,0,0,0.05)' : undefined,
                          marginTop: groupIdx > 0 ? 8 : 0,
                        }}
                      >
                        <span className="text-red-600">{group.label}</span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-300">{group.items.length}</span>
                      </div>
                      {group.items.map(c => (
                        <DraggableCard key={c._convexId} id={c._convexId} column="scraped">
                          <ScrapedRow c={c} />
                        </DraggableCard>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </PipelineColumn>
            </DroppableZone>
          </motion.div>
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeCandidate ? <DragGhost c={activeCandidate} /> : null}
        </DragOverlay>
      </DndContext>

      {!loading && allMapped.length === 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => { setSeeding(true); seedPreApproved({ accounts: PRE_APPROVED }).finally(() => setSeeding(false)); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
          >
            <Zap size={12} /> Seed pre-approved accounts
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <DetailPanel key={selected._convexId} candidate={selected} onClose={() => setSelectedId(null)} onDecision={handleDecision} />
        )}
      </AnimatePresence>
    </div>
  );
}
