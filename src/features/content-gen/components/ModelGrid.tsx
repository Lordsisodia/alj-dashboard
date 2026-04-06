'use client';

import { Plus } from 'lucide-react';
import { ModelCard } from './ModelCard';
import type { ModelDoc } from '../types';

interface Props {
  models: ModelDoc[];
  ideaCounts: Record<string, number>;
  clipCounts: Record<string, number>;
  onEdit: (m: ModelDoc) => void;
  onAdd: () => void;
}

export function ModelGrid({ models, ideaCounts, clipCounts, onEdit, onAdd }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {models.map(model => (
        <ModelCard
          key={model._id}
          model={model}
          ideaCount={ideaCounts[model._id] ?? 0}
          clipCount={clipCounts[model._id] ?? 0}
          onEdit={() => onEdit(model)}
        />
      ))}

      <button
        onClick={onAdd}
        className="rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 flex flex-col items-center justify-center gap-2 min-h-[260px] text-neutral-300 hover:text-neutral-500 transition-all"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#f5f5f4' }}
        >
          <Plus size={18} className="text-neutral-400" />
        </div>
        <span className="text-xs font-semibold">Add Model</span>
      </button>
    </div>
  );
}
