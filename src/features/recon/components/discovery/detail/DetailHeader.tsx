'use client';

import { X } from 'lucide-react';
import type { Candidate } from '../../../types';

interface DetailHeaderProps {
  candidate: Candidate;
  alreadyTracked: boolean;
  onClose: () => void;
}

export function DetailHeader({ candidate, alreadyTracked, onClose }: DetailHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {candidate.initials}
        </span>
        <div>
          <p className="text-sm font-bold text-neutral-900 leading-tight">{candidate.handle}</p>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}
          >
            {candidate.niche}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {alreadyTracked && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
          >
            Tracked
          </span>
        )}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
