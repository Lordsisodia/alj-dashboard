'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Trash2 } from 'lucide-react';
import { Info } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Candidate, CandidateStatus } from '../../types';
import { DetailPanel } from './discovery/DetailPanel';
import { COMPETITORS } from '../../creatorData';
import { DiscoveryHeader }  from './discovery/DiscoveryHeader';
import { InfoTooltip }     from './discovery/InfoTooltip';
import { CandidateRow }     from './discovery/CandidateRow';
import { EmptyState }       from './discovery/EmptyState';
import { DiscoveryFunnel }  from './discovery/DiscoveryFunnel';
import { NicheDonut }       from './discovery/NicheDonut';
import { ScrapingColumn, type LiveScrapeItem } from './discovery/ScrapingColumn';
import { ApprovedRow }      from './discovery/ApprovedRow';

// ── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#dc2626','#b91c1c','#991b1b','#7f1d1d','#ef4444','#f87171'];

function stableNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return n > 0 ? String(n) : '-';
}

function getInitials(displayName: string, handle: string): string {
  const name = displayName?.trim() || handle.replace('@', '');
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const SAMPLE_GRADIENTS: [string, string][] = [
  ['#fecaca','#fee2e2'], ['#fca5a5','#fecaca'], ['#f87171','#fca5a5'],
  ['#ef4444','#f87171'], ['#dc2626','#ef4444'], ['#b91c1c','#dc2626'],
];

// Type returned from Convex list query
type ConvexCandidate = {
  _id: string;
  handle: string;
  displayName: string;
  niche?: string;
  followerCount?: number;
  followsCount?: number;
  postsCount?: number;
  avgViews?: number;
  outlierRatio?: number;
  avgEngagementRate?: number;
  postsPerWeek?: number;
  suggestedBy?: string;
  addedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  source: 'pre_approved' | 'scraper' | 'manual';
  aiScore?: number;
  aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
  aiReason?: string;
  enrichStatus?: string;
  avatarUrl?: string;
};

type MappedCandidate = Candidate & { _convexId: string; avatarUrl?: string; enrichStatus?: string };

function convexToCandidate(doc: ConvexCandidate): MappedCandidate {
  const avatarIdx = stableNum(doc.handle) % AVATAR_COLORS.length;
  const daysAgo = Math.floor((Date.now() - doc.addedAt) / 86_400_000);
  const discoveredAt = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

  return {
    _convexId:       doc._id,
    id:              stableNum(doc._id),
    handle:          doc.handle,
    displayName:     doc.displayName,
    niche:           doc.niche ?? 'GFE',
    nicheColor:      '#dc2626',
    avatarColor:     AVATAR_COLORS[avatarIdx],
    initials:        getInitials(doc.displayName, doc.handle),
    followers:       fmtFollowers(doc.followerCount ?? 0),
    followersRaw:    doc.followerCount ?? 0,
    avgViews:        doc.avgViews ?? 0,
    outlierRatio:    doc.outlierRatio ?? 0,
    engagementRate:  doc.avgEngagementRate ? `${(doc.avgEngagementRate * 100).toFixed(1)}%` : '-',
    postsPerWeek:    doc.postsPerWeek ?? 0,
    suggestedBy:     doc.suggestedBy ?? null,
    discoveredAt,
    status:          doc.status as CandidateStatus,
    sampleGradients: SAMPLE_GRADIENTS,
    avatarUrl:       doc.avatarUrl,
    enrichStatus:    doc.enrichStatus,
  };
}

// ── PRE_APPROVED seed list ────────────────────────────────────────────────────

const PRE_APPROVED = [
  { handle: '@minaxash',              displayName: 'Mina Ash',            niche: 'GFE'       },
  { handle: '@tinaxkitsune',          displayName: 'Tina Kitsune',        niche: 'GFE'       },
  { handle: '@a55tr1d',               displayName: 'Astrid',              niche: 'Lifestyle' },
  { handle: '@amammyw',               displayName: 'Sasithon Miyawong',   niche: 'Lifestyle' },
  { handle: '@nerd_nattiyaseehanamm', displayName: 'Ñërd',               niche: 'Lifestyle' },
  { handle: '@tongohmm',              displayName: 'Tongohmm Klaatawan',  niche: 'Lifestyle' },
  { handle: '@kittygoofygirl',        displayName: 'kittygoofygirl',      niche: 'GFE'       },
  { handle: '@tootinytrina',          displayName: 'tootinytrina',        niche: 'GFE'       },
];

// ── Drag-and-drop primitives ──────────────────────────────────────────────────

type ColumnId = 'unapproved' | 'approved' | 'scraped';

function DraggableCard({ id, column, children }: { id: string; column: ColumnId; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { column } });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity:     isDragging ? 0 : 1,
        cursor:      isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect:  'none',
      }}
    >
      {children}
    </div>
  );
}

