'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Pause, Play, Sparkles, Film, ChevronRight, BadgeCheck, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import { ScoreBadge }       from './ScoreBadge';
import { ProfileHealthBar } from './ProfileHealthBar';
import { Sparkline }        from './Sparkline';
import { COL_BORDER }       from './tableUtils';
import type { ColVisibility } from './tableUtils';
import { formatFollowers } from './tableUtils';

interface CreatorRowProps {
  creator: Competitor & { _totalPosts?: number };
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

  // Reset error state when a new avatar URL arrives (e.g. after enrichment)
  useEffect(() => { setImgErr(false); }, [c.profilePicUrl]);

  return (
    <motion.div
      variants={fadeUp}
      onClick={onOpen}
      className={cn('grid items-stretch border-b transition-colors group cursor-pointer relative', isSelected ? 'bg-blue-50/60' : 'hover:bg-[#f9faff]')}
      style={{ gridTemplateColumns: gridCols, minHeight: 48, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ backgroundColor: c.nicheColor }} />

      {/* Checkbox */}
      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={onSelect}>
        <div className={cn(
          'w-3.5 h-3.5 rounded flex items-center justify-center border transition-all',
          isSelected
            ? 'bg-blue-500 border-blue-500 opacity-100'
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
      <div className="flex items-center gap-3 px-3 min-w-0" style={{ borderRight: COL_BORDER }}>
        <div className="relative flex-shrink-0">
          {c.favorited && <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />}
          {c.profilePicUrl && !imgErr
            ? <Image src={c.profilePicUrl} alt={c.displayName} width={32} height={32} className="rounded-full object-cover relative z-10" onError={() => setImgErr(true)} />
            : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
          }
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-semibold text-neutral-900 truncate leading-tight">{c.displayName}</p>
            {c.verified && <BadgeCheck size={11} className="text-blue-500 flex-shrink-0" />}
            {c._totalPosts != null && c._totalPosts > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-500 flex-shrink-0 tabular-nums"><Film size={8} />{c._totalPosts}</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 truncate leading-tight mt-0.5">{c.handle}</p>
        </div>
      </div>

      {/* Profile Health */}
      {colVis.health && (
        <div className="flex items-center gap-2 px-3" style={{ borderRight: COL_BORDER }}>
          <ProfileHealthBar pct={health} />
          <button
            onClick={onEnrich}
            disabled={isEnriching}
            className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-all hover:bg-violet-50 disabled:opacity-40 flex-shrink-0', health < 75 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}
            style={{ borderColor: 'rgba(131,58,180,0.25)', color: '#833ab4' }}
            title="Enrich profile via Apify"
          >
            <Sparkles size={9} className={isEnriching ? 'animate-spin' : ''} />
            {isEnriching ? '...' : 'Enrich'}
          </button>
        </div>
      )}

      {/* Niche */}
      {colVis.niche && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}>{c.niche}</span>
        </div>
      )}

      {/* Followers */}
      {colVis.followers && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[13px] font-medium tabular-nums" style={{ color: c.followers ? '#111827' : '#d1d5db' }}>{c.followers || '--'}</span>
        </div>
      )}

      {/* Following */}
      {colVis.following && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[12px] font-medium tabular-nums text-neutral-500">
            {c.followsCount != null ? formatFollowers(c.followsCount) : <span className="text-neutral-200">-</span>}
          </span>
        </div>
      )}

      {/* Posts count */}
      {colVis.posts && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[12px] font-medium tabular-nums text-neutral-500">
            {c.postsCount != null ? c.postsCount : <span className="text-neutral-200">-</span>}
          </span>
        </div>
      )}

      {/* Eng. Rate */}
      {colVis.engRate && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[13px] font-medium tabular-nums" style={{ color: c.engagementRate ? '#111827' : '#d1d5db' }}>{c.engagementRate || '--'}</span>
        </div>
      )}

      {/* Score */}
      {colVis.score && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          <div className="flex flex-col gap-1">
            <ScoreBadge score={c.score} />
            <div className="w-10 h-0.5 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score >= 80 ? '#16a34a' : c.score >= 65 ? '#2563eb' : c.score >= 50 ? '#d97706' : '#dc2626' }} />
            </div>
          </div>
        </div>
      )}

      {/* Trend */}
      {colVis.trend && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          <Sparkline values={c.trend} color={c.nicheColor} />
        </div>
      )}

      {/* IG Category */}
      {colVis.category && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          {c.businessCategoryName
            ? <span className="text-[11px] text-neutral-500 truncate">{c.businessCategoryName}</span>
            : <span className="text-neutral-200 text-[11px]">-</span>
          }
        </div>
      )}

      {/* Link in Bio */}
      {colVis.linkInBio && (
        <div className="flex items-center justify-center px-2" style={{ borderRight: COL_BORDER }}>
          {c.externalUrl
            ? (
              <a href={c.externalUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-violet-50 transition-colors" title={c.externalUrl} style={{ color: '#833ab4' }}>
                <Link2 size={12} />
              </a>
            )
            : <span className="text-neutral-200 text-[11px]">-</span>
          }
        </div>
      )}

      {/* Email */}
      {colVis.email && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          {c.businessEmail
            ? <span className="text-[11px] text-neutral-500 truncate">{c.businessEmail}</span>
            : <span className="text-neutral-200 text-[11px]">-</span>
          }
        </div>
      )}

      {/* Favorites */}
      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={onFavorite}>
        <Heart size={14} className="transition-colors" style={{ color: c.favorited ? '#ff0069' : '#d1d5db' }} fill={c.favorited ? '#ff0069' : 'none'} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end px-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onToggleStatus} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
          {isActive ? <Pause size={11} /> : <Play size={11} />}
        </button>
        <a href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
          <ExternalLink size={11} />
        </a>
        <ChevronRight size={13} className="text-neutral-200 group-hover:text-neutral-400 transition-colors" />
      </div>
    </motion.div>
  );
}
