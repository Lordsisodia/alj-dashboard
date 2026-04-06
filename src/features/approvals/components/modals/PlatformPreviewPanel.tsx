'use client';

import { useState } from 'react';
import type { ApprovalItem } from '../../types';

const PLATFORMS = [
  { id: 'of',     label: 'OF',     captionLimit: 1000, aspectRatio: '4/5',  frameWidth: 180 },
  { id: 'tiktok', label: 'TikTok', captionLimit: 150,  aspectRatio: '9/16', frameWidth: 130 },
  { id: 'ig',     label: 'IG',     captionLimit: 125,  aspectRatio: '1/1',  frameWidth: 180 },
] as const;

type PlatformId = typeof PLATFORMS[number]['id'];

interface PlatformPreviewPanelProps {
  item: ApprovalItem;
}

export function PlatformPreviewPanel({ item }: PlatformPreviewPanelProps) {
  const [platform, setPlatform] = useState<PlatformId>('of');

  const p = PLATFORMS.find(x => x.id === platform)!;
  const isTruncated = item.caption.length > p.captionLimit;
  const displayCaption = isTruncated
    ? item.caption.slice(0, p.captionLimit) + '...'
    : item.caption;

  return (
    <div className="space-y-3">
      {/* Platform switcher */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ backgroundColor: '#f5f5f5', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {PLATFORMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPlatform(id)}
            className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={platform === id ? {
              backgroundColor: '#fff',
              color: '#171717',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            } : {
              color: '#737373',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center py-1">
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            width: p.frameWidth,
            aspectRatio: p.aspectRatio,
            background: item.thumbnailGradient,
            border: '3px solid rgba(0,0,0,0.12)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          />
          {item.thumbnailIcon}
          {/* Platform badge */}
          <div
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}
          >
            {p.label}
          </div>
        </div>
      </div>

      {/* Caption preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Caption preview
          </span>
          <div className="flex items-center gap-1.5">
            {isTruncated && (
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{ backgroundColor: 'rgba(234,88,12,0.1)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.2)' }}
              >
                Truncated
              </span>
            )}
            <span className="text-[10px] text-neutral-400">
              {Math.min(item.caption.length, p.captionLimit)}/{p.captionLimit}
            </span>
          </div>
        </div>
        <p
          className="text-xs text-neutral-600 leading-relaxed p-3 rounded-lg"
          style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          {displayCaption}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
          <span>{item.hashtags.length} hashtags</span>
          <span className="text-neutral-300">·</span>
          <span>{item.caption.length} chars total</span>
        </div>
      </div>
    </div>
  );
}
