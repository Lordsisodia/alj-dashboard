'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Pause, Play, Sparkles, Film, ChevronRight, BadgeCheck, Link2, Lock, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import { ScoreBadge } from './ScoreBadge';
import { COL_BORDER } from './tableUtils';
import type { ColVisibility } from './tableUtils';
import { formatFollowers } from './tableUtils';

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

function EnrichDot({ status }: { status: string | null | undefined }) {
  if (status === 'done')     return <CheckCircle size={12} className="text-green-500" />;
  if (status === 'enriching') return <Loader size={12} className="text-blue-400 animate-spin" />;
  if (status === 'error')    return <AlertCircle size={12} className="text-red-400" />;
  return null;
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
      <div className="flex items-center gap-2.5 px-3 min-w-0" style={{ borderRight: COL_BORDER }}>
        <div className="relative flex-shrink-0">
          {/* Status dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white z-20"
            style={{ backgroundColor: isActive ? '#16a34a' : '#d1d5db' }}
          />
          {c.favorited && (
            <div className="absolute inset-0 rounded-full z-10" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />
          )}
          {c.profilePicUrl && !imgErr
            ? <Image src={c.profilePicUrl} alt={c.displayName} width={34} height={34} className="rounded-full object-cover relative z-10" onError={() => setImgErr(true)} />
            : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
          }
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-semibold text-neutral-900 truncate leading-tight">{c.displayName}</p>
            {c.verified && <BadgeCheck size={11} className="text-blue-500 flex-shrink-0" />}
            {c._totalPosts != null && c._totalPosts > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-500 flex-shrink-0 tabular-nums">
                <Film size={8} />{c._totalPosts}
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 truncate leading-tight">{c.handle}</p>
        </div>
      </div>

      {/* Profile: health bar + score badge + enrich dot */}
      {colVis.health && (
        <div className="flex items-center gap-2.5 px-3" style={{ borderRight: COL_BORDER }}>
          {/* Health dot + bar */}
          <div className="flex flex-col gap-0.5 w-10 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: healthColor }}
              />
              <span className="text-[10px] font-semibold tabular-nums" style={{ color: healthColor }}>{health}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${health}%`, backgroundColor: healthColor }} />
            </div>
          </div>

          {/* Score badge */}
          <ScoreBadge score={c.aiScore ?? c.score} aiVerdict={c.aiVerdict} />

          {/* Enrich status dot */}
          <EnrichDot status={c._enrichStatus} />
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
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: c.followers ? '#111827' : '#d1d5db' }}>
            {c.followers || '-'}
          </span>
        </div>
      )}

      {/* Following */}
      {colVis.following && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[12px] tabular-nums text-neutral-500">
            {c.followsCount != null ? formatFollowers(c.followsCount) : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />}
          </span>
        </div>
      )}

      {/* Posts count */}
      {colVis.posts && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[12px] tabular-nums text-neutral-500">
            {c.postsCount != null ? c.postsCount : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />}
          </span>
        </div>
      )}

      {/* Eng. Rate */}
      {colVis.engRate && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: c.engagementRate ? '#111827' : '#d1d5db' }}>
            {c.engagementRate || '-'}
          </span>
        </div>
      )}

      {/* Score / Benchmark */}
      {colVis.score && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          <ScoreBadge score={c.aiScore ?? c.score} aiVerdict={c.aiVerdict} />
        </div>
      )}

      {/* Posts This Week */}
      {colVis.postsThisWeek && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          <span className="text-[12px] tabular-nums text-neutral-500">
            {c.postsThisWeek != null ? c.postsThisWeek : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />}
          </span>
        </div>
      )}

      {/* IG Category */}
      {colVis.category && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          {c.businessCategoryName
            ? <span className="text-[11px] text-neutral-500 truncate">{c.businessCategoryName}</span>
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
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
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Email */}
      {colVis.email && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          {c.businessEmail
            ? <span className="text-[11px] text-neutral-500 truncate">{c.businessEmail}</span>
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Verified */}
      {colVis.verified && (
        <div className="flex items-center justify-center px-2" style={{ borderRight: COL_BORDER }}>
          {c.verified
            ? <CheckCircle size={13} className="text-blue-500" />
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Private */}
      {colVis.private && (
        <div className="flex items-center justify-center px-2" style={{ borderRight: COL_BORDER }}>
          {c.isPrivate
            ? <Lock size={12} className="text-amber-500" />
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Enrich Status */}
      {colVis.enrichStatus && (
        <div className="flex items-center justify-center px-2" style={{ borderRight: COL_BORDER }}>
          <EnrichDot status={c._enrichStatus} />
        </div>
      )}

      {/* Source */}
      {colVis.source && (
        <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
          {c.source
            ? <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
              c.source === 'pre_approved' ? 'bg-violet-100 text-violet-600' :
              c.source === 'scraper'    ? 'bg-blue-100 text-blue-600' :
                                           'bg-neutral-100 text-neutral-600'
            }`}>{c.source === 'pre_approved' ? 'Pre-approved' : c.source === 'scraper' ? 'Scraper' : 'Manual'}</span>
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* IGTV */}
      {colVis.igtvVideoCount && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          {c.igtvVideoCount != null
            ? <span className="text-[12px] tabular-nums text-neutral-500">{c.igtvVideoCount}</span>
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Highlights */}
      {colVis.highlightReels && (
        <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
          {c.highlightReelCount != null
            ? <span className="text-[12px] tabular-nums text-neutral-500">{c.highlightReelCount}</span>
            : <span className="block w-1.5 h-1.5 rounded-full bg-neutral-300 mx-auto" />
          }
        </div>
      )}

      {/* Favorites */}
      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={onFavorite}>
        <Heart size={14} className="transition-colors cursor-pointer" style={{ color: c.favorited ? '#ff0069' : '#d1d5db' }} fill={c.favorited ? '#ff0069' : 'none'} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end px-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onToggleStatus} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
          {isActive ? <Pause size={11} /> : <Play size={11} />}
        </button>
        <a href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
          <ExternalLink size={11} />
        </a>
        <button
          onClick={onEnrich}
          disabled={isEnriching}
          className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium transition-all hover:bg-violet-50 disabled:opacity-40"
          style={{ borderColor: 'rgba(131,58,180,0.25)', color: '#833ab4' }}
        >
          <Sparkles size={9} className={isEnriching ? 'animate-spin' : ''} />
          {isEnriching ? '...' : 'Enrich'}
        </button>
        <ChevronRight size={13} className="text-neutral-200 group-hover:text-neutral-400 transition-colors" />
      </div>
    </motion.div>
  );
}
