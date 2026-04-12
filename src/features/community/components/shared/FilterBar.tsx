'use client';

import type { Niche, ContentType } from '../../types';
import { NICHE_CONFIG } from '../../constants';

interface NicheFilterOption {
  id: 'all' | Niche;
  label: string;
}

interface TypeFilterOption {
  id: 'all' | ContentType;
  label: string;
}

export const NICHE_OPTIONS: NicheFilterOption[] = [
  { id: 'all',       label: 'All'       },
  { id: 'fitness',   label: 'Fitness'   },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'fashion',   label: 'Fashion'   },
  { id: 'wellness',  label: 'Wellness'  },
];

export const TYPE_OPTIONS: TypeFilterOption[] = [
  { id: 'all',       label: 'All'       },
  { id: 'Reel',      label: 'Reels'     },
  { id: 'Post',      label: 'Posts'     },
  { id: 'Carousel',  label: 'Carousels' },
];

interface NicheFilterBarProps {
  value: 'all' | Niche;
  onChange: (v: 'all' | Niche) => void;
}

interface TypeFilterBarProps {
  value: 'all' | ContentType;
  onChange: (v: 'all' | ContentType) => void;
}

export function NicheFilterBar({ value, onChange }: NicheFilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {NICHE_OPTIONS.map(n => {
        const active = value === n.id;
        const cfg = n.id !== 'all' ? NICHE_CONFIG[n.id] : null;
        return (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
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
  );
}

export function TypeFilterBar({ value, onChange }: TypeFilterBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      {TYPE_OPTIONS.map(t => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
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
  );
}
