'use client';

import { Shuffle } from 'lucide-react';
import { NICHE_CONFIG } from '../../../community/data';
import type { Niche, ContentType } from '../../../community/types';

const NICHES: { id: 'all' | Niche; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'fitness',   label: 'Fitness'   },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'fashion',   label: 'Fashion'   },
  { id: 'wellness',  label: 'Wellness'  },
];

const TYPES: { id: 'all' | ContentType; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'Reel',      label: 'Reels'     },
  { id: 'Post',      label: 'Posts'     },
  { id: 'Carousel',  label: 'Carousels' },
];

interface VaultFilterBarProps {
  niche: 'all' | Niche;
  type: 'all' | ContentType;
  onNicheChange: (n: 'all' | Niche) => void;
  onTypeChange: (t: 'all' | ContentType) => void;
  onStartSession: () => void;
}

export function VaultFilterBar({
  niche, type, onNicheChange, onTypeChange, onStartSession,
}: VaultFilterBarProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: niche + swipe CTA */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {NICHES.map(n => {
            const active = niche === n.id;
            const cfg = n.id !== 'all' ? NICHE_CONFIG[n.id] : null;
            return (
              <button
                key={n.id}
                onClick={() => onNicheChange(n.id)}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                style={
                  active
                    ? {
                        background: cfg
                          ? cfg.color
                          : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: '#fff',
                      }
                    : { background: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
                }
              >
                {n.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={onStartSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          <Shuffle size={12} />
          Start Swipe Session
        </button>
      </div>

      {/* Row 2: type filters */}
      <div className="flex items-center gap-1.5">
        {TYPES.map(t => {
          const active = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={
                active
                  ? { background: '#171717', color: '#fff' }
                  : { background: '#fff', color: '#737373', border: '1px solid rgba(0,0,0,0.09)' }
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
