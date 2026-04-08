'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BadgeCheck, ExternalLink, Heart, Sparkles, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeProfileHealth } from '../../../constants';
import type { Competitor } from '../../../types';
import { ProfileHealthBar } from '../../shared/ProfileHealthBar';
import { ScoreBadge } from '../../shared/ScoreBadge';
import { formatFollowers } from '../tableUtils';

interface Props {
  creator: Competitor & {
    _totalPosts?: number;
    aiScore?: number;
    aiVerdict?: 'HIRE' | 'WATCH' | 'PASS';
  };
  isEnriching: boolean;
  isSelected: boolean;
  onOpen: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onEnrich: (e: React.MouseEvent) => void;
}

export function CreatorCard({ creator: c, isEnriching, isSelected, onOpen, onSelect, onFavorite, onEnrich }: Props) {
  const health   = computeProfileHealth(c);
  const isActive = c.status === 'active';
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => { setImgErr(false); }, [c.profilePicUrl]);

  return (
    <div
      onClick={onOpen}
      className={cn(
        'group relative bg-white rounded-2xl border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5',
        isSelected && 'ring-2 ring-violet-400 ring-offset-1'
      )}
      style={{ border: isSelected ? '1px solid #a78bfa' : '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Niche colour bar */}
      <div className="h-1 rounded-t-2xl w-full" style={{ backgroundColor: c.nicheColor }} />

      {/* Card body */}
      <div className="p-4">
        {/* Header row: avatar + info + actions */}
        <div className="flex items-start gap-3">
          {/* Avatar + status dot */}
          <div className="relative flex-shrink-0">
            {c.profilePicUrl && !imgErr
              ? <Image src={c.profilePicUrl} alt={c.displayName} width={44} height={44} className="rounded-full object-cover" onError={() => setImgErr(true)} />
              : <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
            }
            {/* Status dot */}
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: isActive ? '#16a34a' : '#d1d5db' }}
            />
            {/* Favorite ring */}
            {c.favorited && (
              <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-semibold text-neutral-900 truncate">{c.displayName}</p>
                  {c.verified && <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{c.handle}</p>
                <span
                  className="mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}
                >
                  {c.niche}
                </span>
              </div>

              {/* Favorite */}
              <button onClick={onFavorite} aria-label="Favorite" className="flex-shrink-0 mt-0.5">
                <Heart size={14} style={{ color: c.favorited ? '#ff0069' : '#d1d5db' }} fill={c.favorited ? '#ff0069' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {c.bio && (
          <p className="mt-3 text-[11px] text-neutral-500 leading-relaxed line-clamp-2">{c.bio}</p>
        )}

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}>
            <span className="text-[13px] font-bold text-neutral-900 tabular-nums">{c.followers || '-'}</span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-wide mt-0.5">Followers</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}>
            <span className="text-[12px] font-semibold text-neutral-600 tabular-nums">
              {c.followsCount != null ? formatFollowers(c.followsCount) : '-'}
            </span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-wide mt-0.5">Following</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}>
            <span className="text-[12px] font-semibold text-neutral-600 tabular-nums">
              {c.postsCount != null ? c.postsCount : (c._totalPosts ?? '-')}
            </span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-wide mt-0.5">Posts</span>
          </div>
        </div>

        {/* Footer: health + score + enrich */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <ProfileHealthBar pct={health} />
            </div>
            <div className="min-w-0">
              <ScoreBadge score={c.aiScore ?? c.score} aiVerdict={c.aiVerdict} />
            </div>
          </div>

          {/* Enrich button — only show if not fully healthy */}
          {health < 75 && (
            <button
              onClick={(e) => { e.stopPropagation(); onEnrich(e); }}
              disabled={isEnriching}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all hover:bg-violet-50 disabled:opacity-40 flex-shrink-0"
              style={{ borderColor: 'rgba(131,58,180,0.3)', color: '#833ab4', backgroundColor: 'rgba(131,58,180,0.04)' }}
            >
              <Sparkles size={10} className={isEnriching ? 'animate-spin' : ''} />
              {isEnriching ? '...' : 'Enrich'}
            </button>
          )}
        </div>

        {/* External link + business info */}
        {(c.externalUrl || c.businessEmail) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {c.externalUrl && (
              <a
                href={c.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-violet-600 hover:underline truncate max-w-[160px]"
              >
                <Link2 size={9} />
                <span className="truncate">{c.externalUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {c.businessEmail && (
              <span className="text-[10px] text-neutral-400 truncate max-w-[140px]">{c.businessEmail}</span>
            )}
          </div>
        )}
      </div>

      {/* External link overlay — top right */}
      <a
        href={`https://instagram.com/${c.handle.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}
      >
        <ExternalLink size={11} />
      </a>

      {/* Select checkbox — top left */}
      <div
        className={cn(
          'absolute top-3 left-3 z-10 w-4 h-4 rounded flex items-center justify-center border transition-all',
          isSelected ? 'bg-violet-500 border-violet-500 opacity-100' : 'bg-white border-neutral-300 opacity-0 group-hover:opacity-100'
        )}
        onClick={onSelect}
      >
        {isSelected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    </div>
  );
}
