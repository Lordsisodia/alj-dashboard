'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOARD_NAMES } from '../../constants';

export function BoardPickerDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center px-2.5 py-2 hover:bg-black/[0.03] transition-colors"
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
      >
        <ChevronDown size={12} className="text-neutral-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full right-0 mb-1 w-44 rounded-xl z-30 overflow-hidden"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
          >
            <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Add to Board</span>
            </div>
            {BOARD_NAMES.map(name => (
              <button
                key={name}
                className="w-full flex items-center px-3 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              >
                {name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
