'use client';

import { cn } from '@/lib/utils';
import { fmtNum } from '../../utils';

export type QualifyPost = {
  _id: string;
  externalId: string;
  handle: string;
  platform: string;
  contentType: string;
  niche: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  reach: number;
  engagementRate: number;
  postedAt: number;
  scrapedAt: number;
  outlierRatio?: number;
  baselineScore: number;
  savedForPipeline?: boolean;
  saved?: boolean;
};

const COL = '40px 200px 90px 80px 76px 80px 90px';
const DIV = { borderRight: '1px solid rgba(0,0,0,0.06)' } as const;

const AVATAR_COLORS = ['#f43f5e','#8b5cf6','#3b82f6','#10b981','#f59e0b','#ec4899','#6366f1','#14b8a6'];

function handleInitials(handle: string): string {
  const clean = handle.replace(/^@/, '');
  const words = clean.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)/g) ?? [clean];
  return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
}

function handleColor(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function baselineColor(score: number): string {
  if (score < 1)  return 'text-neutral-400';
  if (score < 5)  return 'text-blue-400';
  if (score < 10) return 'text-emerald-400';
  if (score < 20) return 'text-yellow-400';
  if (score < 50) return 'text-orange-400';
  return 'text-pink-500';
}

export function QualifyTableRow({ post, rowIdx }: { post: QualifyPost; rowIdx: number }) {
  const isPink = post.baselineScore >= 50;

  return (
    <div
      className="grid items-stretch cursor-default transition-colors hover:bg-black/[0.04] relative group"
      style={{
        gridTemplateColumns: COL,
        height: 48,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: isPink ? 'rgba(255,0,105,0.03)' : '#fff',
      }}
    >
      {/* Left border accent on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(to bottom, #a855f7, #ec4899)' }}
      />
      {/* # */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-400 tabular-nums">{rowIdx + 1}</span>
      </div>

      {/* Creator */}
      <div className="flex items-center gap-2 min-w-0 px-3 h-full" title={post.caption} style={DIV}>
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: handleColor(post.handle) }}
        >
          {handleInitials(post.handle)}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-neutral-800 truncate">{post.handle}</p>
        </div>
      </div>

      {/* Posted */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-500 tabular-nums">{timeAgo(post.postedAt)}</span>
      </div>

      {/* Views */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.views)}</span>
      </div>

      {/* Likes */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.likes)}</span>
      </div>

      {/* Comments */}
      <div className="flex items-center justify-center h-full" style={DIV}>
        <span className="text-[11px] text-neutral-600 tabular-nums">{fmtNum(post.comments)}</span>
      </div>

      {/* Baseline Score */}
      <div className="flex items-center justify-center h-full">
        <span className={cn('text-[12px] font-bold', baselineColor(post.baselineScore))}>
          {post.baselineScore.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}
