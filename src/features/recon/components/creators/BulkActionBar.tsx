'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, HeartOff, X, Loader2 } from 'lucide-react';

interface Props {
  count:          number;
  enrichingCount: number;
  onEnrich:       () => void;
  onFavorite:     () => void;
  onUnfavorite:   () => void;
  onClear:        () => void;
}

export function BulkActionBar({ count, enrichingCount, onEnrich, onFavorite, onUnfavorite, onClear }: Props) {
  const isBusy = enrichingCount > 0;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 24, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', minWidth: 340 }}
        >
          {/* Selection count */}
          <div className="flex items-center gap-2 px-2 mr-1">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white tabular-nums">{count}</span>
            </div>
            <span className="text-[12px] font-medium text-white/70">
              {count === 1 ? '1 creator selected' : `${count} creators selected`}
            </span>
          </div>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Enrich */}
          <button
            onClick={onEnrich}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: 'rgba(131,58,180,0.30)', color: '#d8b4fe' }}
            title="Run Apify enrichment on all selected"
          >
            {isBusy
              ? <Loader2 size={11} className="animate-spin" />
              : <Sparkles size={11} />
            }
            {isBusy ? `Enriching ${enrichingCount}...` : 'Enrich'}
          </button>

          {/* Favourite */}
          <button
            onClick={onFavorite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
            style={{ backgroundColor: 'rgba(255,0,105,0.20)', color: '#ff6eb4' }}
            title="Favourite all selected"
          >
            <Heart size={11} />
            Favourite
          </button>

          {/* Unfavourite */}
          <button
            onClick={onUnfavorite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
            title="Unfavourite all selected"
          >
            <HeartOff size={11} />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12px] transition-all"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            title="Clear selection"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
