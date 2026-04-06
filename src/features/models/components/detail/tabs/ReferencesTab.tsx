'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Info } from 'lucide-react';
import type { ModelData } from '../../../types';

const UPLOADED = [
  { id: 'ref-1', name: 'ref_001.jpg', gradient: 'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)', type: 'Face Transfer' as const },
  { id: 'ref-2', name: 'ref_002.jpg', gradient: 'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)', type: 'Soul ID' as const },
];

const TYPE_BADGE_STYLES = {
  'Face Transfer': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Soul ID':       'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const GUIDELINES = [
  'FLUX Face Transfer: Clear front-facing photos, 1:1 ratio, min 512×512px',
  'Higgsfield Soul ID: 5+ training photos from varied angles for best results',
  'JPG or PNG, well-lit, no heavy filters',
];

type SlotType = 'Face Transfer' | 'Soul ID' | null;

export function ReferencesTab({ model }: { model: ModelData }) {
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [slotTypes, setSlotTypes] = useState<SlotType[]>([null, null, null, null]);

  function handleUseInGenerate(refId: string) {
    setSelectedRef(refId);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

  function setSlotType(index: number, type: SlotType) {
    setSlotTypes(prev => prev.map((t, i) => i === index ? type : t));
  }

  // suppress unused warning
  void selectedRef;

  return (
    <div className="p-4 space-y-4 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-800">Face Reference Images</p>
          <p className="text-xs text-neutral-400 mt-0.5 max-w-sm">
            These images feed the FLUX face transfer pipeline. Upload clear, front-facing photos.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Plus size={11} />
          Add References
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Uploaded slots */}
        {UPLOADED.map((ref, i) => (
          <motion.div
            key={ref.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl overflow-hidden relative group"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="aspect-square w-full relative">
              <div className="w-full h-full" style={{ background: ref.gradient }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              <button
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                <X size={10} className="text-white" />
              </button>
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
              >
                <p className="text-[10px] text-white font-medium">{ref.name}</p>
              </div>
            </div>
            {/* Type badge + Use in Generate */}
            <div className="px-2 py-2 space-y-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_BADGE_STYLES[ref.type]}`}>
                {ref.type}
              </span>
              <div>
                <button
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium w-full"
                  style={{ backgroundColor: '#ff0069', color: 'white' }}
                  onClick={() => handleUseInGenerate(ref.id)}
                >
                  Use in Generate
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty upload slots */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (UPLOADED.length + i) * 0.06 }}
            className="rounded-xl overflow-hidden"
            style={{ border: '2px dashed rgba(0,0,0,0.12)' }}
          >
            <div className="aspect-square flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-black/[0.02] transition-colors">
              <Upload size={16} className="text-neutral-300" />
              <span className="text-[10px] text-neutral-400">Upload reference</span>
            </div>
            {/* Type selector pills */}
            <div className="px-2 pb-2 flex gap-1 justify-center flex-wrap">
              {(['Face Transfer', 'Soul ID'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSlotType(i, slotTypes[i] === type ? null : type)}
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border transition-colors ${
                    slotTypes[i] === type
                      ? TYPE_BADGE_STYLES[type]
                      : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                  }`}
                >
                  {type === 'Face Transfer' ? 'Face Transfer (FLUX)' : 'Soul ID (Higgsfield)'}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guidelines */}
      <div
        className="rounded-xl p-3 space-y-1.5"
        style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Info size={12} className="text-neutral-400" />
          <p className="text-[11px] font-semibold text-neutral-500">Upload Guidelines</p>
        </div>
        {GUIDELINES.map(g => (
          <div key={g} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0 mt-1.5" />
            <p className="text-xs text-neutral-500">{g}</p>
          </div>
        ))}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            Reference selected - open Content Gen to use
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
