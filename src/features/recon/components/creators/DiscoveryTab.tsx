'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BarChart2, Loader2, Zap } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Candidate, CandidateStatus } from '../../types';
import { COMPETITORS } from '../../creatorData';
import { DiscoveryHeader }  from './discovery/DiscoveryHeader';
import { InfoTooltip }     from './discovery/InfoTooltip';
import { CandidateRow }     from './discovery/CandidateRow';
import { DetailPanel }      from './discovery/DetailPanel';
import { EmptyState }       from './discovery/EmptyState';
import { DiscoveryFunnel }  from './discovery/DiscoveryFunnel';
import { NicheDonut }       from './discovery/NicheDonut';
import { ScrapingColumn }   from './discovery/ScrapingColumn';

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
};

type MappedCandidate = Candidate & { _convexId: string };

function convexToCandidate(doc: ConvexCandidate): MappedCandidate {
  const avatarIdx = stableNum(doc.handle) % AVATAR_COLORS.length;
  const addedDate = new Date(doc.addedAt);
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

// ── Inline sub-components ────────────────────────────────────────────────────

interface PipelineColumnProps {
  title: string;
  count: number;
  accentColor: string;
  columnBg: string;
  tooltip: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}

function PipelineColumn({ title, count, accentColor, columnBg, tooltip, headerExtra, children }: PipelineColumnProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: columnBg }}>
      <div
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
      </div>
      <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5 scrollbar-thin">
        {children}
      </div>
    </div>
  );
}

function ApprovedRow({ candidate }: { candidate: MappedCandidate }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      <span
        className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
        style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}
      >
        {candidate.initials}
      </span>
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{candidate.handle}</p>
      <span className="text-[8px] font-semibold px-1 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(220,38,38,0.07)', color: '#b91c1c' }}>
        {candidate.niche}
      </span>
      {candidate.outlierRatio > 0 && (
        <span className="text-[9px] font-bold tabular-nums flex-shrink-0" style={{ color: '#dc2626' }}>
          {candidate.outlierRatio.toFixed(2)}×
        </span>
      )}
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#4ade80' }} />
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

// ── Candidates column tab toggle ─────────────────────────────────────────────

type CandidateTab = 'unapproved' | 'approved';

