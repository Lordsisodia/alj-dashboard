'use client';

import { useRef, useState } from 'react';
import {
  X, Upload, ImagePlus, Wand2, Play, AlertTriangle,
  CheckCircle2, Loader2, ChevronRight, Plus, MousePointerClick,
} from 'lucide-react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { PROVIDER_COLORS } from './types';
import type { SceneProvider } from './types';
import { ImportedReferenceCard } from './ImportedReferenceCard';

// ── Model breakdown (empty state) ─────────────────────────────────────────────

function ModelBreakdown({
  allScenes,
  allModels,
}: {
  allScenes: Doc<'scenes'>[];
  allModels: Doc<'models'>[];
}) {
  if (allModels.length === 0) return null;

  return (
    <div className="w-full max-w-xs">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3 text-center">
        By model
      </p>
      <div className="flex flex-col gap-2">
        {allModels.map(model => {
          const modelScenes = allScenes.filter(s => s.modelId === model._id);
          const blocked     = modelScenes.filter(s =>
            s.status !== 'Queued' && s.status !== 'Generating' && s.status !== 'Done'
          ).length;

          return (
            <div
              key={model._id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              {/* Fixed circle avatar */}
              <div
                style={{
                  background:    model.avatarColor,
                  width:         28,
                  height:        28,
                  minWidth:      28,
                  borderRadius:  '50%',
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'center',
                  fontSize:      11,
                  fontWeight:    700,
                  color:         '#fff',
                  flexShrink:    0,
                }}
              >
                {model.name[0]}
              </div>

              <span className="text-xs font-medium text-neutral-700 flex-1 min-w-0 truncate">
                {model.name}
              </span>
              <span className="text-[10px] text-neutral-400 flex-shrink-0">
                {modelScenes.length} scenes
              </span>
              {blocked > 0 && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: '#ede9fe', color: '#7c3aed' }}
                >
                  {blocked} blocked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Image status chip ─────────────────────────────────────────────────────────

function ImageStatusChip({ status }: { status: string }) {
  if (status === 'ready')
    return <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 size={11} />Image ready</span>;
  if (status === 'generating')
    return <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600"><Loader2 size={11} className="animate-spin" />Generating…</span>;
  if (status === 'failed')
    return <span className="flex items-center gap-1 text-[11px] font-medium text-red-500"><AlertTriangle size={11} />Failed</span>;
  return <span className="flex items-center gap-1 text-[11px] text-neutral-400"><ImagePlus size={11} />No image yet</span>;
}

// ── Approve button ────────────────────────────────────────────────────────────

function ApproveButton({ sceneId }: { sceneId: Id<'scenes'> }) {
  const approve           = useMutation(api.scenes.approve);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try { await approve({ sceneId, approvedBy: 'user' }); }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
      style={{ background: '#10b981', color: '#fff' }}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
      Approve &amp; queue
    </button>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface Props {
  scene:      Doc<'scenes'> | null;
  allScenes:  Doc<'scenes'>[];
  allModels:  Doc<'models'>[];
  onDeselect: () => void;
}

export function SceneDetailPanel({ scene, allScenes, allModels, onDeselect }: Props) {
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const updateStartingImage       = useMutation(api.scenes.updateStartingImage);
  const dispatchKling             = useAction(api.replicate.dispatchKlingJob);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !scene) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/content-gen/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      await updateStartingImage({ sceneId: scene._id, url, status: 'ready' });
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!scene) {
    return (
      <div
        className="flex flex-col items-center justify-start gap-6 p-6 rounded-2xl"
        style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', minHeight: 480 }}
      >
        <div className="flex flex-col items-center gap-2 pt-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{ background: '#f3f0ff' }}
          >
            <MousePointerClick size={18} className="text-violet-400" />
          </div>
          <p className="text-sm font-semibold text-neutral-500">Select a scene to pair</p>
          <p className="text-xs text-neutral-400 text-center max-w-[200px] leading-relaxed">
            Click any card on the left to open the pairing interface here
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-xs">
            <div className="h-px w-full mb-6" style={{ background: 'rgba(0,0,0,0.06)' }} />
            <ModelBreakdown allScenes={allScenes} allModels={allModels} />
          </div>
        </div>
      </div>
    );
  }

  // ── Scene selected ───────────────────────────────────────────────────────────
  const imgStatus     = scene.startingImageStatus;
  const canApprove    = imgStatus === 'ready' && scene.approvalState !== 'approved';
  const isReadyToGen  = scene.approvalState === 'approved' && imgStatus === 'ready' && scene.status === 'Pending';
  const providerStyle = PROVIDER_COLORS[scene.provider as SceneProvider];

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', minHeight: 480 }}
    >
      {/* ── Header — kicker + chips only, no description ── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          Pairing scene
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white bg-neutral-500">
            {scene.modelName}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{ background: providerStyle?.bg ?? '#f3f4f6', color: providerStyle?.text ?? '#6b7280' }}
          >
            {scene.provider}
          </span>
          <button
            onClick={onDeselect}
            className="p-1 rounded-lg text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Body — single column ── */}
      <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">

        {/* 1. Your brief */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#059669' }}>
            Your brief
          </p>
          <div
            className="px-3 py-2 rounded-xl"
            style={{ background: '#ecfdf5', border: '1px solid #d1fae5' }}
          >
            <p className="text-[11px] font-medium text-violet-900 leading-snug">
              {scene.sceneDescription || 'No description'}
            </p>
          </div>
        </div>

        {/* 2. Starting Image */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
            Starting Image
          </p>

          {/* Preview slot */}
          <div className="flex justify-center">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ aspectRatio: '9/16', width: '100%', maxWidth: 200 }}
            >
              {imgStatus === 'ready' && scene.startingImageUrl ? (
                <img src={scene.startingImageUrl} alt="Starting" className="w-full h-full object-cover" />
              ) : imgStatus === 'generating' ? (
                <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={16} className="text-blue-400 animate-spin" />
                  <span className="text-[10px] text-blue-500 font-medium">Generating…</span>
                </div>
              ) : imgStatus === 'failed' ? (
                <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center gap-1.5 p-3">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-[10px] text-red-500 font-medium text-center">Failed</span>
                </div>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: '1rem', background: '#fafafa' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus size={16} className="text-neutral-300" />
                  <span className="text-[10px] text-neutral-400">Click to upload</span>
                </div>
              )}
            </div>
          </div>

          <ImageStatusChip status={imgStatus} />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || imgStatus === 'generating'}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 hover:bg-neutral-200"
            style={{ background: '#f3f4f6', color: '#374151' }}
          >
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
            {imgStatus === 'ready' ? 'Replace' : 'Upload image'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* Generate from Reference stub */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mt-3">
            Generate from Reference
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Pick model reference photos, then generate a starting image matching the first frame.
          </p>
          <div
            className="rounded-xl p-2.5"
            style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <p className="text-[10px] font-semibold text-neutral-400 mb-2">Model reference photos</p>
            <div
              className="rounded-lg flex flex-col items-center justify-center gap-1 py-3"
              style={{ border: '1.5px dashed rgba(0,0,0,0.10)' }}
            >
              <span className="text-[10px] text-neutral-300">No reference photos yet</span>
              <button disabled className="flex items-center gap-1 text-[10px] text-neutral-300 opacity-50 cursor-not-allowed">
                <Plus size={9} />Add photos
              </button>
            </div>
          </div>

          <button
            disabled
            title="Coming soon"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold opacity-40 cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
          >
            <Wand2 size={11} />
            Generate from reference
          </button>
        </div>

        {/* 3. Generated Video */}
        {(scene.generatedVideoUrl) && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
              Generated video
            </p>
            <div className="flex justify-center">
              <div
                className="rounded-2xl overflow-hidden bg-neutral-900"
                style={{ aspectRatio: '9/16', width: '100%', maxWidth: 200 }}
              >
                <video
                  src={scene.generatedVideoUrl}
                  className="w-full h-full object-cover rounded"
                  controls
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Original Reel */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
            Original reel
          </p>
          <div className="flex justify-center">
            <div
              className="rounded-2xl overflow-hidden bg-neutral-900"
              style={{ aspectRatio: '9/16', width: '100%', maxWidth: 200 }}
            >
              {scene.referenceVideoUrl ? (
                <video
                  src={scene.referenceVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay loop muted playsInline controls
                />
              ) : scene.referenceThumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={scene.referenceThumbnailUrl}
                    alt="Reference"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play size={13} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-neutral-800">
                  <Play size={16} className="text-neutral-600" />
                  <span className="text-[10px] text-neutral-500">No video yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Analysis */}
        <ImportedReferenceCard scene={scene} />
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-3 flex items-center justify-end gap-2 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        {canApprove && <ApproveButton sceneId={scene._id} />}

        {isReadyToGen && (
          <button
            onClick={async () => {
              if (!scene || !scene.startingImageUrl || !scene.referenceVideoUrl) return;
              const mode = (scene.provider === 'Kling' ? 'pro' : undefined) as 'pro' | 'std' | undefined;
              await dispatchKling({
                sceneId: scene._id,
                modelName: scene.modelName,
                brief: scene.sceneDescription,
                provider: scene.provider as 'FLUX' | 'Kling' | 'Higgsfield',
                startingImageUrl: scene.startingImageUrl,
                referenceVideoUrl: scene.referenceVideoUrl,
                mode: mode ?? 'pro',
                characterOrientation: 'video',
                keepOriginalSound: false,
              });
            }}
            disabled={!scene?.startingImageUrl || !scene?.referenceVideoUrl}
            title={!scene?.startingImageUrl ? "Upload starting image first" : !scene?.referenceVideoUrl ? "Upload reference video first" : "Send to Generate"}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={!scene?.startingImageUrl || !scene?.referenceVideoUrl ? { borderColor: 'rgba(0,0,0,0.09)' } : { background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            Send to Generate <ChevronRight size={12} />
          </button>
        )}

        {!canApprove && !isReadyToGen && (
          <span className="text-[11px] text-neutral-400">
            {imgStatus === 'missing' || imgStatus === 'failed'
              ? 'Upload an image to continue'
              : imgStatus === 'generating'
                ? 'Waiting for image...'
                : 'Already approved'}
          </span>
        )}
      </div>
    </div>
  );
}
