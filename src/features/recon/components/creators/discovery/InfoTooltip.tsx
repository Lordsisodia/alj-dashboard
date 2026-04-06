'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
}

export function InfoTooltip({ text }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors"
        style={{
          backgroundColor: open ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.06)',
          color: open ? '#dc2626' : '#9ca3af',
          border: open ? '1px solid rgba(220,38,38,0.25)' : '1px solid transparent',
        }}
        aria-label="More info"
      >
        i
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-6 z-50 w-56 rounded-xl p-3"
            style={{
              backgroundColor: '#1a0a0a',
              border: '1px solid rgba(220,38,38,0.2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            {/* Arrow */}
            <div
              className="absolute -top-1.5 left-2 w-3 h-3 rotate-45"
              style={{ backgroundColor: '#1a0a0a', border: '1px solid rgba(220,38,38,0.2)', borderRight: 'none', borderBottom: 'none' }}
            />
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
