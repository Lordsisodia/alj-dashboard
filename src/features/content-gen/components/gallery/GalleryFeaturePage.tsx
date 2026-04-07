'use client';

import { useState, useMemo } from 'react';
import { Play, CheckCircle2, XCircle, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SEED_HISTORY } from '../queue/seed';
import { PROVIDER_CFG } from '../queue/types';
import type { HistoryJob, Outcome } from '../queue/types';

const MODEL_COLOR: Record<string, string> = {
  Tyler: '#f97316',
  Ren:   '#14b8a6',
  Ella:  '#3b82f6',
  Amam:  '#f59e0b',
};

const OUTCOME_FILTERS = [
  { id: 'all',            label: 'All'            },
  { id: 'Pending Review', label: 'Needs Review'   },
  { id: 'Approved',       label: 'Approved'       },
  { id: 'Rejected',       label: 'Rejected'       },
];

function OutcomeOverlay({ outcome }: { outcome?: Outcome }) {
  if (!outcome || outcome === 'Pending Review') return null;
  const isApproved = outcome === 'Approved';
  return (
    <div
      className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: isApproved ? '#10b981' : '#ef4444' }}
    >
      {isApproved ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
      {outcome}
    </div>
  );
}

function GalleryCard({ job }: { job: HistoryJob }) {
  const [hovered, setHovered] = useState(false);
  const color  = MODEL_COLOR[job.modelName] ?? '#a78bfa';
  const thumb  = job.thumbnailColor ?? '#888';
  const { bar } = PROVIDER_CFG[job.provider];
  const needsReview = !job.outcome || job.outcome === 'Pending Review';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{ border: needsReview ? '1.5px solid #fbbf24' : '1px solid rgba(0,0,0,0.07)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 9:16 thumbnail */}
      <div
        className="w-full flex items-center justify-center relative"
        style={{
          aspectRatio: '9/16',
          background: `linear-gradient(160deg, ${thumb}cc 0%, ${thumb}55 100%)`,
        }}
      >
        {/* Play button */}
        <div className="w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
          <Play size={14} className="text-white ml-0.5" fill="white" />
        </div>

        {/* Provider accent strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: bar }} />

        {/* Outcome badge */}
        <OutcomeOverlay outcome={job.outcome} />

        {/* Pending review glow */}
        {needsReview && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-800" style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={9} /> Review
          </div>
        )}

        {/* Hover action overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 flex flex-col justify-end p-2.5"
              style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)' }}
            >
              <div className="flex gap-1.5">
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-semibold text-white hover:brightness-110 transition-all"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  <CheckCircle2 size={10} /> Approve
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-semibold text-white/90 hover:bg-white/20 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <Send size={10} /> Send
                </button>
                <button
                  className="w-8 flex items-center justify-center py-1.5 rounded-xl hover:bg-white/20 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <XCircle size={10} className="text-white/70" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption strip */}
      <div className="px-2.5 py-2" style={{ backgroundColor: '#fafaf9' }}>
        <p className="text-[11px] font-semibold text-neutral-700 truncate">{job.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-neutral-500 truncate">{job.modelName}</span>
          <span className="text-[9px] text-neutral-300">·</span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: PROVIDER_CFG[job.provider].badgeBg, color: PROVIDER_CFG[job.provider].badgeText }}
          >
            {job.provider}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryFeaturePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const jobs = SEED_HISTORY; // swap for useQuery(api.contentGen.getHistory)

  const filtered = useMemo(() => {
    return jobs
      .filter(j => activeFilter === 'all' || j.outcome === activeFilter || (activeFilter === 'Pending Review' && !j.outcome));
  }, [jobs, activeFilter]);

  const needsReview = jobs.filter(j => !j.outcome || j.outcome === 'Pending Review').length;

  return (
    <div className="p-5">
      <div className="flex items-center gap-1 mb-4">
        {OUTCOME_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
              activeFilter === f.id
                ? 'text-neutral-900 bg-black/[0.07]'
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Play size={28} className="text-neutral-200" />
            <p className="text-sm font-medium text-neutral-300 select-none">No clips here yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(job => <GalleryCard key={job._id} job={job} />)}
            </AnimatePresence>
          </div>
        )}
      </div>
  );
}
