'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';
import { COL_BORDER } from './tableUtils';
import { EnrichDot } from './EnrichDot';

interface AvatarCellProps {
  c: {
    handle: string;
    displayName: string;
    initials: string;
    profilePicUrl?: string | null;
    avatarColor: string;
    favorited?: boolean;
    verified?: boolean;
    _totalPosts?: number;
  };
  isActive: boolean;
  imgErr: boolean;
  setImgErr: (v: boolean) => void;
}

export function AvatarCell({ c, isActive, imgErr, setImgErr }: AvatarCellProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 min-w-0" style={{ borderRight: COL_BORDER }}>
      <div className="relative flex-shrink-0">
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white z-20" style={{ backgroundColor: isActive ? '#16a34a' : '#d1d5db' }} />
        {c.favorited && (
          <div className="absolute inset-0 rounded-full z-10" style={{ background: 'linear-gradient(135deg, #ff0069, #dc2626)', padding: '2px', borderRadius: '50%', margin: '-2px' }} />
        )}
        {c.profilePicUrl && !imgErr
          ? <Image src={c.profilePicUrl} alt={c.displayName} width={34} height={34} className="rounded-full object-cover relative z-10" onError={() => setImgErr(true)} />
          : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
        }
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-semibold text-neutral-900 truncate leading-tight">{c.displayName}</p>
          {c.verified && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#3b82f6" className="flex-shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          )}
          {c._totalPosts != null && c._totalPosts > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-500 flex-shrink-0 tabular-nums">
              <Film size={8} />{c._totalPosts}
            </span>
          )}
        </div>
        <p className="text-[11px] text-neutral-400 truncate leading-tight">{c.handle}</p>
      </div>
    </div>
  );
}
