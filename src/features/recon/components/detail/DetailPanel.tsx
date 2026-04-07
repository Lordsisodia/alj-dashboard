'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, TrendingUp, ExternalLink, CheckCircle, XCircle, Sparkles, Loader2, Radar, Zap } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Candidate, CandidateStatus } from '../../types';
import { fmtViews } from '../creators/discovery/discoveryUtils';

interface Props {
  candidate: Candidate;
  onClose:   () => void;
  onDecision: (id: number, status: CandidateStatus) => void;
}

type Verdict = { verdict: 'HIRE' | 'WATCH' | 'PASS'; score: number; reason: string };

const VERDICT_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  HIRE:  { bg: 'rgba(34,197,94,0.08)',  color: '#16a34a', border: 'rgba(34,197,94,0.25)'  },
  WATCH: { bg: 'rgba(234,179,8,0.08)',  color: '#ca8a04', border: 'rgba(234,179,8,0.25)'  },
  PASS:  { bg: 'rgba(239,68,68,0.08)',  color: '#dc2626', border: 'rgba(239,68,68,0.25)'  },
};

export function DetailPanel({ candidate, onClose, onDecision }: Props) {
  const [verdict,   setVerdict]   = useState<Verdict | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [approving, setApproving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enriched,  setEnriched]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const approveCandidate = useMutation(api.trackedAccounts.approveCandidate);
  const upsertCandidate  = useMutation(api.candidates.upsert);
  const alreadyTracked   = useQuery(api.trackedAccounts.isTracked, { handle: candidate.handle });

  // Auto-run verdict when panel opens - skip if already tracked or no enrichment data
  useEffect(() => {
    if (alreadyTracked || candidate.outlierRatio === 0) return;
    let cancelled = false;
    async function fetchVerdict() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/recon/verdict', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ candidate }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!cancelled) setVerdict(data);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Verdict failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchVerdict();
    return () => { cancelled = true; };
  }, [candidate.handle, alreadyTracked, candidate.outlierRatio]);

  async function handleApprove() {
    setApproving(true);
    try {
      await approveCandidate({
        handle:            candidate.handle,
        displayName:       candidate.displayName,
        niche:             candidate.niche,
        avatarColor:       candidate.avatarColor,
        followerCount:     candidate.followersRaw,
        avgEngagementRate: parseFloat(candidate.engagementRate) / 100 || 0,
      });
      onDecision(candidate.id, 'approved');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    } finally {
      setApproving(false);
    }
  }

  function handleReject() {
    onDecision(candidate.id, 'rejected');
  }

  async function handleEnrich() {
    setEnriching(true);
    setError(null);
    try {
      const res = await fetch('/api/recon/enrich-candidate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ handle: candidate.handle }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Save enriched data back to Convex - strip null values (Convex v.optional ≠ null)
      const nn = <T,>(v: T | null | undefined): T | undefined => v ?? undefined;
      await upsertCandidate({
        handle:        data.handle,
        displayName:   data.displayName || candidate.displayName,
        niche:         candidate.niche,
        status:        candidate.status as 'pending' | 'approved' | 'rejected',
        source:        'pre_approved', // keep original source
        ...(nn(data.followerCount) !== undefined && { followerCount: data.followerCount }),
        ...(nn(data.followsCount)  !== undefined && { followsCount:  data.followsCount  }),
        ...(nn(data.postsCount)    !== undefined && { postsCount:    data.postsCount    }),
        ...(nn(data.bio)           !== undefined && { bio:           data.bio           }),
        ...(nn(data.avatarUrl)     !== undefined && { avatarUrl:     data.avatarUrl     }),
        ...(nn(data.avgViews)      !== undefined && { avgViews:      data.avgViews      }),
        ...(nn(data.outlierRatio)  !== undefined && { outlierRatio:  data.outlierRatio  }),
        ...(nn(data.verified)      !== undefined && { verified:      data.verified      }),
        ...(nn(data.instagramId)   !== undefined && { instagramId:   data.instagramId   }),
      });

      // Feed related handles back as pending candidates
      if (data.relatedHandles?.length) {
        for (const h of data.relatedHandles.slice(0, 10)) {
          await upsertCandidate({
            handle:      `@${h}`,
            displayName: h,
            status:      'pending',
            source:      'scraper',
            suggestedBy: data.handle,
          }).catch(() => {/* dedup - ignore */});
        }
      }

      setEnriched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Enrich failed');
    } finally {
      setEnriching(false);
    }
  }

  const vs = verdict ? VERDICT_STYLES[verdict.verdict] : null;
  const ratioColor = candidate.outlierRatio >= 2.0 ? '#dc2626'
    : candidate.outlierRatio >= 1.5 ? '#b91c1c'
    : candidate.outlierRatio >= 1.0 ? '#ef4444'
    : '#991b1b';

  const panel = (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[190]"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Side panel */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 z-[200] w-80 bg-white overflow-y-auto flex flex-col"
        style={{ boxShadow: '-4px 0 32px rgba(0,0,0,0.12)' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: candidate.avatarColor }}
            >
              {candidate.initials}
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-tight">{candidate.handle}</p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {candidate.niche}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alreadyTracked && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}>
                Tracked
              </span>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-4 space-y-3">

          {/* AI Verdict */}
          <div>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(131,58,180,0.05)', border: '1px solid rgba(131,58,180,0.1)' }}>
                <Loader2 size={11} className="animate-spin flex-shrink-0" style={{ color: '#833ab4' }} />
                <span className="text-[10px] text-neutral-500">ORACLE scoring...</span>
              </div>
            )}
            {!loading && error && (
              <div className="px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <p className="text-[10px] text-red-400">Verdict unavailable - all models busy</p>
              </div>
            )}
            {!loading && verdict && vs && (
              <div className="px-3 py-2.5 rounded-xl" style={{ backgroundColor: vs.bg, border: `1px solid ${vs.border}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={10} style={{ color: vs.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: vs.color }}>
                    ORACLE: {verdict.verdict}
                  </span>
                  <span className="ml-auto text-sm font-bold tabular-nums" style={{ color: vs.color }}>
                    {verdict.score}/10
                  </span>
                </div>
                <p className="text-[11px] leading-snug" style={{ color: vs.color }}>{verdict.reason}</p>
              </div>
            )}
          </div>

          {/* Outlier ratio */}
          {candidate.outlierRatio > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: `${ratioColor}0d`, border: `1px solid ${ratioColor}20` }}>
              <TrendingUp size={14} style={{ color: ratioColor, flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-neutral-500">Outlier ratio</p>
                <p className="text-lg font-bold leading-none mt-0.5" style={{ color: ratioColor }}>
                  {candidate.outlierRatio.toFixed(2)}×
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-neutral-400">Avg views</p>
                <p className="text-xs font-bold text-neutral-700">{fmtViews(candidate.avgViews)}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'Followers',  value: candidate.followers      },
              { label: 'Eng. Rate',  value: candidate.engagementRate },
              { label: 'Posts/Wk',   value: String(candidate.postsPerWeek || '-') },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-2 rounded-xl" style={{ backgroundColor: '#f7f7f7' }}>
                <p className="text-xs font-bold text-neutral-900">{value}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          {candidate.bio && (
            <p className="text-[11px] text-neutral-500 leading-snug">{candidate.bio}</p>
          )}

          {/* Source */}
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <Radar size={10} />
            {candidate.suggestedBy
              ? <span>via <span className="font-semibold text-neutral-600">{candidate.suggestedBy}</span></span>
              : <span>Added manually</span>}
            <span className="ml-auto text-neutral-300">{candidate.discoveredAt}</span>
          </div>

          {/* Enrich button - pulls real Apify data */}
          {!enriched && candidate.outlierRatio === 0 && (
            <button
              onClick={handleEnrich}
              disabled={enriching}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}
            >
              {enriching
                ? <><Loader2 size={11} className="animate-spin" /> Pulling Instagram data...</>
                : <><Zap size={11} /> Enrich with Apify</>}
            </button>
          )}
          {enriched && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium" style={{ backgroundColor: 'rgba(34,197,94,0.07)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.15)' }}>
              <CheckCircle size={11} /> Enriched - verdict will run on reopen
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {!alreadyTracked ? (
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', backgroundColor: 'rgba(239,68,68,0.04)' }}
              >
                <XCircle size={12} /> Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {approving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                {approving ? 'Adding...' : 'Approve → Track'}
              </button>
            </div>
          ) : (
            <a
              href={`https://instagram.com/${candidate.handle.replace('@', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <ExternalLink size={10} /> View on Instagram
            </a>
          )}
        </div>
      </motion.div>
    </>
  );

  return createPortal(panel, document.body);
}
