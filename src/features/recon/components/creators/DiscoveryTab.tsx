'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar, Play, Check, X, Users, Clock,
  Sparkles, ExternalLink, RotateCcw, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Candidate, CandidateStatus } from '../../types';
import { containerVariants, fadeUp } from '../../constants';

// ─── Mock seed data ───────────────────────────────────────────────────────────

const SEED_CANDIDATES: Candidate[] = [
  { id: 1,  handle: '@nova.abg',         displayName: 'Nova ABG',       niche: 'ABG',       nicheColor: '#833ab4', avatarColor: '#833ab4', initials: 'NA', followers: '84K',  engagementRate: '6.2%', postsPerWeek: 11, suggestedBy: '@abg.empress',    discoveredAt: 'Today',       status: 'pending',  sampleGradients: [['#833ab4','#ff0069'],['#ff0069','#fcaf45'],['#833ab4','#4a9eff'],['#4a9eff','#78c257'],['#fcaf45','#833ab4'],['#ff0069','#833ab4']] },
  { id: 2,  handle: '@fitqueen.ig',       displayName: 'Fit Queen',      niche: 'Fitness',   nicheColor: '#78c257', avatarColor: '#78c257', initials: 'FQ', followers: '112K', engagementRate: '4.8%', postsPerWeek: 8,  suggestedBy: '@fitness_king',   discoveredAt: 'Today',       status: 'pending',  sampleGradients: [['#78c257','#4a9eff'],['#4a9eff','#78c257'],['#78c257','#fcaf45'],['#fcaf45','#78c257'],['#78c257','#833ab4'],['#4a9eff','#ff0069']] },
  { id: 3,  handle: '@gfe.royale',        displayName: 'GFE Royale',     niche: 'GFE',       nicheColor: '#ff0069', avatarColor: '#ff0069', initials: 'GR', followers: '67K',  engagementRate: '9.3%', postsPerWeek: 14, suggestedBy: '@gfe_luxe',       discoveredAt: 'Today',       status: 'pending',  sampleGradients: [['#ff0069','#fcaf45'],['#fcaf45','#ff0069'],['#ff0069','#833ab4'],['#833ab4','#ff0069'],['#ff0069','#4a9eff'],['#4a9eff','#ff0069']] },
  { id: 4,  handle: '@luxe.daily2',       displayName: 'Luxe Daily II',  niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#4a9eff', initials: 'LD', followers: '203K', engagementRate: '3.1%', postsPerWeek: 6,  suggestedBy: '@daily.luxe',     discoveredAt: 'Today',       status: 'pending',  sampleGradients: [['#4a9eff','#833ab4'],['#833ab4','#4a9eff'],['#4a9eff','#78c257'],['#78c257','#4a9eff'],['#4a9eff','#ff0069'],['#ff0069','#4a9eff']] },
  { id: 5,  handle: '@abg.ricelover',     displayName: 'ABG Rice',       niche: 'ABG',       nicheColor: '#833ab4', avatarColor: '#fcaf45', initials: 'AR', followers: '51K',  engagementRate: '8.1%', postsPerWeek: 9,  suggestedBy: '@abg.empress',    discoveredAt: 'Today',       status: 'pending',  sampleGradients: [['#fcaf45','#ff0069'],['#ff0069','#833ab4'],['#833ab4','#fcaf45'],['#fcaf45','#4a9eff'],['#4a9eff','#833ab4'],['#ff0069','#fcaf45']] },
  { id: 6,  handle: '@fit.empire',        displayName: 'Fit Empire',     niche: 'Fitness',   nicheColor: '#78c257', avatarColor: '#4a9eff', initials: 'FE', followers: '88K',  engagementRate: '5.5%', postsPerWeek: 10, suggestedBy: '@fitness_king',   discoveredAt: 'Yesterday',   status: 'pending',  sampleGradients: [['#4a9eff','#78c257'],['#78c257','#ff0069'],['#ff0069','#4a9eff'],['#4a9eff','#fcaf45'],['#fcaf45','#78c257'],['#78c257','#833ab4']] },
  { id: 7,  handle: '@softgirl.vibes',    displayName: 'Soft Vibes',     niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#833ab4', initials: 'SV', followers: '174K', engagementRate: '4.0%', postsPerWeek: 7,  suggestedBy: null,              discoveredAt: 'Yesterday',   status: 'approved', sampleGradients: [['#833ab4','#ff0069'],['#ff0069','#4a9eff'],['#4a9eff','#833ab4'],['#833ab4','#78c257'],['#78c257','#ff0069'],['#ff0069','#833ab4']] },
  { id: 8,  handle: '@gfe.celestial',     displayName: 'GFE Celestial',  niche: 'GFE',       nicheColor: '#ff0069', avatarColor: '#ff0069', initials: 'GC', followers: '39K',  engagementRate: '11.2%',postsPerWeek: 16, suggestedBy: '@glam.gfe',       discoveredAt: 'Yesterday',   status: 'rejected', sampleGradients: [['#ff0069','#833ab4'],['#833ab4','#fcaf45'],['#fcaf45','#ff0069'],['#ff0069','#4a9eff'],['#4a9eff','#78c257'],['#78c257','#ff0069']] },
  { id: 9,  handle: '@abg.babyangel',     displayName: 'Baby Angel',     niche: 'ABG',       nicheColor: '#833ab4', avatarColor: '#78c257', initials: 'BA', followers: '92K',  engagementRate: '7.4%', postsPerWeek: 12, suggestedBy: '@abg.babyy',      discoveredAt: '2 days ago',  status: 'approved', sampleGradients: [['#78c257','#833ab4'],['#833ab4','#ff0069'],['#ff0069','#78c257'],['#78c257','#4a9eff'],['#4a9eff','#833ab4'],['#833ab4','#fcaf45']] },
  { id: 10, handle: '@nova.fitness',      displayName: 'Nova Fitness',   niche: 'Fitness',   nicheColor: '#78c257', avatarColor: '#ff0069', initials: 'NF', followers: '145K', engagementRate: '3.9%', postsPerWeek: 7,  suggestedBy: null,              discoveredAt: '2 days ago',  status: 'rejected', sampleGradients: [['#ff0069','#78c257'],['#78c257','#fcaf45'],['#fcaf45','#ff0069'],['#ff0069','#833ab4'],['#833ab4','#78c257'],['#78c257','#4a9eff']] },
  { id: 11, handle: '@lifestyle.pearl',   displayName: 'Pearl Lifestyle', niche: 'Lifestyle', nicheColor: '#4a9eff', avatarColor: '#fcaf45', initials: 'LP', followers: '261K', engagementRate: '2.8%', postsPerWeek: 5,  suggestedBy: '@lifestyle.nova', discoveredAt: '2 days ago',  status: 'pending',  sampleGradients: [['#fcaf45','#4a9eff'],['#4a9eff','#833ab4'],['#833ab4','#fcaf45'],['#fcaf45','#78c257'],['#78c257','#ff0069'],['#ff0069','#4a9eff']] },
  { id: 12, handle: '@gfe.haus',          displayName: 'GFE Haus',       niche: 'GFE',       nicheColor: '#ff0069', avatarColor: '#833ab4', initials: 'GH', followers: '58K',  engagementRate: '8.8%', postsPerWeek: 13, suggestedBy: '@gfe_luxe',       discoveredAt: '3 days ago',  status: 'pending',  sampleGradients: [['#833ab4','#ff0069'],['#ff0069','#78c257'],['#78c257','#833ab4'],['#833ab4','#4a9eff'],['#4a9eff','#ff0069'],['#ff0069','#fcaf45']] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { id: CandidateStatus | 'all'; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'pending',  label: 'Pending'  },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<CandidateStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: 'Pending',  bg: 'rgba(251,191,36,0.12)', color: '#92640a' },
  approved: { label: 'Approved', bg: 'rgba(120,194,87,0.12)', color: '#4a8a2d' },
  rejected: { label: 'Rejected', bg: 'rgba(0,0,0,0.05)',      color: '#9ca3af' },
};

// ─── Stat card (slim version for top bar) ────────────────────────────────────

function MiniStat({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white flex-1" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-neutral-900 leading-none">{value}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Sample post grid (placeholder thumbnails) ────────────────────────────────

function SamplePostGrid({ gradients }: { gradients: [string, string][] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {gradients.map(([from, to], i) => (
        <div
          key={i}
          className="aspect-square rounded-lg"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        />
      ))}
    </div>
  );
}

// ─── Candidate queue row ──────────────────────────────────────────────────────

function CandidateRow({
  candidate,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onRestore,
}: {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRestore: () => void;
}) {
  const isPending  = candidate.status === 'pending';
  const isApproved = candidate.status === 'approved';
  const st         = STATUS_STYLE[candidate.status];

  return (
    <motion.div
      variants={fadeUp}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all',
        isSelected ? 'ring-2 ring-[#ff0069]/20' : 'hover:bg-black/[0.02]',
      )}
      style={{
        backgroundColor: '#fff',
        border: isSelected ? '1px solid rgba(255,0,105,0.25)' : '1px solid rgba(0,0,0,0.07)',
        opacity: candidate.status === 'rejected' ? 0.6 : 1,
      }}
      whileHover={{ y: -1, transition: { duration: 0.12 } }}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
        style={{ backgroundColor: candidate.avatarColor }}
      >
        {candidate.initials}
      </div>

      {/* Handle + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-sm font-semibold text-neutral-900 truncate">{candidate.handle}</p>
          <div
            className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: candidate.nicheColor }}
          >
            {candidate.niche}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
          <span>{candidate.followers}</span>
          <span>·</span>
          <span>{candidate.engagementRate} eng.</span>
          {candidate.suggestedBy && (
            <>
              <span>·</span>
              <span className="truncate">via {candidate.suggestedBy}</span>
            </>
          )}
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
        {!isPending ? (
          <>
            <div
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold"
              style={{ backgroundColor: st.bg, color: st.color }}
            >
              {st.label}
            </div>
            <button
              onClick={onRestore}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400"
              title="Move back to pending"
            >
              <RotateCcw size={11} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onReject}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.07)', color: '#dc2626' }}
              title="Reject"
            >
              <X size={12} />
            </button>
            <button
              onClick={onApprove}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              <Check size={11} />
              Approve
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ candidate, onApprove, onReject, onRestore }: {
  candidate: Candidate;
  onApprove: () => void;
  onReject: () => void;
  onRestore: () => void;
}) {
  const isPending  = candidate.status === 'pending';
  const st         = STATUS_STYLE[candidate.status];

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-xl bg-white overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="h-20 flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${candidate.nicheColor}cc, ${candidate.avatarColor}80)` }}
      />
      <div className="px-5 pb-5">
        {/* Avatar + handle */}
        <div className="flex items-end justify-between -mt-6 mb-4">
          <div
            className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-base font-bold text-white shadow-sm"
            style={{ backgroundColor: candidate.avatarColor }}
          >
            {candidate.initials}
          </div>
          <div
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold mb-1"
            style={{ backgroundColor: st.bg, color: st.color }}
          >
            {st.label}
          </div>
        </div>

        <p className="text-base font-bold text-neutral-900">{candidate.handle}</p>
        <div
          className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
          style={{ backgroundColor: candidate.nicheColor }}
        >
          {candidate.niche}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Followers',  value: candidate.followers },
            { label: 'Eng. Rate',  value: candidate.engagementRate },
            { label: 'Posts/Wk',   value: String(candidate.postsPerWeek) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-2.5 rounded-xl" style={{ backgroundColor: '#f7f7f7' }}>
              <p className="text-sm font-bold text-neutral-900">{value}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Source */}
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
          <Radar size={12} className="flex-shrink-0" />
          {candidate.suggestedBy
            ? <span>Discovered via <span className="font-semibold text-neutral-700">{candidate.suggestedBy}</span></span>
            : <span>Added manually</span>
          }
          <span className="ml-auto text-[11px] text-neutral-400">{candidate.discoveredAt}</span>
        </div>

        {/* Sample posts */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold text-neutral-500 mb-2">Sample content</p>
          <SamplePostGrid gradients={candidate.sampleGradients} />
        </div>

        {/* CTA */}
        <div className="mt-5 flex gap-2">
          {isPending ? (
            <>
              <button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <X size={13} />
                Reject
              </button>
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                <Check size={13} />
                Approve to Track
              </button>
            </>
          ) : (
            <button
              onClick={onRestore}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <RotateCcw size={13} />
              Move back to pending
            </button>
          )}
        </div>

        {/* View on Instagram */}
        <a
          href={`https://instagram.com/${candidate.handle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <ExternalLink size={11} />
          View on Instagram
        </a>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filter, onRunDiscovery }: { filter: string; onRunDiscovery: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
        <Sparkles size={22} />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-1">
        {filter === 'pending' ? 'No pending candidates' : filter === 'approved' ? 'None approved yet' : filter === 'rejected' ? 'None rejected' : 'No candidates yet'}
      </p>
      <p className="text-xs text-neutral-400 max-w-[200px] mb-5">
        {filter === 'all' || filter === 'pending'
          ? 'Run Discovery to automatically find new accounts from your tracked creators.'
          : 'Use the filter above to switch views.'}
      </p>
      {(filter === 'all' || filter === 'pending') && (
        <button
          onClick={onRunDiscovery}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Play size={13} />
          Run Discovery
        </button>
      )}
    </div>
  );
}

// ─── Discovery Tab ────────────────────────────────────────────────────────────

export function DiscoveryTab() {
  const [candidates, setCandidates]     = useState<Candidate[]>(SEED_CANDIDATES);
  const [filter, setFilter]             = useState<CandidateStatus | 'all'>('pending');
  const [selectedId, setSelectedId]     = useState<number | null>(SEED_CANDIDATES.find(c => c.status === 'pending')?.id ?? null);
  const [discovering, setDiscovering]   = useState(false);

  const pending  = candidates.filter(c => c.status === 'pending').length;
  const approved = candidates.filter(c => c.status === 'approved').length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;

  const filtered = candidates.filter(c => filter === 'all' || c.status === filter);
  const selected = candidates.find(c => c.id === selectedId) ?? null;

  function setStatus(id: number, status: CandidateStatus) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    // Auto-advance to next pending
    if (status !== 'pending') {
      const nextPending = candidates.find(c => c.id !== id && c.status === 'pending');
      setSelectedId(nextPending?.id ?? null);
    }
  }

  async function runDiscovery() {
    setDiscovering(true);
    await new Promise(r => setTimeout(r, 2400));
    // Simulate 3 newly discovered accounts arriving
    setCandidates(prev => [
      {
        id: Date.now(),
        handle: '@gfe.shimmer',
        displayName: 'GFE Shimmer',
        niche: 'GFE',
        nicheColor: '#ff0069',
        avatarColor: '#ff0069',
        initials: 'GS',
        followers: '43K',
        engagementRate: '10.1%',
        postsPerWeek: 15,
        suggestedBy: '@gfe_luxe',
        discoveredAt: 'Just now',
        status: 'pending',
        sampleGradients: [['#ff0069','#833ab4'],['#833ab4','#ff0069'],['#ff0069','#fcaf45'],['#fcaf45','#ff0069'],['#ff0069','#4a9eff'],['#4a9eff','#ff0069']],
      },
      {
        id: Date.now() + 1,
        handle: '@abg.sakura',
        displayName: 'ABG Sakura',
        niche: 'ABG',
        nicheColor: '#833ab4',
        avatarColor: '#833ab4',
        initials: 'AS',
        followers: '77K',
        engagementRate: '7.0%',
        postsPerWeek: 10,
        suggestedBy: '@abg.babyy',
        discoveredAt: 'Just now',
        status: 'pending',
        sampleGradients: [['#833ab4','#fcaf45'],['#fcaf45','#833ab4'],['#833ab4','#78c257'],['#78c257','#833ab4'],['#833ab4','#ff0069'],['#ff0069','#833ab4']],
      },
      ...prev,
    ]);
    setFilter('pending');
    setDiscovering(false);
  }

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full space-y-4">

      {/* Top bar: stats + run button */}
      <div className="flex items-center gap-3">
        <MiniStat label="Total candidates"   value={candidates.length} icon={<Users size={15} />}   color="#4a9eff" />
        <MiniStat label="Pending review"     value={pending}           icon={<Clock size={15} />}   color="#f59e0b" />
        <MiniStat label="Approved to track"  value={approved}          icon={<Check size={15} />}   color="#78c257" />

        <button
          onClick={runDiscovery}
          disabled={discovering}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-70 transition-opacity hover:opacity-90 flex-shrink-0 ml-auto"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          {discovering
            ? <><Loader2 size={14} className="animate-spin" /> Discovering…</>
            : <><Play size={14} /> Run Discovery</>
          }
        </button>
      </div>

      {/* Two-column: queue left, detail right */}
      <div className="flex gap-4 items-start">

        {/* Left — candidate queue */}
        <div className="flex-1 min-w-0 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
          {/* Queue header + filter pills */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-sm font-semibold text-neutral-900">
              Candidate queue
              {pending > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
                  {pending}
                </span>
              )}
            </p>
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                    filter === f.id
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]',
                  )}
                  style={filter === f.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="p-3">
            {filtered.length === 0 ? (
              <EmptyState filter={filter} onRunDiscovery={runDiscovery} />
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-1.5">
                <AnimatePresence>
                  {filtered.map(c => (
                    <CandidateRow
                      key={c.id}
                      candidate={c}
                      isSelected={selectedId === c.id}
                      onSelect={() => setSelectedId(c.id)}
                      onApprove={() => setStatus(c.id, 'approved')}
                      onReject={() => setStatus(c.id, 'rejected')}
                      onRestore={() => setStatus(c.id, 'pending')}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right — detail panel */}
        <div className="w-72 flex-shrink-0 sticky top-6">
          <AnimatePresence mode="wait">
            {selected ? (
              <DetailPanel
                key={selected.id}
                candidate={selected}
                onApprove={() => setStatus(selected.id, 'approved')}
                onReject={() => setStatus(selected.id, 'rejected')}
                onRestore={() => setStatus(selected.id, 'pending')}
              />
            ) : (
              <motion.div
                key="empty-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-white flex flex-col items-center justify-center py-16 text-center"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#d1d5db' }}>
                  <Users size={18} />
                </div>
                <p className="text-xs text-neutral-400">Select a candidate to preview</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
