'use client';

import { Link2, Lock, CheckCircle } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';
import { MetaCell, MetaCellLeft, MetaCellRight, EmptyCell } from './CreatorRowMetaCells';
import { COL_BORDER } from './tableUtils';
import { formatFollowers } from './tableUtils';
import { EnrichDot } from './EnrichDot';
import type { Competitor } from '../../types';

type ColVisibility = {
  niche: boolean; followers: boolean; following: boolean; posts: boolean;
  engRate: boolean; score: boolean; postsThisWeek: boolean; category: boolean;
  linkInBio: boolean; email: boolean; verified: boolean; private: boolean;
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

export function ScoreCell({ c }: CellProps) {
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
