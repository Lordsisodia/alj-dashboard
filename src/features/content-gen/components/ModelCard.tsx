'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Sparkles, Lightbulb, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NicheChip } from './NicheChip';
import { CompletionBar } from './CompletionBar';
import { completionPct, stripAt } from '../utils';
import { GRAD } from '../constants';
import type { ModelDoc } from '../types';

interface Props {
  model: ModelDoc;
  ideaCount: number;
  clipCount: number;
  onEdit: () => void;
}

function HoverOverlay({ onEdit }: { onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex items-center justify-center gap-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 text-xs font-semibold text-neutral-800 hover:bg-white transition-colors"
      >
        <Edit2 size={12} /> Edit
      </button>
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:brightness-110"
        style={{ background: GRAD }}
      >
        <Sparkles size={12} /> Ideas
      </button>
    </motion.div>
  );
}

export function ModelCard({ model, ideaCount, clipCount, onEdit }: Props) {
  const [hovered, setHovered] = useState(false);
  const pct = completionPct(model);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ backgroundColor: '#f5f5f4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo area */}
      <div
        className="relative h-44 flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: model.avatarColor }}
      >
        <span className="text-4xl font-black text-white/60 select-none tracking-tight">
          {model.name.slice(0, 2).toUpperCase()}
        </span>
        <span className={cn(
          'absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-white',
          model.active ? 'bg-emerald-400' : 'bg-neutral-300',
        )} />
        <div
          className="absolute inset-x-0 bottom-0 h-16 flex items-end px-3 pb-2.5"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
        >
          <NicheChip niche={model.niche} />
        </div>
        <AnimatePresence>
          {hovered && <HoverOverlay onEdit={onEdit} />}
        </AnimatePresence>
      </div>

      {/* Info area */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-neutral-900 truncate">{model.name}</span>
          <span className={cn('text-[10px] font-semibold flex-shrink-0', model.active ? 'text-emerald-600' : 'text-neutral-400')}>
            {model.active ? 'Active' : 'Draft'}
          </span>
        </div>

        {(model.ofHandle || model.igHandle) ? (
          <div className="flex items-center gap-2 flex-wrap">
            {model.ofHandle && <span className="text-[11px] text-neutral-500 font-medium">@{stripAt(model.ofHandle)}</span>}
            {model.ofHandle && model.igHandle && <span className="text-neutral-300 text-[10px]">·</span>}
            {model.igHandle && <span className="text-[11px] text-neutral-400">IG @{stripAt(model.igHandle)}</span>}
          </div>
        ) : (
          <span className="text-[11px] text-neutral-300 italic">No handles linked</span>
        )}

        <div className="space-y-1">
          <CompletionBar pct={pct} />
          {pct < 100 && <span className="text-[10px] text-neutral-400">Profile {pct}% complete</span>}
        </div>

        <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
            <Lightbulb size={11} className="text-neutral-400" />
            {ideaCount} idea{ideaCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
            <Film size={11} className="text-neutral-400" />
            {clipCount} clip{clipCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
