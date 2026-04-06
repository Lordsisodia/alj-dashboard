'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ConvexModel } from './types';
import { initials } from './types';

interface Props {
  models: ConvexModel[];
  selected: Id<'models'> | null;
  onSelect: (id: Id<'models'>) => void;
}

export function TalentPicker({ models, selected, onSelect }: Props) {
  if (models.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400"
        style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }}>
        <AlertCircle size={13} className="text-neutral-300" />
        No talent profiles yet - add models to get started
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {models.map(m => {
        const isActive = selected === m._id;
        return (
          <button
            key={m._id}
            onClick={() => onSelect(m._id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              isActive ? 'text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-800'
            )}
            style={isActive
              ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', border: '1.5px solid transparent' }
              : { backgroundColor: '#f5f5f4', border: '1.5px solid rgba(0,0,0,0.07)' }
            }
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : m.avatarColor }}
            >
              {initials(m.name)}
            </span>
            <span>{m.name}</span>
            <span className={cn('text-[10px]', isActive ? 'text-white/70' : 'text-neutral-400')}>
              {m.niche}
            </span>
          </button>
        );
      })}
    </div>
  );
}
