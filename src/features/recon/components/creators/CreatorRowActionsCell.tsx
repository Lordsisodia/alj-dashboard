'use client';

import { ExternalLink, Pause, Play, Sparkles, ChevronRight } from 'lucide-react';
import type { Competitor } from '../../types';

interface ActionsCellProps {
  c: Competitor & {
    handle: string;
    status: string;
    favorited?: boolean;
  };
  isActive: boolean;
  isEnriching: boolean;
  onToggleStatus: (e: React.MouseEvent) => void;
}

export function ActionsCell({ c, isActive, isEnriching, onToggleStatus }: ActionsCellProps) {
  return (
    <div className="flex items-center justify-end px-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onToggleStatus} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
        {isActive ? <Pause size={11} /> : <Play size={11} />}
      </button>
      <a href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}>
        <ExternalLink size={11} />
      </a>
      <button
        disabled={isEnriching}
        className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium transition-all hover:bg-red-50 disabled:opacity-40"
        style={{ borderColor: 'rgba(220,38,38,0.30)', color: '#dc2626' }}
      >
        <Sparkles size={9} className={isEnriching ? 'animate-spin' : ''} />
        {isEnriching ? '...' : 'Enrich'}
      </button>
      <ChevronRight size={13} className="text-neutral-200 group-hover:text-neutral-400 transition-colors" />
    </div>
  );
}
