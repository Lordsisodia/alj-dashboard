'use client';

import { Play, Film, Waves, ArrowRight, Loader2, ImageOff, ImagePlus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/components/ui/status-strip';
import type { Doc } from '@/convex/_generated/dataModel';
import type { SceneProvider } from './types';
import { PROVIDER_COLORS } from './types';

// ── Provider icons ────────────────────────────────────────────────────────────

const PROVIDER_ICON: Record<SceneProvider, React.ReactNode> = {
  FLUX:       <Zap  size={9} />,
  Kling:      <Film size={9} />,
  Higgsfield: <Waves size={9} />,
};

// ── Blocked reason derivation ─────────────────────────────────────────────────

function getBlockedReason(scene: Doc<'scenes'>): { label: string; color: string; bg: string } {
  if (scene.status === 'Done')
    return { label: 'Done',              color: '#047857', bg: '#d1fae5' };
  if (scene.status === 'Generating')
    return { label: 'Live',              color: '#1d4ed8', bg: '#dbeafe' };
  if (scene.status === 'Queued')
    return { label: 'Queued',            color: '#b45309', bg: '#fef3c7' };
  if (scene.startingImageStatus === 'failed')
    return { label: 'Image failed',      color: '#dc2626', bg: '#fee2e2' };
  if (scene.startingImageStatus === 'generating')
    return { label: 'Generating image',  color: '#2563eb', bg: '#dbeafe' };
  if (scene.startingImageStatus === 'missing')
    return { label: 'Needs image',       color: '#7c3aed', bg: '#ede9fe' };
  if (scene.approvalState !== 'approved')
    return { label: 'Needs approval',    color: '#b45309', bg: '#fef9c3' };
  return   { label: 'Ready to queue',   color: '#047857', bg: '#d1fae5' };
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  scene:        Doc<'scenes'>;
  onOpenDrawer: (scene: Doc<'scenes'>) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SceneCard({ scene, onOpenDrawer }: Props) {
  const providerStyle = PROVIDER_COLORS[scene.provider as SceneProvider];
  const isActive      = scene.status === 'Generating';
  const reason        = getBlockedReason(scene);

  return (
    <div
      className={cn(
        'group flex gap-3 p-3 rounded-2xl transition-all cursor-pointer',
        'hover:shadow-md',
      )}
      style={{
        backgroundColor: isActive ? '#f0f7ff' : '#ffffff',
        border:          isActive ? '1px solid #bfdbfe' : '1px solid rgba(0,0,0,0.07)',
        boxShadow:       isActive ? '0 0 0 3px rgba(59,130,246,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onClick={() => onOpenDrawer(scene)}
    >
      {/* Reference thumbnail (9:16) */}
      <div
        className="w-10 flex-shrink-0 rounded-xl overflow-hidden"
        style={{ aspectRatio: '9/16' }}
      >
        {scene.referenceThumbnailUrl ? (
          <img
            src={scene.referenceThumbnailUrl}
            alt="Reference"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#f3f4f6' }}>
            <Play size={10} className="text-neutral-400" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Arrow + starting image slot */}
      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
        <ArrowRight size={12} className="text-neutral-300" />

        <div
          className="w-10 flex-shrink-0 rounded-xl overflow-hidden"
          style={{ aspectRatio: '9/16' }}
        >
          {scene.startingImageStatus === 'ready' && scene.startingImageUrl ? (
            <img
              src={scene.startingImageUrl}
              alt="Starting image"
              className="w-full h-full object-cover"
            />
          ) : scene.startingImageStatus === 'generating' ? (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <Loader2 size={10} className="text-blue-400 animate-spin" />
            </div>
          ) : scene.startingImageStatus === 'failed' ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <ImageOff size={10} className="text-red-400" />
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center group-hover:border-neutral-300 transition-colors"
              style={{
                border:       '1.5px dashed rgba(0,0,0,0.15)',
                borderRadius: '0.75rem',
                background:   '#fafafa',
              }}
            >
              <ImagePlus size={10} className="text-neutral-300" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">

        {/* Description + priority score pill */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-neutral-800 leading-snug line-clamp-2 flex-1">
            {scene.sceneDescription}
          </p>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5 tabular-nums"
            style={{
              background: scene.priorityScore >= 80 ? '#d1fae5' : scene.priorityScore >= 60 ? '#fef3c7' : '#f3f4f6',
              color:      scene.priorityScore >= 80 ? '#047857' : scene.priorityScore >= 60 ? '#b45309' : '#9ca3af',
            }}
          >
            {scene.priorityScore}
          </span>
        </div>

        {/* Chips row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Blocked reason */}
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: reason.bg, color: reason.color }}
          >
            {reason.label}
          </span>

          {/* Model */}
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white bg-neutral-500">
            {scene.modelName}
          </span>

          {/* Provider */}
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: providerStyle?.bg   ?? '#f3f4f6',
              color:           providerStyle?.text  ?? '#6b7280',
            }}
          >
            {PROVIDER_ICON[scene.provider as SceneProvider]}
            {scene.provider}
          </span>

          {/* Relative timestamp */}
          <span className="text-[10px] text-neutral-300 ml-auto tabular-nums">
            {timeAgo(scene.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
