'use client';

import { Link2, Lock, CheckCircle } from 'lucide-react';
import { ScoreBadge } from '../../shared/ScoreBadge';
import { MetaCell, MetaCellLeft, MetaCellRight, EmptyCell } from './CreatorRowMetaCells';
import { COL_BORDER } from '../tableUtils';
import { formatFollowers } from '../tableUtils';
import { EnrichDot } from '../../shared/EnrichDot';
import type { Competitor } from '../../../types';

type ColVisibility = {
  niche: boolean; followers: boolean; following: boolean; posts: boolean;
  engRate: boolean; score: boolean; postsThisWeek: boolean; category: boolean;
  linkInBio: boolean; verified: boolean; private: boolean;
  enrichStatus: boolean; source: boolean; igtvVideoCount: boolean; highlightReels: boolean;
  health: boolean;
};

interface CellProps {
  c: Competitor & {
    _enrichStatus?: string | null;
    aiScore?: number;
    aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
    highlightReelCount?: number;
    source?: 'pre_approved' | 'scraper' | 'manual';
  };
}

export function NicheCell({ c }: CellProps) {
  return (
    <MetaCellLeft>
      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}>{c.niche}</span>
    </MetaCellLeft>
  );
}

export function FollowersCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: c.followers ? '#111827' : '#d1d5db' }}>{c.followers || '-'}</span>
    </MetaCellRight>
  );
}

export function FollowingCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[12px] tabular-nums text-neutral-500">
        {c.followsCount != null ? formatFollowers(c.followsCount) : <EmptyCell />}
      </span>
    </MetaCellRight>
  );
}

export function PostsCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[12px] tabular-nums text-neutral-500">
        {c.postsCount != null ? c.postsCount : <EmptyCell />}
      </span>
    </MetaCellRight>
  );
}

export function EngRateCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: c.engagementRate ? '#111827' : '#d1d5db' }}>{c.engagementRate || '-'}</span>
    </MetaCellRight>
  );
}

function scorePillColor(s: number): string {
  if (s >= 80) return '#16a34a';
  if (s >= 60) return '#84cc16';
  if (s >= 40) return '#eab308';
  if (s >= 20) return '#f97316';
  return '#dc2626';
}

interface ScoreCellProps {
  c: CellProps['c'] & { _creatorScore?: number };
}

export function ScoreCell({ c }: ScoreCellProps) {
  if (c._creatorScore != null) {
    return (
      <div className="flex items-center justify-center px-2" style={{ borderRight: COL_BORDER }}>
        <div
          className="inline-flex items-center justify-center min-w-[34px] px-2 h-[18px] rounded text-[10px] font-bold tabular-nums text-white"
          style={{ backgroundColor: scorePillColor(c._creatorScore) }}
        >
          {c._creatorScore}
        </div>
      </div>
    );
  }
  return (
    <MetaCellLeft>
      <ScoreBadge score={c.aiScore ?? c.score} aiVerdict={c.aiVerdict} />
    </MetaCellLeft>
  );
}

export function PostsThisWeekCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[12px] tabular-nums text-neutral-500">
        {c.postsThisWeek != null ? c.postsThisWeek : <EmptyCell />}
      </span>
    </MetaCellRight>
  );
}

export function CategoryCell({ c }: CellProps) {
  return (
    <MetaCellLeft>
      {c.businessCategoryName ? <span className="text-[11px] text-neutral-500 truncate">{c.businessCategoryName}</span> : <EmptyCell />}
    </MetaCellLeft>
  );
}

export function LinkInBioCell({ c }: CellProps) {
  return (
    <MetaCell>
      {c.externalUrl
        ? <a href={c.externalUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-red-50 transition-colors" title={c.externalUrl} style={{ color: '#dc2626' }}><Link2 size={12} /></a>
        : <EmptyCell />
      }
    </MetaCell>
  );
}

export function EmailCell({ c }: CellProps) {
  return (
    <MetaCellLeft>
      {c.businessEmail ? <span className="text-[11px] text-neutral-500 truncate">{c.businessEmail}</span> : <EmptyCell />}
    </MetaCellLeft>
  );
}

export function VerifiedCell({ c }: CellProps) {
  return (
    <MetaCell>
      {c.verified ? <CheckCircle size={13} className="text-blue-500" /> : <EmptyCell />}
    </MetaCell>
  );
}

export function PrivateCell({ c }: CellProps) {
  return (
    <MetaCell>
      {c.isPrivate ? <Lock size={12} className="text-amber-500" /> : <EmptyCell />}
    </MetaCell>
  );
}

export function EnrichStatusCell({ c }: CellProps) {
  return (
    <MetaCell><EnrichDot status={c._enrichStatus} /></MetaCell>
  );
}

export function SourceCell({ c }: CellProps) {
  return (
    <MetaCellLeft>
      {c.source
        ? <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
          c.source === 'pre_approved' ? 'bg-red-100 text-red-600' :
          c.source === 'scraper'    ? 'bg-blue-100 text-blue-600' :
                                       'bg-neutral-100 text-neutral-600'
        }`}>{c.source === 'pre_approved' ? 'Pre-approved' : c.source === 'scraper' ? 'Scraper' : 'Manual'}</span>
        : <EmptyCell />
      }
    </MetaCellLeft>
  );
}

export function IgTvVideoCountCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      {c.igtvVideoCount != null ? <span className="text-[12px] tabular-nums text-neutral-500">{c.igtvVideoCount}</span> : <EmptyCell />}
    </MetaCellRight>
  );
}

export function HighlightReelsCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      {c.highlightReelCount != null ? <span className="text-[12px] tabular-nums text-neutral-500">{c.highlightReelCount}</span> : <EmptyCell />}
    </MetaCellRight>
  );
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function AvgViewsCell({ c }: CellProps) {
  return (
    <MetaCellRight>
      <span className="text-[12px] tabular-nums text-neutral-600">
        {c.avgViews != null && c.avgViews > 0 ? fmtCompact(c.avgViews) : <EmptyCell />}
      </span>
    </MetaCellRight>
  );
}

function outlierColor(r: number): string {
  if (r >= 3)   return '#16a34a';
  if (r >= 2)   return '#84cc16';
  if (r >= 1)   return '#eab308';
  if (r >= 0.5) return '#f97316';
  return '#dc2626';
}

export function OutlierRatioCell({ c }: CellProps) {
  if (c.outlierRatio == null || c.outlierRatio <= 0) {
    return <MetaCell><EmptyCell /></MetaCell>;
  }
  return (
    <MetaCell>
      <div
        className="inline-flex items-center justify-center px-1.5 h-[18px] rounded text-[10px] font-semibold tabular-nums text-white"
        style={{ backgroundColor: outlierColor(c.outlierRatio) }}
      >
        {c.outlierRatio.toFixed(1)}&times;
      </div>
    </MetaCell>
  );
}

export function BioCell({ c }: CellProps) {
  if (!c.bio) return <MetaCellLeft><EmptyCell /></MetaCellLeft>;
  return (
    <MetaCellLeft>
      <span className="text-[11px] text-neutral-500 truncate block" title={c.bio}>
        {c.bio}
      </span>
    </MetaCellLeft>
  );
}
