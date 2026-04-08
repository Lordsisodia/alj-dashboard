'use client';

import { Play, Zap, Film, Waves, ArrowRight, Loader2, ImageOff, RefreshCw, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Doc } from '@/convex/_generated/dataModel';
import type { SceneProvider, SceneStatus } from './types';
import { PROVIDER_COLORS, STATUS_COLORS } from './types';

const PROVIDER_ICON: Record<SceneProvider, React.ReactNode> = {
  FLUX:       <Zap size={9} />,
  Kling:      <Film size={9} />,
  Higgsfield: <Waves size={9} />,
};

// Stable color derived from scene _id — used when no referenceThumbnailUrl present
const ID_COLORS = [
  '#fed7aa', '#99f6e4', '#bfdbfe', '#fde68a',
  '#f5d0fe', '#a7f3d0', '#fecaca', '#e0e7ff',
];
function idColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ID_COLORS[hash % ID_COLORS.length];
}

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
  scene: Doc<'scenes'>;
  rank: number;
}

export function SceneCard({ scene, rank }: Props) {
  const providerStyle = PROVIDER_COLORS[scene.provider as SceneProvider];
  const statusStyle   = STATUS_COLORS[scene.status as SceneStatus] ?? { bg: '#f3f4f6', text: '#6b7280' };
  const isActive      = scene.status === 'Generating';
  const thumbBg       = idColor(scene._id);

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

      {/* Reference video thumbnail (9:16 mini) */}
      <div
        className="w-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center relative"
        style={{ aspectRatio: '9/16' }}
      >
        {scene.referenceThumbnailUrl ? (
          <img
            src={scene.referenceThumbnailUrl}
            alt="Reference"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(160deg, ${thumbBg}80, ${thumbBg}30)` }}
          >
            <Play size={10} className="text-white/70" fill="white" />
          </div>
        )}
      </div>

      {/* Arrow + Starting image slot */}
      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
        <ArrowRight size={12} className="text-neutral-300" />

        {/* Starting image slot */}
        <div
          className="w-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center relative"
          style={{ aspectRatio: '9/16' }}
        >
          {scene.startingImageStatus === 'ready' && scene.startingImageUrl ? (
            <img
              src={scene.startingImageUrl}
              alt="Starting image"
              className="w-full h-full object-cover"
            />
          ) : scene.startingImageStatus === 'generating' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 bg-blue-50">
              <Loader2 size={10} className="text-blue-400 animate-spin" />
              <span className="text-[7px] text-blue-400 font-medium leading-none">Gen...</span>
            </div>
          ) : scene.startingImageStatus === 'failed' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 bg-red-50">
              <ImageOff size={10} className="text-red-400" />
              <button
                className="text-[7px] text-red-400 font-medium leading-none hover:text-red-600 flex items-center gap-0.5"
                onClick={() => { /* TODO: Phase 2 Replicate wiring */ }}
              >
                <RefreshCw size={6} />
                Retry
              </button>
            </div>
          ) : (
            /* missing */
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-0.5"
              style={{ border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: '0.75rem', background: '#fafafa' }}
            >
              <ImagePlus size={10} className="text-neutral-300" />
              <button
                className="text-[7px] text-neutral-400 font-medium leading-none hover:text-neutral-600"
                onClick={() => { /* TODO: Phase 2 Replicate wiring */ }}
              >
                Generate
              </button>
            </div>
          )}
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
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white bg-neutral-500">
            {scene.modelName}
          </span>

          {/* Provider badge */}
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: providerStyle?.bg ?? '#f3f4f6', color: providerStyle?.text ?? '#6b7280' }}
          >
            {PROVIDER_ICON[scene.provider as SceneProvider]}
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
