'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { StyleChips } from '@/features/content-gen/components/generate/StyleChips';
import type { Style } from '@/features/content-gen/components/generate/types';
import { GENERATORS } from '@/features/content-gen/components/generate/types';
import type { Id } from '@/convex/_generated/dataModel';

const PROVIDERS = ['FLUX', 'Kling', 'Higgsfield'] as const;
type Provider = typeof PROVIDERS[number];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewJobModal({ open, onClose }: Props) {
  const models = useQuery(api.models.getAll) ?? [];
  const createManualJob = useMutation(api.contentGen.createManualJob);

  const [selectedModelId, setSelectedModelId] = useState<Id<'models'> | null>(null);
  const [brief, setBrief] = useState('');
  const [provider, setProvider] = useState<Provider>('Kling');
  const [style, setStyle] = useState<Style>('cinematic');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpen() {
    // Reset on open
    setSelectedModelId(null);
    setBrief('');
    setProvider('Kling');
    setStyle('cinematic');
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit() {
    if (!selectedModelId || !brief.trim()) return;
    const model = models.find(m => m._id === selectedModelId);
    if (!model) return;

    setLoading(true);
    setError(null);
    try {
      await createManualJob({
        modelName: model.name,
        brief: brief.trim(),
        provider,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!selectedModelId && brief.trim().length > 0 && !loading;

  return (
    <AnimatePresence onExitComplete={handleOpen}>
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
            style={{ background: 'rgba(0,0,0,0.45)' }}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed z-50 left-1/2 top-1/2 w-[380px]"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="rounded-2xl bg-white p-5 flex flex-col gap-4"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neutral-900">New Job</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Queue a manual generation</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-neutral-100"
                >
                  <X size={14} className="text-neutral-500" />
                </button>
              </div>

              {/* Model picker */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-2 block">
                  Model <span className="text-red-400">*</span>
                </label>
                {models.length === 0 ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-neutral-400"
                    style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <AlertCircle size={13} className="text-neutral-300" />
                    No active models — add talent first
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {models.map(m => {
                      const active = selectedModelId === m._id;
                      return (
                        <button
                          key={m._id}
                          onClick={() => setSelectedModelId(m._id)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left',
                            active ? 'text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-800',
                          )}
                          style={active
                            ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', border: '1.5px solid transparent' }
                            : { backgroundColor: '#f5f5f4', border: '1.5px solid rgba(0,0,0,0.07)' }
                          }
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : m.avatarColor }}
                          >
                            {m.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{m.name}</p>
                            <p className={cn('text-[10px] truncate', active ? 'text-white/70' : 'text-neutral-400')}>
                              {m.niche}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Scene description */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-1.5 block">
                  Scene description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                  placeholder="Describe the scene to generate..."
                  rows={3}
                  className="w-full text-xs text-neutral-700 placeholder-neutral-300 rounded-xl px-3 py-2 resize-none focus:outline-none transition-colors"
                  style={{
                    background: '#f5f5f4',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
              </div>

              {/* Provider picker */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-2 block">Provider</label>
                <div className="flex gap-2">
                  {PROVIDERS.map(p => {
                    const gen = GENERATORS.find(g => g.id === p.toLowerCase().replace('flux', 'flux')) ?? GENERATORS[0];
                    return (
                      <button
                        key={p}
                        onClick={() => setProvider(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                        style={
                          provider === p
                            ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                            : { backgroundColor: '#f5f5f4', color: '#737373' }
                        }
                      >
                        <span className="flex-shrink-0">{gen.icon}</span>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Style picker */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-2 block">Style</label>
                <StyleChips value={style} onChange={setStyle} />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="p-2.5 rounded-lg text-xs text-red-600 flex items-center gap-1.5"
                  style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}
                >
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {error}
                </div>
              )}

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
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-opacity"
                  style={{
                    background: success
                      ? '#10b981'
                      : canSubmit
                        ? 'linear-gradient(135deg, #ff0069, #833ab4)'
                        : 'rgba(255,0,105,0.35)',
                    opacity: loading ? 0.7 : 1,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}
                >
                  {success ? (
                    <>
                      <CheckCircle size={12} />
                      Queued!
                    </>
                  ) : loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <Send size={12} />
                      Queue Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
