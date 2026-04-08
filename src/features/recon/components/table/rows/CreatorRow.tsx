'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, computeProfileHealth } from '../../../constants';
import type { Competitor } from '../../../types';
import { COL_BORDER } from '../tableUtils';
import type { ColVisibility } from '../tableUtils';
import { AvatarCell } from './CreatorRowAvatarCell';
import { HealthCell } from './CreatorRowHealthCell';
import { ActionsCell } from './CreatorRowActionsCell';
import {
  NicheCell, FollowersCell, FollowingCell, PostsCell, EngRateCell,
  ScoreCell, PostsThisWeekCell, CategoryCell, LinkInBioCell, EmailCell,
  VerifiedCell, PrivateCell, EnrichStatusCell, SourceCell,
  IgTvVideoCountCell, HighlightReelsCell,
} from './CreatorRowCells';

interface CreatorRowProps {
  creator: Competitor & {
    _totalPosts?: number;
    _enrichStatus?: string | null;
    postsThisWeek?: number;
    aiScore?: number;
    aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
    aiReason?: string;
    highlightReelCount?: number;
    source?: 'pre_approved' | 'scraper' | 'manual';
  };
  rowIdx: number;
  isSelected: boolean;
  anySelected: boolean;
  isEnriching: boolean;
  colVis: ColVisibility;
  gridCols: string;
  onOpen: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onToggleStatus: (e: React.MouseEvent) => void;
  onEnrich: (e: React.MouseEvent) => void;
}

export function CreatorRow({ creator: c, rowIdx, isSelected, anySelected, isEnriching, colVis, gridCols, onOpen, onSelect, onFavorite, onToggleStatus, onEnrich }: CreatorRowProps) {
  const isActive = c.status === 'active';
  const health   = computeProfileHealth(c);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => { setImgErr(false); }, [c.profilePicUrl]);

  const healthColor =
    health >= 70 ? '#16a34a' :
    health >= 35 ? '#d97706' : '#dc2626';

  return (
    <motion.div
      variants={fadeUp}
      onClick={onOpen}
      className={cn('grid items-stretch border-b transition-colors group cursor-pointer relative', isSelected ? 'bg-violet-50/50' : 'hover:bg-[#f9f8ff]')}
      style={{ gridTemplateColumns: gridCols, minHeight: 52, borderBottom: '1px solid rgba(0,0,0,0.05)' }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ backgroundColor: c.nicheColor }} />

      {/* Checkbox */}
      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={onSelect}>
        <div className={cn(
          'w-3.5 h-3.5 rounded flex items-center justify-center border transition-all',
          isSelected
            ? 'bg-violet-500 border-violet-500 opacity-100'
            : anySelected
              ? 'border-neutral-300 bg-white opacity-100'
              : 'border-neutral-300 bg-white opacity-0 group-hover:opacity-100',
        )}>
          {isSelected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>

      {/* Row # */}
      <div className="flex items-center justify-center text-[11px] text-neutral-300 group-hover:text-neutral-400 tabular-nums transition-colors" style={{ borderRight: COL_BORDER }}>{rowIdx + 1}</div>

      {/* Creator */}
      <AvatarCell c={c} isActive={isActive} imgErr={imgErr} setImgErr={setImgErr} />

      {/* Health */}
      {colVis.health && <HealthCell c={c} health={health} healthColor={healthColor} />}

      {/* Meta cells */}
      {colVis.niche          && <NicheCell c={c} />}
      {colVis.followers      && <FollowersCell c={c} />}
      {colVis.following      && <FollowingCell c={c} />}
      {colVis.posts          && <PostsCell c={c} />}
      {colVis.engRate        && <EngRateCell c={c} />}
      {colVis.score          && <ScoreCell c={c} />}
      {colVis.postsThisWeek  && <PostsThisWeekCell c={c} />}
      {colVis.category       && <CategoryCell c={c} />}
      {colVis.linkInBio      && <LinkInBioCell c={c} />}
      {colVis.email          && <EmailCell c={c} />}
      {colVis.verified       && <VerifiedCell c={c} />}
      {colVis.private        && <PrivateCell c={c} />}
      {colVis.enrichStatus   && <EnrichStatusCell c={c} />}
      {colVis.source         && <SourceCell c={c} />}
      {colVis.igtvVideoCount && <IgTvVideoCountCell c={c} />}
      {colVis.highlightReels && <HighlightReelsCell c={c} />}

      {/* Favorites */}
      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={onFavorite}>
        <Heart size={14} className="transition-colors cursor-pointer" style={{ color: c.favorited ? '#ff0069' : '#d1d5db' }} fill={c.favorited ? '#ff0069' : 'none'} />
      </div>

      {/* Actions */}
      <ActionsCell c={c} isActive={isActive} isEnriching={isEnriching} onToggleStatus={onToggleStatus} onEnrich={onEnrich} />
    </motion.div>
  );
}
