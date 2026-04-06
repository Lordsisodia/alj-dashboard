'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BadgeCheck, ExternalLink, Heart, Sparkles, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeProfileHealth } from '../../constants';
import type { Competitor } from '../../types';
import { ProfileHealthBar } from './ProfileHealthBar';
import { ScoreBadge } from './ScoreBadge';
import { formatFollowers } from './tableUtils';

interface Props {
  creator: Competitor & { _totalPosts?: number };
  isEnriching: boolean;
  isSelected: boolean;
  onOpen: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onEnrich: (e: React.MouseEvent) => void;
}

function Stat({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[12px] font-semibold text-neutral-800 tabular-nums">{value ?? '-'}</span>
      <span className="text-[9px] uppercase tracking-wide text-neutral-400 font-medium">{label}</span>
    </div>
  );
}

export function CreatorCard({ creator: c, isEnriching, isSelected, onOpen, onSelect, onFavorite, onEnrich }: Props) {
  const health   = computeProfileHealth(c);
  const [imgErr, setImgErr] = useState(false);
  // Reset when a fresh avatar URL arrives after enrichment
  useEffect(() => { setImgErr(false); }, [c.profilePicUrl]);

  const followsDisplay  = c.followsCount  != null ? formatFollowers(c.followsCount)  : null;
  const postsDisplay    = c.postsCount    != null ? String(c.postsCount)              : null;

  return (
    <div
      onClick={onOpen}
      className={cn('group relative bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5', isSelected && 'ring-2 ring-blue-400 ring-offset-1')}
      style={{ border: isSelected ? '1px solid #93c5fd' : '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Select checkbox (top-left) */}
      <div
        className={cn('absolute top-2 left-2 z-10 w-4 h-4 rounded flex items-center justify-center border transition-all', isSelected ? 'bg-blue-500 border-blue-500 opacity-100' : 'bg-white border-neutral-300 opacity-0 group-hover:opacity-100')}
        onClick={onSelect}
      >
        {isSelected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>

      {/* Niche colour bar */}
      <div className="h-0.5 rounded-t-xl w-full" style={{ backgroundColor: c.nicheColor }} />

      {/* Header */}
      <div className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              {c.favorited && (
                <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />
              )}
              {c.profilePicUrl && !imgErr
                ? <Image src={c.profilePicUrl} alt={c.displayName} width={36} height={36} className="rounded-full object-cover relative z-10" onError={() => setImgErr(true)} />
                : <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[13px] font-semibold text-neutral-900 truncate">{c.displayName}</p>
                {c.verified && <BadgeCheck size={12} className="text-blue-500 flex-shrink-0" />}
              </div>
              <p className="text-[11px] text-neutral-400 truncate">{c.handle}</p>
            </div>
          </div>
          <button onClick={onFavorite} className="flex-shrink-0 mt-0.5" aria-label="Favorite">
            <Heart size={13} style={{ color: c.favorited ? '#ff0069' : '#d1d5db' }} fill={c.favorited ? '#ff0069' : 'none'} />
          </button>
        </div>

        {/* Bio */}
        {c.bio && (
          <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed">{c.bio}</p>
        )}

        {/* Account type / category */}
        {c.businessCategoryName && (
          <span className="inline-block mt-1.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">{c.businessCategoryName}</span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 py-2 border-t border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <Stat label="Followers" value={c.followers} />
        <Stat label="Following" value={followsDisplay} />
        <Stat label="Posts"     value={postsDisplay} />
      </div>

      {/* Health + score + niche */}
      <div className="p-3 flex items-center gap-2">
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0" style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}>{c.niche}</span>
        <div className="flex-1 min-w-0"><ProfileHealthBar pct={health} /></div>
        <ScoreBadge score={c.score} />
      </div>

      {/* Footer links */}
      {(c.externalUrl || c.businessEmail) && (
        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap">
          {c.externalUrl && (
            <a href={c.externalUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-violet-600 hover:underline truncate max-w-[120px]">
              <Link2 size={9} /><span className="truncate">{c.externalUrl.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {c.businessEmail && (
            <span className="text-[10px] text-neutral-400 truncate max-w-[130px]">{c.businessEmail}</span>
          )}
        </div>
      )}

      {/* Enrich button */}
      {health < 75 && (
        <div className="px-3 pb-3">
          <button
            onClick={onEnrich}
            disabled={isEnriching}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all hover:bg-violet-50 disabled:opacity-40"
            style={{ borderColor: 'rgba(131,58,180,0.25)', color: '#833ab4' }}
          >
            <Sparkles size={10} className={isEnriching ? 'animate-spin' : ''} />
            {isEnriching ? 'Enriching...' : 'Enrich Profile'}
          </button>
        </div>
      )}

      {/* External link overlay */}
      <a
        href={`https://instagram.com/${c.handle.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}
      >
        <ExternalLink size={10} />
      </a>
    </div>
  );
}