function CandidateTabToggle({ active, onChange, pendingCount, approvedCount }: {
  active: CandidateTab;
  onChange: (t: CandidateTab) => void;
  pendingCount: number;
  approvedCount: number;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(220,38,38,0.15)', backgroundColor: 'rgba(220,38,38,0.05)' }}>
      {(['unapproved', 'approved'] as CandidateTab[]).map(tab => {
        const isActive = active === tab;
        const count    = tab === 'unapproved' ? pendingCount : approvedCount;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="flex items-center gap-1 px-2 py-1 text-[9px] font-semibold capitalize transition-all"
            style={{
              backgroundColor: isActive ? '#dc2626' : 'transparent',
              color:           isActive ? '#fff'    : '#dc2626',
            }}
          >
            {tab}
            <span
              className="px-1 rounded text-[8px] font-bold"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(220,38,38,0.15)',
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DiscoveryTab({ searchQuery = '' }: { extraCandidates?: unknown[]; searchQuery?: string } = {}) {
  const [selectedId,      setSelectedId]      = useState<string | null>(null);
  const [candidateTab,    setCandidateTab]     = useState<CandidateTab>('unapproved');
  const [widgetsOpen,     setWidgetsOpen]      = useState(false);
  const [discovering,     setDiscovering]      = useState(false);
  const [alertThreshold,  setAlertThreshold]   = useState<number>(10);
  const [scheduleHours,   setScheduleHours]    = useState<number>(6);
  const [seeding,         setSeeding]          = useState(false);
  const seededRef = useRef(false);

  // Convex
  const rawCandidates   = useQuery(api.candidates.list, {}) ?? undefined;
  const seedPreApproved = useMutation(api.candidates.seedPreApproved);
  const updateStatus    = useMutation(api.candidates.updateStatus);

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

  const pending  = allMapped.filter(c => c.status === 'pending'  && matchesSearch(c)).sort((a, b) => b.outlierRatio - a.outlierRatio);
  const approved = allMapped.filter(c => c.status === 'approved' && matchesSearch(c));
  const rejected = allMapped.filter(c => c.status === 'rejected' && matchesSearch(c));

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

  const loading = rawCandidates === undefined || seeding;

  return (
    <div className="px-6 py-6 w-full space-y-4">
      {/* Header */}
      <DiscoveryHeader
        total={allMapped.length}
        pending={pending.length}
        approved={approved.length}
        approvedToday={0}
        candidatesScraped={allMapped.length}
        contentScraped={0}
        alertThreshold={alertThreshold}
        discovering={discovering}
        scheduleHours={scheduleHours}
        onAlertChange={setAlertThreshold}
        onScheduleChange={setScheduleHours}
        onRunDiscovery={runDiscovery}
      />

      {/* Collapsible analytics */}
      <div>
        <button
          onClick={() => setWidgetsOpen(v => !v)}
          className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors mb-2"
        >
          {widgetsOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          <BarChart2 size={11} />
          <span className="font-medium">{widgetsOpen ? 'Hide' : 'Show'} analytics</span>
        </button>
        <AnimatePresence>
          {widgetsOpen && (
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
      </div>

      {/* 3-column pipeline */}
      <div className="grid gap-4 items-start" style={{ gridTemplateColumns: '1fr 1fr 2fr' }}>

        {/* Candidates column - tabbed: Unapproved / Approved */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
          <PipelineColumn
            title="Candidates"
            count={candidateTab === 'unapproved' ? pending.length : approved.length}
            accentColor="#dc2626"
            columnBg="rgba(220,38,38,0.035)"
            tooltip="Oracle scans Instagram for creators with unusually high view-to-follower ratios. Pending candidates need a decision; approved are cleared for tracking."
            headerExtra={
              <CandidateTabToggle
                active={candidateTab}
                onChange={setCandidateTab}
                pendingCount={pending.length}
                approvedCount={approved.length}
              />
            }
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 size={16} className="animate-spin" style={{ color: '#dc2626' }} />
                <p className="text-[10px] text-neutral-400">{seeding ? 'Seeding accounts...' : 'Loading...'}</p>
              </div>
            ) : candidateTab === 'unapproved' ? (
              pending.length === 0 ? (
                <EmptyState filter="pending" onRunDiscovery={runDiscovery} />
              ) : (
                pending.map(c => (
                  <CandidateRow
                    key={c._convexId}
                    candidate={c}
                    isSelected={selectedId === c._convexId}
                    onSelect={() => setSelectedId(selectedId === c._convexId ? null : c._convexId)}
                  />
                ))
              )
            ) : (
              approved.length === 0 ? (
                <p className="text-[11px] text-center py-8" style={{ color: 'rgba(153,27,27,0.4)' }}>No approved candidates yet</p>
              ) : (
                approved.map(c => (
                  <div
                    key={c._convexId}
                    onClick={() => setSelectedId(selectedId === c._convexId ? null : c._convexId)}
                    className="cursor-pointer"
                  >
                    <ApprovedRow candidate={c} />
                  </div>
                ))
              )
            )}
          </PipelineColumn>
        </motion.div>

        {/* Tracking column - recently approved + rejected */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col gap-2">
          <PipelineColumn
            title="Tracking"
            count={approved.length}
            accentColor="#991b1b"
            columnBg="rgba(153,27,27,0.045)"
            tooltip="Creators cleared for active tracking. Their content history is pulled into the intelligence layer."
          >
            {approved.length === 0 ? (
              <p className="text-[11px] text-center py-8" style={{ color: 'rgba(153,27,27,0.4)' }}>No tracked creators yet</p>
            ) : (
              approved.map(c => <ApprovedRow key={c._convexId} candidate={c} />)
            )}
          </PipelineColumn>
          <RejectedPanel candidates={rejected} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
          <ScrapingColumn discovering={discovering} columnBg="rgba(127,29,29,0.055)" />
        </motion.div>
      </div>

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
