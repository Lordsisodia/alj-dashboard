'use client';

import { cn } from '@/lib/utils';
import { GENERATORS, fmtEta } from './types';
import type { Generator } from './types';

interface Props {
  value: Generator;
  onChange: (g: Generator) => void;
}

export function GeneratorPills({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {GENERATORS.map(g => {
        const isActive = value === g.id;
        return (
          <button
            key={g.id}
            onClick={() => onChange(g.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-700'
            )}
            style={isActive
              ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
              : { backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }
            }
            title={g.description}
          >
            {g.icon}
            {g.label}
            <span className={cn('font-semibold', isActive ? 'text-white/80' : 'text-neutral-400')}>
              {fmtEta(g.eta)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
