'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const NICHE_OPTIONS = ['GFE', 'Fitness', 'Lifestyle', 'Meme', 'Thirst Trap'];
const COLOR_SWATCHES = ['#ff0069', '#833ab4', '#22c55e', '#f59e0b', '#06b6d4', '#3b82f6'];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddModelDrawer({ open, onClose }: Props) {
  const [name, setName]       = useState('');
  const [niche, setNiche]     = useState('GFE');
  const [handle, setHandle]   = useState('');
  const [igHandle, setIg]     = useState('');
  const [color, setColor]     = useState('#ff0069');
  const [bio, setBio]         = useState('');

  const inputCls = "w-full px-3 py-2 rounded-xl text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-pink-200 transition-colors";
  const inputStyle = { border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fff' };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-96 z-50 flex flex-col overflow-hidden"
            style={{ backgroundColor: '#f5f5f5', borderLeft: '1px solid rgba(0,0,0,0.08)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 h-14 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
            >
              <p className="text-sm font-semibold text-neutral-900">Add Model</p>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.06] transition-colors"
              >
                <X size={14} className="text-neutral-500" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                className="rounded-xl p-4 space-y-4"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Display Name</label>
                  <input
                    className={inputCls}
                    style={inputStyle}
                    placeholder="e.g. Bella"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                {/* Niche */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Niche</label>
                  <select
                    className={inputCls}
                    style={inputStyle}
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                  >
                    {NICHE_OPTIONS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* OF Handle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">OnlyFans Handle</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                    <span className="px-3 py-2 text-sm text-neutral-400 bg-neutral-50 border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>@</span>
                    <input
                      className="flex-1 px-3 py-2 text-sm text-neutral-800 outline-none bg-white"
                      placeholder="handle"
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                    />
                  </div>
                </div>

                {/* IG Handle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Instagram Handle</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                    <span className="px-3 py-2 text-sm text-neutral-400 bg-neutral-50 border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>@</span>
                    <input
                      className="flex-1 px-3 py-2 text-sm text-neutral-800 outline-none bg-white"
                      placeholder="handle"
                      value={igHandle}
                      onChange={e => setIg(e.target.value)}
                    />
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Accent Color</label>
                  <div className="flex gap-2">
                    {COLOR_SWATCHES.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          backgroundColor: c,
                          outline: color === c ? `3px solid ${c}` : 'none',
                          outlineOffset: '2px',
                          transform: color === c ? 'scale(1.15)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Bio</label>
                  <textarea
                    className={inputCls}
                    style={{ ...inputStyle, resize: 'none' }}
                    rows={3}
                    placeholder="Brief description of this model's content style..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
            >
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: '1px solid rgba(0,0,0,0.09)', color: '#525252' }}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                Add Model
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
