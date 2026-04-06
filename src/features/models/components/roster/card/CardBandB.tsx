'use client';

import { Users, Film, GitBranch, Clock } from 'lucide-react';
import type { ModelData } from '../../../types';
import type { CardHealthState } from '../health/cardHealthState';

interface Props {
  model: ModelData;
  health: CardHealthState;
}

function formatSubs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function CardBandB({ model, health }: Props) {
  const { isDaysSinceContent, isNoBrief, isOnboarding, isContentStale } = health;

  const lastContentLabel =
    isDaysSinceContent === null ? '-' :
    isDaysSinceContent === 0 ? 'today' :
    `${isDaysSinceContent}d ago`;

  return (
    <div className="grid grid-cols-4 gap-0 px-4 pb-3 border-t border-black/[0.05] pt-3">
      {/* Col 1: Subscribers */}
      <div className="flex flex-col items-start gap-0.5">
        <Users size={12} className="text-neutral-400" />
        <span className="text-sm font-semibold text-neutral-800">
          {formatSubs(model.subscribers ?? 0)}
        </span>
        <span className="text-[10px] text-neutral-400">subscribers</span>
      </div>

      {/* Col 2: Reels in pipeline */}
      <div className="flex flex-col items-start gap-0.5">
        <Film size={12} className="text-neutral-400" />
        <span
          className="text-sm font-semibold"
          style={{ color: isNoBrief ? '#f59e0b' : '#262626' }}
        >
          {model.reelsInPipeline}
        </span>
        <span className="text-[10px] text-neutral-400">
          {isNoBrief ? 'needs brief' : 'in pipeline'}
        </span>
      </div>

      {/* Col 3: Pipeline step or content batch */}
      <div className="flex flex-col items-start gap-0.5">
        <GitBranch size={12} className="text-neutral-400" />
        {isOnboarding ? (
          <span className="text-sm font-semibold text-neutral-800">
            {model.contentReceived}/100
          </span>
        ) : (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${model.color}18`, color: model.color }}
          >
            {model.pipelineStep}
          </span>
        )}
        <span className="text-[10px] text-neutral-400">
          {isOnboarding ? 'content batch' : 'pipeline'}
        </span>
      </div>

      {/* Col 4: Last content */}
      <div className="flex flex-col items-start gap-0.5 group">
        <Clock size={12} className="text-neutral-400" />
        <span
          className="text-sm font-semibold"
          style={{ color: isContentStale ? '#f59e0b' : '#262626' }}
          title={isContentStale && isDaysSinceContent !== null ? `No new content in ${isDaysSinceContent} days` : undefined}
        >
          {lastContentLabel}
        </span>
        <span className="text-[10px] text-neutral-400">last content</span>
      </div>
    </div>
  );
}
