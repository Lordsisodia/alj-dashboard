'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { MODELS } from '../constants';

interface SendToModelModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (modelId: string, note: string) => void;
}

export function SendToModelModal({ open, onClose, onConfirm }: SendToModelModalProps) {
  const [selected, setSelected] = useState<string>(MODELS[0].id);
  const [note, setNote] = useState('');

  function handleConfirm() {
    onConfirm(selected, note);
    setNote('');
    setSelected(MODELS[0].id);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.35)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed z-50 left-1/2 top-1/2"
            style={{ transform: 'translate(-50%, -50%)', width: 340 }}
          >
            <div
              className="rounded-2xl bg-white p-5"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Send to model</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Assign this reel for content inspiration</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-neutral-100"
                >
                  <X size={14} className="text-neutral-500" />
                </button>
              </div>

              {/* Model picker */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {MODELS.map((m) => {
                  const active = selected === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                      style={
                        active
                          ? {
                              background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))',
                              border: '1.5px solid rgba(37,99,235,0.35)',
                            }
                          : {
                              background: '#f5f5f4',
                              border: '1.5px solid transparent',
                            }
                      }
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: m.color }}
                      >
                        {m.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">{m.name}</p>
                        <p className="text-[10px] text-neutral-400">{m.handle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Note */}
              <div className="mb-4">
                <label className="text-[11px] font-medium text-neutral-500 mb-1.5 block">
                  Note <span className="text-neutral-300">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder='e.g. "Good hook for outdoor style"'
                  rows={2}
                  className="w-full text-xs text-neutral-700 placeholder-neutral-300 rounded-lg px-3 py-2 resize-none focus:outline-none"
                  style={{ background: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
                  style={{ background: '#f5f5f4' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  <Send size={12} />
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
