'use client';

import { cn } from '@/lib/utils';
import { STYLES } from './types';
import type { Style } from './types';

interface Props {
  value: Style;
  onChange: (s: Style) => void;
}

export function StyleChips({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STYLES.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
            value === s.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-700'
          )}
          style={value === s.id
            ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
            : { backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
