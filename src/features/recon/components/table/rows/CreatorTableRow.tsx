'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Pause, Play, Sparkles, Film, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, computeProfileHealth } from '../../../constants';
import type { Competitor } from '../../../types';
import { ScoreBadge }       from '../../shared/ScoreBadge';
import { ProfileHealthBar } from '../../shared/ProfileHealthBar';
import { Sparkline }        from '../../shared/Sparkline';
import { TABLE_COLS, COL_BORDER } from '../tableUtils';

type Props = {
  c: Competitor & { _totalPosts?: number };
  rowIdx: number; isSelected: boolean; isEnriching: boolean;
  onOpen: (c: Competitor) => void;
  onSelect: (id: number, e: React.MouseEvent) => void;
  onFavorite: (id: number, e: React.MouseEvent) => void;
  onToggleStatus: (id: number, e: React.MouseEvent) => void;
  onEnrich: (id: number, e: React.MouseEvent) => void;
};

export function CreatorTableRow({ c, rowIdx, isSelected, isEnriching, onOpen, onSelect, onFavorite, onToggleStatus, onEnrich }: Props) {
  const isActive = c.status === 'active';
  const health   = computeProfileHealth(c);

  return (
    <motion.div
      variants={fadeUp}
      onClick={() => onOpen(c)}
      className={cn('grid items-stretch border-b transition-colors group cursor-pointer relative', isSelected ? 'bg-blue-50/60' : 'hover:bg-[#f9faff]')}
      style={{ gridTemplateColumns: TABLE_COLS, minHeight: 48, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ backgroundColor: c.nicheColor }} />

      <div className="flex items-center justify-center" style={{ borderRight: COL_BORDER }} onClick={(e) => onSelect(c.id, e)}>
        <div className={cn('w-3.5 h-3.5 rounded flex items-center justify-center border transition-all opacity-0 group-hover:opacity-100', isSelected ? 'bg-blue-500 border-blue-500 opacity-100' : 'border-neutral-300 bg-white')}>
          {isSelected && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>

      <div className="flex items-center justify-center text-[11px] text-neutral-300 tabular-nums" style={{ borderRight: COL_BORDER }}>{rowIdx + 1}</div>

      <div className="flex items-center gap-3 px-3 min-w-0" style={{ borderRight: COL_BORDER }}>
        <div className="relative flex-shrink-0">
          {c.favorited && <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />}
          {c.profilePicUrl ? (
            <Image src={c.profilePicUrl} alt={c.displayName} width={32} height={32} className="rounded-full object-cover relative z-10" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-semibold text-neutral-900 truncate leading-tight">{c.displayName}</p>
            {c._totalPosts != null && c._totalPosts > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-500 flex-shrink-0 tabular-nums">
                <Film size={8} />{c._totalPosts}
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 truncate leading-tight mt-0.5">{c.handle}</p>
        </div>
      </div>

      <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}>{c.niche}</span>
      </div>
      <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
        <span className="text-[13px] font-medium tabular-nums" style={{ color: c.followers ? '#111827' : '#d1d5db' }}>{c.followers || '--'}</span>
      </div>
      <div className="flex items-center justify-end px-3" style={{ borderRight: COL_BORDER }}>
        <span className="text-[13px] font-medium tabular-nums" style={{ color: c.engagementRate ? '#111827' : '#d1d5db' }}>{c.engagementRate || '--'}</span>
      </div>

      <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}>
        <div className="flex flex-col gap-1">
          <ScoreBadge score={c.score} />
          <div className="w-12 h-0.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score >= 80 ? '#16a34a' : c.score >= 65 ? '#2563eb' : c.score >= 50 ? '#d97706' : '#dc2626' }} />
          </div>
        </div>
      </div>
      <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}><ProfileHealthBar pct={health} /></div>
      <div className="flex items-center px-3" style={{ borderRight: COL_BORDER }}><Sparkline values={c.trend} color={c.nicheColor} /></div>

      <div className="flex items-center justify-end px-3 gap-1.5">
        <button onClick={(e) => onFavorite(c.id, e)} className={cn('w-7 h-7 flex items-center justify-center rounded-lg transition-all flex-shrink-0', c.favorited ? 'text-[#ff0069]' : 'text-neutral-300 hover:text-neutral-400')}>
          <Heart size={13} fill={c.favorited ? '#ff0069' : 'none'} />
        </button>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => onEnrich(c.id, e)} disabled={isEnriching} className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors hover:bg-neutral-100 disabled:opacity-50" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#6b7280' }} title="Enrich via Apify">
            <Sparkles size={10} className={isEnriching ? 'animate-spin' : ''} />{isEnriching ? 'Enriching...' : 'Enrich'}
          </button>
          <button onClick={(e) => onToggleStatus(c.id, e)} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
            {isActive ? <Pause size={11} /> : <Play size={11} />}
          </button>
          <a href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
            <ExternalLink size={11} />
          </a>
          <ChevronRight size={13} className="text-neutral-200 group-hover:text-neutral-400 transition-colors ml-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
