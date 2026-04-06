'use client';

import type { FilterOption } from './lib';
import { FILTERS } from './lib';

interface Props {
  active: FilterOption;
  counts: Record<FilterOption, number>;
  onChange: (f: FilterOption) => void;
}

export function FilterBar({ active, counts, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all"
          style={active === f
            ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
            : { backgroundColor: '#f3f4f6', color: '#6b7280' }
          }
        >
          {f}{counts[f] > 0 ? ` (${counts[f]})` : ''}
        </button>
      ))}
    </div>
  );
}
