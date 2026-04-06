'use client';

import { Play, Zap, Film, Waves, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene, SceneProvider } from './types';
import { PROVIDER_COLORS, STATUS_COLORS } from './types';

const PROVIDER_ICON: Record<SceneProvider, React.ReactNode> = {
  FLUX:       <Zap size={9} />,
  Kling:      <Film size={9} />,
  Higgsfield: <Waves size={9} />,
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#9ca3af';
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
      style={{ backgroundColor: `${color}18`, color, border: `1.5px solid ${color}40` }}
    >
      {score}
    </div>
  );
}

interface Props {
  scene: Scene;
  rank: number;
}

export function SceneCard({ scene, rank }: Props) {
  const providerStyle = PROVIDER_COLORS[scene.provider];
  const statusStyle   = STATUS_COLORS[scene.status];
  const isActive      = scene.status === 'Generating';

  return (
    <div
      className={cn(
        'group flex gap-3 p-3 rounded-2xl transition-all',
        isActive ? 'ring-1 ring-blue-200' : ''
      )}
      style={{
        backgroundColor: isActive ? '#f0f7ff' : '#ffffff',
        border: isActive ? '1px solid #bfdbfe' : '1px solid rgba(0,0,0,0.07)',
        boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Rank */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-5 pt-0.5">
        <span className="text-[10px] font-bold text-neutral-300">#{rank}</span>
        <div className="w-px flex-1 min-h-0" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
      </div>

      {/* Reference video thumb (9:16 mini) */}
      <div
        className="w-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center relative"
        style={{
          aspectRatio: '9/16',
          background: `linear-gradient(160deg, ${scene.referenceThumbColor}80, ${scene.referenceThumbColor}30)`,
        }}
      >
        <Play size={10} className="text-white/70" fill="white" />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: scene.modelColor, opacity: 0.7 }} />
      </div>

      {/* Arrow + Model ref image */}
      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
        <ArrowRight size={12} className="text-neutral-300" />
        <div
          className="w-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: '9/16',
            background: `linear-gradient(160deg, ${scene.referenceImageColor}80, ${scene.referenceImageColor}30)`,
          }}
        >
          <span className="text-[9px] font-black text-white/70">{scene.modelName.slice(0, 2).toUpperCase()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-neutral-800 leading-snug line-clamp-2 flex-1">
            {scene.sceneDescription}
          </p>
          <ScoreRing score={scene.priorityScore} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Model chip */}
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white"
            style={{ backgroundColor: scene.modelColor }}
          >
            {scene.modelName}
          </span>

          {/* Provider badge */}
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: providerStyle.bg, color: providerStyle.text }}
          >
            {PROVIDER_ICON[scene.provider]}
            {scene.provider}
          </span>

          {/* Status badge */}
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
              isActive ? 'animate-pulse' : ''
            )}
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {scene.status}
          </span>
        </div>
      </div>
    </div>
  );
}
