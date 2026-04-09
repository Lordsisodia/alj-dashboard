'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, CheckCircle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { igThumb } from '@/features/intelligence/utils';
import type { Id } from '@/convex/_generated/dataModel';

interface SendToPipelineModalProps {
  open: boolean;
  post: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PROVIDERS = ['Kling', 'FLUX', 'Higgsfield'] as const;
type Provider = typeof PROVIDERS[number];

export function SendToPipelineModal({ open, post, onClose, onSuccess }: SendToPipelineModalProps) {
  const models = useQuery(api.models.list);
  const createFromPost = useMutation(api.scenes.createFromPost);

  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<Provider>('Kling');
  const [priority, setPriority] = useState(50);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill description when post changes
  function getDefaultDescription(p: any): string {
    if (!p) return '';
    if (p.aiAnalysis?.suggestions?.length) {
      return p.aiAnalysis.suggestions.join(' · ');
    }
    return (p.caption ?? '').slice(0, 200);
  }

  function handleOpen() {
    if (post && !description) {
      setDescription(getDefaultDescription(post));
    }
  }

  async function handleCreate() {
    if (!post || !selectedModelId || !description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createFromPost({
        postId:           post._id as Id<'scrapedPosts'>,
        modelId:          selectedModelId as Id<'models'>,
        sceneDescription: description.trim(),
        provider,
        priorityScore:    priority,
        createdBy:        'Hub / Saved',
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedModelId('');
        setDescription('');
        setPriority(50);
        setProvider('Kling');
        onSuccess();
      }, 1200);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create scene');
    } finally {
      setLoading(false);
    }
  }

  const thumbnailUrl = post?.thumbnailUrl ? igThumb(post.thumbnailUrl) : undefined;
  const isGradient = !post?.thumbnailUrl || !post.thumbnailUrl.startsWith('http');
  const hookScore = post?.aiAnalysis?.hookScore;
  const canSubmit = !!selectedModelId && !!description.trim() && !loading;

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
            style={{ background: 'rgba(0,0,0,0.4)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed z-50 left-1/2 top-1/2 w-[360px]"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="rounded-2xl bg-white p-5 flex flex-col gap-4"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Send to Pipeline</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Create a scene from this saved reel</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-neutral-100"
                >
                  <X size={14} className="text-neutral-500" />
                </button>
              </div>

              {/* Post context */}
              {post && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ aspectRatio: '4/5' }}
                  >
                    {isGradient ? (
                      <div className="w-full h-full" style={{ background: post.thumbnailUrl ?? 'linear-gradient(135deg, #2563eb20, #7c3aed20)' }} />
                    ) : (
                      <img src={thumbnailUrl} alt={post.handle} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 truncate">{post.handle}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{(post.caption ?? '').slice(0, 60)}</p>
                  </div>
                  {hookScore != null && (
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: hookScore >= 7 ? '#16a34a' : hookScore >= 4 ? '#d97706' : '#dc2626' }}
                    >
                      <Zap size={8} />
                      {hookScore.toFixed(1)}
                    </div>
                  )}
                </div>
              )}

              {/* Model picker */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-2 block">
                  Model <span className="text-red-400">*</span>
                </label>
                {models === undefined ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: '#f0f0f0' }} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {models.map(m => {
                      const active = selectedModelId === m._id;
                      return (
                        <button
                          key={m._id}
                          onClick={() => setSelectedModelId(m._id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left"
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
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: m.avatarColor ?? '#2563eb' }}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-neutral-800 truncate">{m.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate">{m.niche}</p>
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
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the scene to generate..."
                  rows={3}
                  className="w-full text-xs text-neutral-700 placeholder-neutral-300 rounded-xl px-3 py-2 resize-none focus:outline-none transition-colors"
                  style={{
                    background: '#f5f5f4',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
              </div>

              {/* Provider select */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 mb-2 block">Provider</label>
                <div className="flex gap-2">
                  {PROVIDERS.map(p => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                      style={
                        provider === p
                          ? { background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }
                          : { backgroundColor: '#f5f5f4', color: '#737373' }
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-neutral-500">Priority</label>
                  <span className="text-[11px] font-bold" style={{ color: '#2563eb' }}>{priority}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={priority}
                  onChange={e => setPriority(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#2563eb' }}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-[11px] text-red-500 text-center">{error}</p>
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
                  onClick={handleCreate}
                  disabled={!canSubmit}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-opacity"
                  style={{
                    background: success
                      ? '#10b981'
                      : canSubmit
                        ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                        : 'rgba(37,99,235,0.35)',
                    opacity: loading ? 0.7 : 1,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}
                >
                  {success ? (
                    <>
                      <CheckCircle size={12} />
                      Created!
                    </>
                  ) : loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <Send size={12} />
                      Create Scene
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
