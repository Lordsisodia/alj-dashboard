'use client';

import { CheckCircle2 } from 'lucide-react';
import type { Doc } from '@/convex/_generated/dataModel';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function OutlierColor(ratio: number): string {
  if (ratio >= 2) return '#059669';
  if (ratio >= 1) return '#b45309';
  return '#9ca3af';
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  scene: Doc<'scenes'>;
}

export function ImportedReferenceCard({ scene }: Props) {
  const hasData = !!(scene.sourceHandle || scene.sourceViews || scene.sourceHookLine);

  // No source data — manual scene or pre-migration
  if (!hasData) {
    return (
      <div
        className="rounded-xl px-3 py-2.5 flex items-center justify-center"
        style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', minHeight: 64 }}
      >
        <span className="text-[11px] text-neutral-300">No analysis data</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', background: '#fff' }}
    >
      {/* Row 1 — source handle + niche + verified */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        {scene.sourceHandle && (
          <span className="text-[11px] font-semibold text-neutral-700 truncate flex items-center gap-1">
            @{scene.sourceHandle}
            {scene.sourceVerified && (
              <CheckCircle2 size={10} className="text-blue-400 flex-shrink-0" />
            )}
          </span>
        )}
        {scene.sourceNiche && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md ml-auto flex-shrink-0"
            style={{ background: '#f3f4f6', color: '#6b7280' }}
          >
            {scene.sourceNiche}
          </span>
        )}
      </div>

      {/* Row 2 — metric triad: outlier · views · ER */}
      {(scene.sourceOutlierRatio != null || scene.sourceViews != null || scene.sourceEngagementRate != null) && (
        <div
          className="grid grid-cols-3 divide-x px-0 py-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          {scene.sourceOutlierRatio != null && (
            <div className="flex flex-col items-center py-2">
              <span
                className="text-[13px] font-black tabular-nums"
                style={{ color: OutlierColor(scene.sourceOutlierRatio) }}
              >
                {scene.sourceOutlierRatio.toFixed(1)}x
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">outlier</span>
            </div>
          )}
          {scene.sourceViews != null && (
            <div className="flex flex-col items-center py-2">
              <span className="text-[13px] font-black text-neutral-800 tabular-nums">
                {formatViews(scene.sourceViews)}
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">views</span>
            </div>
          )}
          {scene.sourceEngagementRate != null && (
            <div className="flex flex-col items-center py-2">
              <span className="text-[13px] font-black text-neutral-800 tabular-nums">
                {(scene.sourceEngagementRate * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide">ER</span>
            </div>
          )}
        </div>
      )}

      {/* Row 3 — hook line */}
      {scene.sourceHookLine && (
        <div
          className="px-3 py-2"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <p className="text-[11px] text-neutral-600 italic leading-snug line-clamp-2">
            "{scene.sourceHookLine}"
          </p>
        </div>
      )}

      {/* Row 4 — emotion chips */}
      {scene.sourceEmotions && scene.sourceEmotions.length > 0 && (
        <div
          className="flex items-center gap-1.5 px-3 py-2 flex-wrap"
          style={{ borderBottom: scene.sourceCaption ? '1px solid rgba(0,0,0,0.05)' : undefined }}
        >
          {scene.sourceEmotions.map(e => (
            <span
              key={e}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: '#f0fdf4', color: '#16a34a' }}
            >
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Row 5 — caption (collapsed, small) */}
      {scene.sourceCaption && (
        <div className="px-3 py-2">
          <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-2">
            {scene.sourceCaption}
          </p>
        </div>
      )}
    </div>
  );
}
