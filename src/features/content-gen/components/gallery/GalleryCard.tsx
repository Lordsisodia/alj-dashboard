'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, XCircle, Send, Clock } from 'lucide-react';
import { useMutation } from 'convex/react';
import { PROVIDER_CFG, MODEL_HUE } from '../queue/types';
import type { Outcome } from '../queue/types';
import type { Doc } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';

export function OutcomeOverlay({ outcome }: { outcome?: Outcome }) {
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

export function GalleryCard({ job }: { job: Doc<'contentGenJobs'> }) {
  const [hovered, setHovered] = useState(false);
  const updateOutcome = useMutation(api.contentGen.updateOutcome);
  const color  = MODEL_HUE[job.modelName] ?? '#a78bfa';
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
      <div
        className="w-full flex items-center justify-center relative"
        style={{
          aspectRatio: '9/16',
          background: `linear-gradient(160deg, ${thumb}cc 0%, ${thumb}55 100%)`,
        }}
      >
        {job.generatedVideoR2Url ? (
          <video
            src={job.generatedVideoR2Url}
            className="absolute inset-0 w-full h-full object-cover"
            poster={thumb}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center">
            <Play size={14} className="text-white ml-0.5" fill="white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: bar }} />
        <OutcomeOverlay outcome={job.outcome} />
        {needsReview && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-800" style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={9} /> Review
          </div>
        )}
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
                onClick={() => updateOutcome({ jobId: job._id, outcome: 'Approved' })}
              >
                <CheckCircle2 size={10} /> Approve
              </button>
              <button
                onClick={() => {
                  if (job.generatedVideoR2Url) {
                    // Open in new tab to download
                    window.open(job.generatedVideoR2Url, '_blank');
                  }
                }}
                disabled={!job.generatedVideoR2Url}
                title={job.generatedVideoR2Url ? "Download video" : "Waiting for generation"}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-semibold text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <Send size={10} /> Send
              </button>
              <button
                className="w-8 flex items-center justify-center py-1.5 rounded-xl hover:bg-white/20 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
                onClick={() => updateOutcome({ jobId: job._id, outcome: 'Rejected' })}
              >
                <XCircle size={10} className="text-white/70" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
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
