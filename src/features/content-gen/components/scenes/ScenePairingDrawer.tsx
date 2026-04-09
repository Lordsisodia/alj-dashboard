'use client';

import { useRef, useState } from 'react';
import {
  X, Upload, ImagePlus, Wand2, Play, AlertTriangle,
  CheckCircle2, Loader2, ChevronRight, Plus,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import type { Doc, Id } from '@/convex/_generated/dataModel';

interface Props {
  scene:   Doc<'scenes'>;
  onClose: () => void;
}

// ── Approve & Queue button ────────────────────────────────────────────────────

function ApproveButton({ sceneId, onClose }: { sceneId: Id<'scenes'>; onClose: () => void }) {
  const approve = useMutation(api.scenes.approve);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      await approve({ sceneId, approvedBy: 'user' });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
      style={{ background: '#10b981', color: '#fff' }}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
      Approve &amp; queue
    </button>
  );
}

// ── Starting image status chip ────────────────────────────────────────────────

function ImageStatusChip({ status }: { status: string }) {
  if (status === 'ready')      return <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 size={11} /> Image ready</span>;
  if (status === 'generating') return <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600"><Loader2 size={11} className="animate-spin" /> Generating…</span>;
  if (status === 'failed')     return <span className="flex items-center gap-1 text-[11px] font-medium text-red-500"><AlertTriangle size={11} /> Failed</span>;
  return <span className="flex items-center gap-1 text-[11px] text-neutral-400"><ImagePlus size={11} /> No image yet</span>;
}

// ── Main drawer ───────────────────────────────────────────────────────────────

export function ScenePairingDrawer({ scene, onClose }: Props) {
  const fileInputRef               = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]  = useState(false);

  const updateStartingImage = useMutation(api.scenes.updateStartingImage);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // TODO: replace with R2/Convex storage upload when wired
      const url = URL.createObjectURL(file);
      await updateStartingImage({ sceneId: scene._id, url, status: 'ready' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const imgStatus = scene.startingImageStatus;
  const canApprove = imgStatus === 'ready' && scene.approvalState !== 'approved';
  const isApprovedReady = scene.approvalState === 'approved' && imgStatus === 'ready' && scene.status === 'Pending';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(780px, 90vw)',
          background: '#fff',
          borderLeft: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '-12px 0 48px rgba(0,0,0,0.10)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
              Pairing scene
            </p>
            <h2 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2">
              {scene.sceneDescription || 'Untitled scene'}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Model + provider chips */}
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md text-white bg-neutral-500">
              {scene.modelName}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-md"
              style={{ background: '#ede9fe', color: '#7c3aed' }}
            >
              {scene.provider}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0">

          {/* Left — Reference reel */}
          <div
            className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto"
            style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
              Reference Reel
            </p>

            {/* Video / thumbnail */}
            <div className="flex justify-center">
              <div
                className="rounded-2xl overflow-hidden bg-neutral-900 relative"
                style={{ aspectRatio: '9/16', width: '100%', maxWidth: 240 }}
              >
                {scene.referenceVideoUrl ? (
                  <video
                    src={scene.referenceVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  />
                ) : scene.referenceThumbnailUrl ? (
                  <>
                    <img
                      src={scene.referenceThumbnailUrl}
                      alt="Reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play size={16} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-800">
                    <Play size={20} className="text-neutral-600" />
                    <span className="text-[11px] text-neutral-500">No reference video</span>
                  </div>
                )}
              </div>
            </div>

            {/* Source tag */}
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-md"
                style={{ background: '#f3f4f6', color: '#6b7280' }}
              >
                {scene.sourceType === 'saved_post' ? 'Saved post' : scene.sourceType === 'manual' ? 'Manual' : 'Idea'}
              </span>
              <span className="text-[11px] text-neutral-400">Starting frame drives the generated image pose</span>
            </div>
          </div>

          {/* Right — Starting image + generate */}
          <div className="flex flex-col p-5 gap-5 overflow-y-auto" style={{ width: 'min(300px, 40%)' }}>

            {/* ── Starting Image section ── */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                Starting Image
              </p>

              {/* Preview slot */}
              <div
                className="relative rounded-2xl overflow-hidden mb-2.5 w-full mx-auto"
                style={{ aspectRatio: '9/16', maxWidth: 160 }}
              >
                {imgStatus === 'ready' && scene.startingImageUrl ? (
                  <img
                    src={scene.startingImageUrl}
                    alt="Starting image"
                    className="w-full h-full object-cover"
                  />
                ) : imgStatus === 'generating' ? (
                  <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center gap-2">
                    <Loader2 size={18} className="text-blue-400 animate-spin" />
                    <span className="text-[10px] text-blue-500 font-medium">Generating…</span>
                  </div>
                ) : imgStatus === 'failed' ? (
                  <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center gap-2 p-3">
                    <AlertTriangle size={18} className="text-red-400" />
                    <span className="text-[10px] text-red-500 font-medium text-center">Generation failed</span>
                    {scene.startingImageError && (
                      <span className="text-[9px] text-red-400 text-center leading-snug">
                        {scene.startingImageError}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-neutral-100 transition-colors"
                    style={{ border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: '1rem', background: '#fafafa' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus size={18} className="text-neutral-300" />
                    <span className="text-[10px] text-neutral-400">Click to upload</span>
                  </div>
                )}
              </div>

              {/* Status + upload button */}
              <div className="flex items-center justify-between mb-3">
                <ImageStatusChip status={imgStatus} />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || imgStatus === 'generating'}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 hover:bg-neutral-200"
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                {uploading
                  ? <Loader2 size={12} className="animate-spin" />
                  : <Upload size={12} />
                }
                {imgStatus === 'ready' ? 'Replace image' : 'Upload image'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

            {/* ── Generate from Reference section ── */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                Generate from Reference
              </p>
              <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                Pick model reference photos, then generate a starting image
                matching the first frame of the reference reel.
              </p>

              {/* Reference photo picker — UI shell */}
              <div
                className="rounded-xl p-3 mb-3"
                style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <p className="text-[10px] font-semibold text-neutral-400 mb-2">
                  Model reference photos
                </p>
                {/* Empty state — real photos wired in a future phase */}
                <div
                  className="rounded-lg flex flex-col items-center justify-center gap-1.5 py-4"
                  style={{ border: '1.5px dashed rgba(0,0,0,0.10)' }}
                >
                  <span className="text-[10px] text-neutral-300">No reference photos saved yet</span>
                  <button
                    disabled
                    className="flex items-center gap-1 text-[10px] text-neutral-300 opacity-50 cursor-not-allowed"
                  >
                    <Plus size={10} />
                    Add photos
                  </button>
                </div>
              </div>

              {/* Generate button */}
              <button
                disabled
                title="Coming soon - requires model reference photos"
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl',
                  'text-xs font-semibold opacity-40 cursor-not-allowed'
                )}
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
              >
                <Wand2 size={12} />
                Generate from reference
              </button>
              <p className="text-[10px] text-neutral-300 text-center mt-1.5">Coming soon</p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="px-5 py-3 flex items-center gap-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>

          <div className="flex-1" />

          {canApprove && (
            <ApproveButton sceneId={scene._id} onClose={onClose} />
          )}

          {isApprovedReady && (
            <button
              disabled
              title="Send to Generate - wired in a future phase"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold opacity-50 cursor-not-allowed"
              style={{ background: '#1a1a1a', color: '#fff' }}
            >
              Send to Generate
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