function DroppableZone({ id, isOver, children }: { id: ColumnId; isOver: boolean; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ borderRadius: 12, transition: 'box-shadow 0.15s', boxShadow: isOver ? '0 0 0 2px #991b1b66' : 'none' }}>
      {children}
    </div>
  );
}

// Minimal ghost card shown while dragging
function DragGhost({ c }: { c: MappedCandidate }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-xl"
      style={{ border: '1px solid rgba(153,27,27,0.25)', backgroundColor: '#fff', opacity: 0.95, width: 180, cursor: 'grabbing' }}
    >
      {c.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.avatarUrl.includes('r2.dev') ? c.avatarUrl : `/api/recon/avatar?url=${encodeURIComponent(c.avatarUrl)}`} alt="" className="w-5 h-5 rounded flex-shrink-0 object-cover" />
      ) : (
        <span className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}>
          {c.initials}
        </span>
      )}
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{c.handle}</p>
    </div>
  );
}

// ── Skeleton shimmer row for loading states ──────────────────────────────────

function SkeletonRow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      {[0.3, 0.45, 0.2, 0.5].map((opacity, i) => (
        <motion.div
          key={i}
          className="h-3 rounded"
          animate={{ opacity: [opacity, opacity + 0.2, opacity] }}
          transition={{ duration: 1.4 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
          style={{ backgroundColor: '#f3f4f6', flex: i === 2 ? 1 : 'none', width: i === 2 ? 'auto' : i === 1 ? '40%' : i === 0 ? 10 : 50 }}
        />
      ))}
    </motion.div>
  );
}

// ── Pulse ring on new card arrival ─────────────────────────────────────────

function PulseRing({ color = '#dc2626' }: { color?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.8, ring: 0 }}
      animate={{ scale: 2.5, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{ border: `2px solid ${color}`, transformOrigin: 'center' }}
    />
  );
}

// ── Inline sub-components ────────────────────────────────────────────────────

interface PipelineColumnProps {
  title: string;
  count: number;
  accentColor: string;
  columnBg: string;
  tooltip: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  glowKey?: string | number; // changing this triggers a border-glow pulse
}

