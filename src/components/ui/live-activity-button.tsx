'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { ActivityFeed } from '@/components/ui/activity-feed';

export function LiveActivityButton({ accentColor = '#dc2626' }: { accentColor?: string } = {}) {
  const [open, setOpen] = useState(false);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const panelRef        = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  function updateCoords() {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
  }

  useEffect(() => { if (open) updateCoords(); }, [open]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        panelRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        title="Live Activity"
        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150"
        style={open ? {
          backgroundColor: accentColor,
          border: `1px solid ${accentColor}`,
          color: '#fff',
          boxShadow: `0 0 0 3px ${accentColor}33, 0 0 14px ${accentColor}73`,
        } : {
          backgroundColor: '#fff',
          border: '1px solid rgba(0,0,0,0.09)',
          color: '#737373',
        }}
      >
        <Activity size={12} style={{ color: open ? '#fff' : accentColor }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-[200]"
            style={{
              top: coords.top,
              right: coords.right,
              width: 284,
              height: 420,
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 18,
              boxShadow: `0 0 0 1px ${accentColor}10, 0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.13)`,
              overflow: 'hidden',
            }}
          >
            <ActivityFeed />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
