'use client';

import { motion } from 'framer-motion';
import { Sparkles, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InsightsData } from '../../types';
type HookStat = { handle: string; niche: string; hookLine: string; hookScore: number };

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

interface Props {
  hookStats: { hookLines: HookStat[] } | undefined;
  postIdMap: Map<string, string>;
  highlightedPostId: string | null;
  onHighlight: (id: string | null) => void;
}

export function WinningHooksSection({ hookStats, postIdMap, highlightedPostId, onHighlight }: Props) {
  const hookCount = hookStats?.hookLines?.length ?? 0;

  return (
    <div className="col-span-3 flex flex-col gap-2">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
            <Sparkles size={11} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-900">Winning Hooks</p>
            <p className="text-[9px] text-neutral-400">Top hooks by score</p>
          </div>
        </div>
        {hookCount > 0 && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white" style={{ background: GRAD }}>
            {hookCount}
          </span>
        )}
      </div>

      {/* Hook rows */}
      {hookStats === undefined ? (
        <div
          className="flex flex-col rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 py-3 px-3 border-b border-black/5 last:border-0">
              <div className="h-3 rounded-md animate-pulse" style={{ width: '80%', backgroundColor: 'rgba(0,0,0,0.06)' }} />
              <div className="h-2.5 rounded-md animate-pulse mt-0.5" style={{ width: '33%', backgroundColor: 'rgba(0,0,0,0.05)' }} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
        >
          {hookCount === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <ImageOff size={14} className="text-neutral-300" />
              </div>
              <p className="text-[11px] text-neutral-400">No hook data yet</p>
              <p className="text-[10px] text-neutral-300 text-center px-4">Run analysis on posts to surface winning hooks</p>
            </div>
          )}
          {(hookStats?.hookLines ?? []).map((hook, i) => {
            const mappedId = postIdMap.get(`${hook.handle}|${hook.niche}`);
            const isHighlighted = highlightedPostId === mappedId;
            return (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col gap-1 py-2.5 px-3 border-b border-black/5 cursor-pointer transition-all last:border-0",
                  isHighlighted
                    ? "bg-[#ff006908]"
                    : "hover:bg-black/[0.02] hover:translate-x-0.5"
                )}
                onMouseEnter={() => mappedId && onHighlight(mappedId)}
                onMouseLeave={() => onHighlight(null)}
              >
                {isHighlighted && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                    style={{ background: GRAD }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
                <p className="text-[11px] font-medium text-neutral-800 leading-relaxed line-clamp-2 pr-3">
                  &ldquo;{hook.hookLine}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400">@{hook.handle}</span>
                  <span className="text-[10px] font-bold" style={{ color: '#ff0069' }}>
                    {hook.hookScore.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}