function PipelineColumn({ title, count, accentColor, columnBg, tooltip, headerExtra, children, glowKey }: PipelineColumnProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', borderLeft: `2px solid ${accentColor}`, backgroundColor: columnBg }}>
      <motion.div
        key={glowKey}
        initial={{ boxShadow: `0 0 0 0 ${accentColor}00` }}
        animate={{ boxShadow: [`0 0 0 0 ${accentColor}00', `0 0 12px 2px ${accentColor}44`, `0 0 0 0 ${accentColor}00`] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${accentColor}18` }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>{title}</p>
        <InfoTooltip text={tooltip} />
        {headerExtra}
        <span
          className="ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {count}
        </span>
      </motion.div>
      <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5 scrollbar-thin">
        {children}
      </div>
    </div>
  );
}


function ApprovalRatioWidget({ approved, rejected }: { approved: number; rejected: number }) {
  const total       = approved + rejected;
  const approvalPct = total === 0 ? 50 : Math.round((approved / total) * 100);
  const rejectPct   = 100 - approvalPct;

  return (
    <div className="rounded-xl p-4 bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#7f1d1d' }}>Approval Rate</p>
      <div className="h-2 rounded-full overflow-hidden flex mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: '#991b1b', borderRadius: '9999px' }}
          animate={{ width: `${approvalPct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold leading-none tabular-nums" style={{ color: '#991b1b' }}>{approvalPct}%</p>
          <p className="text-[9px] text-neutral-400 mt-0.5">{approved} approved</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold leading-none tabular-nums text-neutral-300">{rejectPct}%</p>
          <p className="text-[9px] text-neutral-400 mt-0.5">{rejected} rejected</p>
        </div>
      </div>
      <p className="text-[9px] text-neutral-300 mt-2">
        {total === 0 ? 'No data yet' : `${total} evaluated total`}
      </p>
    </div>
  );
}

function RejectedPanel({ candidates }: { candidates: MappedCandidate[] }) {
  if (candidates.length === 0) return null;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'rgba(0,0,0,0.018)' }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">Rejected</p>
        <span className="ml-auto text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>
          {candidates.length}
        </span>
      </div>
      <div className="p-2 space-y-0.5 max-h-[110px] overflow-y-auto">
        {candidates.map(c => (
          <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>
              {c.initials}
            </div>
            <p className="text-[10px] font-medium text-neutral-400 flex-1 truncate">{c.handle}</p>
            {c.outlierRatio > 0 && <span className="text-[9px] tabular-nums text-neutral-300">{c.outlierRatio.toFixed(2)}×</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrapedRow({ c }: { c: MappedCandidate }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      {/* Status dot — green for scraped */}
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#16a34a' }} />

      {c.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.avatarUrl.includes('r2.dev') ? c.avatarUrl : `/api/recon/avatar?url=${encodeURIComponent(c.avatarUrl)}`}
          alt={c.handle}
          className="w-5 h-5 rounded flex-shrink-0 object-cover"
        />
      ) : (
        <span
          className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
          style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}
        >
          {c.initials}
        </span>
      )}
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{c.handle}</p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DiscoveryTab({ searchQuery = '', runDiscoveryTrigger, showAnalytics = false, scheduleHours, onScheduleChange }: { extraCandidates?: unknown[]; searchQuery?: string; runDiscoveryTrigger?: number; showAnalytics?: boolean; scheduleHours?: number; onScheduleChange?: (h: number) => void } = {}) {
  const [selectedId,      setSelectedId]      = useState<string | null>(null);
  const [discovering,     setDiscovering]      = useState(false);
  const [seeding,         setSeeding]          = useState(false);
  const [scrapingItems,   setScrapingItems]    = useState<LiveScrapeItem[]>([]);
  const [activeId,        setActiveId]         = useState<string | null>(null);
  const [overColumn,      setOverColumn]       = useState<ColumnId | null>(null);
  const [approvedGlow,    setApprovedGlow]     = useState(0);
  const [scrapingGlow,    setScrapingGlow]     = useState(0);
  const [scrapedGlow,     setScrapedGlow]      = useState(0);
  const seededRef = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Convex
  const rawCandidates   = useQuery(api.candidates.list, {}) ?? undefined;
  const blockedHandles  = useQuery(api.candidates.listBlocked, {}) ?? [];
  const seedPreApproved  = useMutation(api.candidates.seedPreApproved);
  const updateStatus     = useMutation(api.candidates.updateStatus);
  const upsertCandidate  = useMutation(api.candidates.upsert);
  const clearDuplicates  = useMutation(api.candidates.clearDuplicates);
  const deleteAndBlock   = useMutation(api.candidates.deleteAndBlock);
  const setEnrichStatus  = useMutation(api.candidates.setEnrichStatus);

  // Seed pre-approved list on first load if DB is empty
  useEffect(() => {
    if (seededRef.current || rawCandidates === undefined) return;
    if (rawCandidates.length === 0) {
      seededRef.current = true;
      setSeeding(true);
      seedPreApproved({ accounts: PRE_APPROVED })
        .finally(() => setSeeding(false));
    } else {
      seededRef.current = true;
    }
  }, [rawCandidates, seedPreApproved]);

  // Map Convex docs → display Candidates
  const allMapped: MappedCandidate[] = useMemo(
    () => (rawCandidates ?? []).map(c => convexToCandidate(c as ConvexCandidate)),
    [rawCandidates],
  );

  // Build convexId lookup map (numericId → _id)
  const idMap = useMemo(() => {
    const m = new Map<number, string>();
    allMapped.forEach(c => m.set(c.id, c._convexId));
    return m;
  }, [allMapped]);

  const q = searchQuery.toLowerCase().trim();
  const matchesSearch = (c: MappedCandidate) =>
    !q ||
    c.handle.toLowerCase().includes(q) ||
    c.niche.toLowerCase().includes(q) ||
    c.displayName.toLowerCase().includes(q);

  const pending           = allMapped.filter(c => c.status === 'pending'  && matchesSearch(c)).sort((a, b) => b.outlierRatio - a.outlierRatio);
  const approved          = allMapped.filter(c => c.status === 'approved' && matchesSearch(c));
  const scrapingHandles   = new Set(scrapingItems.map(i => i.handle));
  const approvedPending   = approved.filter(c => c.enrichStatus !== 'done' && !scrapingHandles.has(c.handle));
  const scrapedCandidates = approved.filter(c => c.enrichStatus === 'done').sort((a, b) => b.followersRaw - a.followersRaw);
  const rejected          = allMapped.filter(c => c.status === 'rejected' && matchesSearch(c));

  // Header stats
  const avgViews = scrapedCandidates.length > 0
    ? scrapedCandidates.reduce((sum, c) => sum + (c.avgViews ?? 0), 0) / scrapedCandidates.length : 0;
  const avgEngagement = scrapedCandidates.length > 0
    ? scrapedCandidates.reduce((sum, c) => sum + (parseFloat(c.engagementRate) || 0), 0) / scrapedCandidates.length : 0;
  const avgFollowers = scrapedCandidates.length > 0
    ? scrapedCandidates.reduce((sum, c) => sum + (c.followersRaw ?? 0), 0) / scrapedCandidates.length : 0;
  const nicheCount = new Map<string, number>();
  approved.forEach(c => { if (c.niche) nicheCount.set(c.niche, (nicheCount.get(c.niche) ?? 0) + 1); });
  const topNiche = [...nicheCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  // Duplicate detection on pending
  const handleCount = new Map<string, number>();
  pending.forEach(c => {
    const norm = c.handle.toLowerCase();
    handleCount.set(norm, (handleCount.get(norm) ?? 0) + 1);
  });
  const duplicateHandles = new Set(
    [...handleCount.entries()]
      .filter(([, count]) => count > 1)
      .map(([handle]) => handle)
  );
  const duplicateCount = pending.filter(c => duplicateHandles.has(c.handle.toLowerCase())).length;

  const blockedSet = useMemo(
    () => new Set(blockedHandles.map(b => b.handle)),
    [blockedHandles],
  );

  // Feed relatedHandles from a scrape into Unapproved (skip blocked)
  async function handleScrapeComplete(relatedHandles: string[], suggestedBy: string) {
    const filtered = relatedHandles.filter(h => !blockedSet.has(`@${h.replace('@', '')}`.toLowerCase()));
    await Promise.allSettled(
      filtered.slice(0, 10).map(h =>
        upsertCandidate({
          handle:      `@${h.replace('@', '')}`,
          displayName: h.replace('@', ''),
          status:      'pending',
          source:      'scraper',
          suggestedBy,
        }).catch(() => {})
      )
    );
    setScrapedGlow(n => n + 1);
  }

  async function handleApprove(c: MappedCandidate) {
    await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'approved' }).catch(console.error);
    setApprovedGlow(n => n + 1);
    // If no real profile data, reset enrichStatus so card lands in Approved (not Scraped)
    if (!c.avatarUrl && !c.followersRaw) {
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);
    }
  }

  async function handleReject(c: MappedCandidate) {
    await deleteAndBlock({ id: c._convexId as Id<'creatorCandidates'> }).catch(console.error);
  }

  // TEMP: seed @tongohmm as pending for testing
  const tempSeededRef = { value: false };
  useEffect(() => {
    if (tempSeededRef.value || rawCandidates === undefined) return;
    tempSeededRef.value = true;
    upsertCandidate({
      handle:      '@tongohmm',
      displayName: 'Tongohmm Klaatawan',
      niche:       'Lifestyle',
      status:      'pending',
      source:      'manual',
    }).catch(() => {});
  }, [rawCandidates]);

  // Find selected candidate by convex _id
  const selected = allMapped.find(c => c._convexId === selectedId) ?? null;

  async function handleDecision(numId: number, status: CandidateStatus) {
    const convexId = idMap.get(numId);
    if (convexId) {
      await updateStatus({ id: convexId as Id<'creatorCandidates'>, status }).catch(console.error);
    }
    setSelectedId(null);
  }

  async function runDiscovery() {
    setDiscovering(true);
    await new Promise(r => setTimeout(r, 3000));
    setDiscovering(false);
  }

  function addScraping(c: MappedCandidate) {
    setScrapingGlow(n => n + 1);
    setScrapingItems(prev => {
      if (prev.some(i => i.handle === c.handle)) return prev;
      return [...prev, { handle: c.handle, displayName: c.displayName, initials: c.initials, startedAt: Date.now() }];
    });
  }

  function removeScraping(handle: string) {
    setScrapingItems(prev => prev.filter(i => i.handle !== handle));
  }

  async function triggerScrape(c: MappedCandidate) {
    addScraping(c);
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ handle: c.handle }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.relatedHandles?.length) await handleScrapeComplete(data.relatedHandles, c.handle);
      }
    } catch (err) {
      console.error('[triggerScrape]', err);
    } finally {
      removeScraping(c.handle);
    }
  }

  // Trigger from top-bar "Run Discovery" button
  useEffect(() => {
    if (!runDiscoveryTrigger) return;
    runDiscovery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runDiscoveryTrigger]);

  // Suppress unused warning — discovering used by runDiscovery
  void discovering;
  void scheduleHours;
  void onScheduleChange;

  // ── Drag-and-drop handlers ──────────────────────────────────────────────────

  const activeCandidate = activeId ? allMapped.find(c => c._convexId === activeId) ?? null : null;

  function onDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function onDragOver(event: DragOverEvent) {
    setOverColumn((event.over?.id as ColumnId) ?? null);
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setOverColumn(null);

    const { active, over } = event;
    if (!over) return;

    const fromColumn = active.data.current?.column as ColumnId;
    const toColumn   = over.id as ColumnId;
    if (fromColumn === toColumn) return;

    const c = allMapped.find(c => c._convexId === active.id);
    if (!c) return;

    if (fromColumn === 'unapproved' && toColumn === 'approved') {
      await handleApprove(c);

    } else if (fromColumn === 'unapproved' && toColumn === 'scraped') {
      await handleApprove(c);
      triggerScrape(c);

    } else if (fromColumn === 'approved' && toColumn === 'unapproved') {
      await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error);

    } else if (fromColumn === 'approved' && toColumn === 'scraped') {
      triggerScrape(c);

    } else if (fromColumn === 'scraped' && toColumn === 'unapproved') {
      await updateStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'pending' }).catch(console.error);
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);

    } else if (fromColumn === 'scraped' && toColumn === 'approved') {
      await setEnrichStatus({ id: c._convexId as Id<'creatorCandidates'>, status: 'idle' }).catch(console.error);

    } else if (fromColumn === 'scraped' && toColumn === 'scraped') {
      // Re-scrape
      triggerScrape(c);
    }
  }

  const loading = rawCandidates === undefined || seeding;

  return (
    <div className="px-6 py-6 w-full space-y-4 overflow-visible">
      {/* Header */}
      <DiscoveryHeader
        pending={pending.length}
        scraped={scrapedCandidates.length}
        rejected={rejected.length}
        totalTracked={approved.length}
        avgViews={avgViews}
        avgEngagement={avgEngagement}
        avgFollowers={avgFollowers}
        topNiche={topNiche}
      />

      {/* Collapsible analytics */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-3 gap-4 overflow-hidden"
          >
            <DiscoveryFunnel
          total={allMapped.length}
          pending={pending.length}
          approved={approved.length}
          tracking={COMPETITORS.filter(c => c.status === 'active').length}
        />
        <NicheDonut />
        <ApprovalRatioWidget approved={approved.length} rejected={rejected.length} />
      </motion.div>
        )}
      </AnimatePresence>

      {/* 4-column Kanban pipeline */}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>

          {/* Col 1: Unapproved */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col gap-2">
            <DroppableZone id="unapproved" isOver={overColumn === 'unapproved'}>
              <PipelineColumn
                title="Unapproved"
                count={pending.length}
                accentColor="#dc2626"
                columnBg="rgba(220,38,38,0.035)"
                tooltip="Oracle scans Instagram for creators with unusually high view-to-follower ratios. Pending candidates need a decision."
                headerExtra={
                  duplicateCount > 0 ? (
                    <button
                      onClick={() => clearDuplicates().then(() => window.location.reload())}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ml-auto"
                      style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}
                    >
                      <Trash2 size={9} />
                      {duplicateCount} dupes
                    </button>
                  ) : undefined
                }
              >
                {loading ? (
                  <AnimatePresence>
                    {[0,1,2,3].map(i => <SkeletonRow key={i} />)}
                  </AnimatePresence>
                ) : pending.length === 0 ? (
                  <EmptyState filter="pending" />
                ) : (
                  <AnimatePresence>
                    {pending.map((c, i) => (
                      <DraggableCard key={c._convexId} id={c._convexId} column="unapproved">
                        <CandidateRow
                          candidate={c}
                          index={i}
                          isSelected={selectedId === c._convexId}
                          onSelect={() => setSelectedId(selectedId === c._convexId ? null : c._convexId)}
                          onApprove={e => { e.stopPropagation(); handleApprove(c); }}
                          onReject={e => { e.stopPropagation(); handleReject(c); }}
                        />
                      </DraggableCard>
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn>
            </DroppableZone>
            <RejectedPanel candidates={rejected} />
          </motion.div>

          {/* Col 2: Approved — awaiting scrape */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <DroppableZone id="approved" isOver={overColumn === 'approved'}>
              <PipelineColumn
                title="Approved"
                count={approvedPending.length}
                accentColor="#991b1b"
                columnBg="rgba(153,27,27,0.045)"
                tooltip="Creators cleared for active tracking. Click Scrape or drag to Scraped to pull their full profile data."
                glowKey={approvedGlow}
              >
                {approvedPending.length === 0 ? (
                  <p className="text-[11px] text-center py-8" style={{ color: 'rgba(153,27,27,0.4)' }}>No approved candidates yet</p>
                ) : (
                  <AnimatePresence>
                    {approvedPending.map((c, i) => (
                      <DraggableCard key={c._convexId} id={c._convexId} column="approved">
                        <ApprovedRow
                          candidate={c}
                          index={i}
                          isScraping={scrapingItems.some(s => s.handle === c.handle)}
                          onSelect={() => setSelectedId(selectedId === c._convexId ? null : c._convexId)}
                          onScrapeComplete={handles => handleScrapeComplete(handles, c.handle)}
                          onScrapeStart={() => addScraping(c)}
                          onScrapeEnd={() => removeScraping(c.handle)}
                        />
                      </DraggableCard>
                    ))}
                  </AnimatePresence>
                )}
              </PipelineColumn>
            </DroppableZone>
          </motion.div>

          {/* Col 3: Scraping — live */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <ScrapingColumn liveItems={scrapingItems} columnBg="rgba(127,29,29,0.055)" glowKey={scrapingGlow} />
          </motion.div>

          {/* Col 4: Scraped — enriched creators */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
            <DroppableZone id="scraped" isOver={overColumn === 'scraped'}>
              <PipelineColumn
                title="Scraped"
                count={scrapedCandidates.length}
                accentColor="#7f1d1d"
                columnBg="rgba(127,29,29,0.03)"
                tooltip="Approved creators with enriched profile data pulled from Instagram."
                glowKey={scrapedGlow}
              >
                {scrapedCandidates.length === 0 ? (
                  <p className="text-[11px] text-center py-8" style={{ color: 'rgba(127,29,29,0.3)' }}>Scrape an approved card to see results</p>
                ) : (
                  scrapedCandidates.map(c => (
                    <DraggableCard key={c._convexId} id={c._convexId} column="scraped">
                      <ScrapedRow c={c} />
                    </DraggableCard>
                  ))
                )}
              </PipelineColumn>
            </DroppableZone>
          </motion.div>
        </div>

        {/* Drag overlay — ghost card that follows the cursor */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeCandidate ? <DragGhost c={activeCandidate} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Manual seed button - visible when no data and not loading */}
      {!loading && allMapped.length === 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setSeeding(true);
              seedPreApproved({ accounts: PRE_APPROVED }).finally(() => setSeeding(false));
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
          >
            <Zap size={12} /> Seed pre-approved accounts
          </button>
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <DetailPanel
            key={selected._convexId}
            candidate={selected}
            onClose={() => setSelectedId(null)}
            onDecision={handleDecision}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
