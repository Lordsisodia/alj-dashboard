'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, computeProfileHealth } from '../../../constants';
import type { Competitor } from '../../../types';
import { COL_BORDER } from '../tableUtils';
import type { ColVisibility } from '../tableUtils';
import { SelectCheckbox } from '../shared/SelectCheckbox';
import { AvatarCell } from './CreatorRowAvatarCell';
import { HealthCell } from './CreatorRowHealthCell';
import { ActionsCell } from './CreatorRowActionsCell';
import {
  NicheCell, FollowersCell, AvgViewsCell, FollowingCell, PostsCell, EngRateCell,
  ScoreCell, OutlierRatioCell, PostsThisWeekCell, CategoryCell, BioCell, LinkInBioCell,
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
    _creatorScore?: number;
  };
  rowIdx: number;
  isSelected: boolean;
  anySelected: boolean;
  isEnriching: boolean;
  isScraping: boolean;
  colVis: ColVisibility;
  gridCols: string;
  onOpen: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onToggleStatus: (e: React.MouseEvent) => void;
  onEnrich: (e: React.MouseEvent) => void;
  onScrape: () => void;
}

export function CreatorRow({ creator: c, rowIdx, isSelected, anySelected, isEnriching, isScraping, colVis, gridCols, onOpen, onSelect, onFavorite, onToggleStatus, onEnrich, onScrape }: CreatorRowProps) {
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
        <SelectCheckbox
          state={isSelected ? 'all' : 'none'}
          tint="violet"
          visible={anySelected || isSelected}
        />
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
      {colVis.avgViews       && <AvgViewsCell c={c} />}
      {colVis.following      && <FollowingCell c={c} />}
      {colVis.posts          && <PostsCell c={c} />}
      {colVis.engRate        && <EngRateCell c={c} />}
      {colVis.score          && <ScoreCell c={c} />}
      {colVis.outlierRatio   && <OutlierRatioCell c={c} />}
      {colVis.postsThisWeek  && <PostsThisWeekCell c={c} />}
      {colVis.category       && <CategoryCell c={c} />}
      {colVis.bio            && <BioCell c={c} />}
      {colVis.linkInBio      && <LinkInBioCell c={c} />}
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
      <ActionsCell c={c} isActive={isActive} isEnriching={isEnriching} isScraping={isScraping} onToggleStatus={onToggleStatus} onEnrich={onEnrich} onScrape={onScrape} />
    </motion.div>
  );
}
