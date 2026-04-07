'use client';

/**
 * ViewToggle — a compact pill-style toggle for switching between two or more view modes.
 *
 * Usage:
 *   import { ViewToggle } from '@/components/ui/view-toggle';
 *   import { LayoutGrid, List } from 'lucide-react';
 *
 *   const [view, setView] = useState<'card' | 'list'>('card');
 *
 *   <ViewToggle
 *     value={view}
 *     onChange={setView}
 *     options={[
 *       { value: 'card', icon: <LayoutGrid size={11} /> },
 *       { value: 'list', icon: <List size={11} /> },
 *     ]}
 *   />
 *
 * Options can include an optional `label` string alongside the icon:
 *   { value: 'table', icon: <TableIcon size={11} />, label: 'Table' }
 *
 * Size variants: 'sm' (default, icon-only) | 'md' (more padding, suits labelled options)
 */

import { type ReactNode } from 'react';

export interface ViewToggleOption<T extends string> {
  value:  T;
  icon:   ReactNode;
  label?: string;
}

interface Props<T extends string> {
  value:    T;
  options:  ViewToggleOption<T>[];
  onChange: (value: T) => void;
  /** 'sm' = tight padding (default), 'md' = slightly more room */
  size?:    'sm' | 'md';
}

export function ViewToggle<T extends string>({ value, options, onChange, size = 'sm' }: Props<T>) {
  const padding = size === 'md' ? 'p-2' : 'p-1.5';

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-0.5 shrink-0"
      style={{ backgroundColor: '#efefef' }}
    >
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`${padding} rounded-md transition-colors flex items-center gap-1`}
            style={
              active
                ? { backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }
                : { color: '#9ca3af' }
            }
            aria-pressed={active}
            aria-label={opt.label ?? opt.value}
          >
            {opt.icon}
            {opt.label && (
              <span className="text-[10px] font-medium">{opt.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
