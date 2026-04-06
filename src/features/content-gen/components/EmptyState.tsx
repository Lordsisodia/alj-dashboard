import { Plus, Sparkles } from 'lucide-react';
import { GRAD } from '../constants';

interface Props {
  onAdd: () => void;
  onSeed: () => void;
}

export function EmptyState({ onAdd, onSeed }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: GRAD }}
      >
        <Sparkles size={28} className="text-white" />
      </div>

      <div>
        <p className="text-base font-bold text-neutral-800">No models yet</p>
        <p className="text-sm text-neutral-400 mt-1 max-w-xs leading-relaxed">
          Add your first creator to start building the AI content pipeline -
          reference images power FLUX face transfer.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onSeed}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
        >
          Seed sample roster
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:brightness-105 transition-all active:scale-95"
          style={{ background: GRAD }}
        >
          <Plus size={14} />
          Add first model
        </button>
      </div>
    </div>
  );
}
