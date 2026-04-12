'use client';

import { useState } from 'react';
import { Eye, MoreHorizontal, Bookmark, Zap } from 'lucide-react';
import { NICHE_COLORS } from '@/features/intelligence/constants';
import { fmtNum, igThumb } from '@/features/intelligence/utils';

interface PipelineState {
  count: number;
  latestStatus?: string;
  latestApproval?: string;
  assignedModelNames?: string[];
}

interface SavedCardProps {
  post: any;
  onSendToPipeline: () => void;
  onUnsave: () => void;
  onOpenDrawer: () => void;
}

export function SavedCard({ post, onSendToPipeline, onUnsave, onOpenDrawer }: SavedCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pipeline: PipelineState = post.pipeline ?? { count: 0 };
  const isDone = pipeline.latestStatus === 'Done';
  const isInPipeline = pipeline.count > 0 && !isDone;
  const nicheColor = NICHE_COLORS[post.niche] ?? '#2563eb';
  const hookScore = post.aiAnalysis?.hookScore;
  const thumbnailUrl = post.thumbnailUrl ? igThumb(post.thumbnailUrl) : undefined;
  const isGradient = !post.thumbnailUrl || !post.thumbnailUrl.startsWith('http');

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
    >
      {/* ── Thumbnail (4:5) ── */}
      <div className="relative" style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
        {isGradient ? (
          <div className="w-full h-full" style={{ background: post.thumbnailUrl ?? 'linear-gradient(135deg, #2563eb20, #7c3aed20)' }} />
        ) : (
          <img
            src={thumbnailUrl}
            alt={post.handle}
            className="w-full h-full object-cover"
          />
        )}

        {/* Top-left: niche badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
          style={{ backgroundColor: nicheColor, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          {post.niche}
        </div>

        {/* Top-right: view count */}
        {(post.views ?? 0) > 0 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <Eye size={9} />
            {fmtNum(post.views)}
          </div>
        )}

        {/* Bottom overlay: handle + hook score */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 pt-6 pb-2.5 flex items-end justify-between"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        >
          <span className="text-white text-[11px] font-semibold truncate max-w-[70%]">{post.handle}</span>
          {hookScore != null && (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: hookScore >= 7 ? '#16a34a' : hookScore >= 4 ? '#d97706' : '#dc2626' }}
            >
              <Zap size={8} />
              {hookScore.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* ── Below thumbnail ── */}
      <div className="p-3 flex flex-col gap-2">
        {/* Pipeline state badge */}
        <PipelineBadge pipeline={pipeline} />

        {/* Primary CTA */}
        {isDone ? (
          <button
            onClick={onOpenDrawer}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            View Scene →
          </button>
        ) : (
          <button
            onClick={onSendToPipeline}
            className="w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            Send to Pipeline →
          </button>
        )}

        {/* Overflow menu */}
        <div className="relative flex justify-end">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
          >
            <MoreHorizontal size={14} className="text-neutral-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 bottom-full mb-1 z-20 rounded-xl py-1 min-w-[140px]"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                <button
                  onClick={() => { onOpenDrawer(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  View analysis
                </button>
                <button
                  onClick={() => { onUnsave(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[11px] font-medium transition-colors"
                  style={{ color: '#dc2626' }}
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark size={11} />
                    Unsave
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pipeline state badge ──────────────────────────────────────────────────────

function PipelineBadge({ pipeline }: { pipeline: PipelineState }) {
  if (pipeline.count === 0) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#a3a3a3' }} />
        <span className="text-[11px] text-neutral-400 font-medium">Unassigned</span>
      </div>
    );
  }

  if (pipeline.latestStatus === 'Done') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#10b981' }} />
        <span className="text-[11px] font-medium" style={{ color: '#059669' }}>Done</span>
      </div>
    );
  }

  const modelLabel = pipeline.assignedModelNames?.length
    ? pipeline.assignedModelNames.join(', ')
    : null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#2563eb' }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: '#2563eb' }} />
      </span>
      <span className="text-[11px] font-medium" style={{ color: '#1d4ed8' }}>In Pipeline</span>
      {modelLabel && (
        <span className="text-[10px] text-neutral-400 truncate">· {modelLabel}</span>
      )}
    </div>
  );
}
