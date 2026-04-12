'use client';

import { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { X } from 'lucide-react';

import { api } from '@/convex/_generated/api';

export function ManualGenerateDrawer({ onClose }: { onClose: () => void }) {
  const models = useQuery(api.models.getAll) ?? [];
  const [modelName, setModelName] = useState('');
  const [provider, setProvider] = useState<'FLUX' | 'Kling' | 'Higgsfield'>('Kling');
  const [brief, setBrief] = useState('');
  const [startingImageUrl, setStartingImageUrl] = useState('');
  const [referenceVideoUrl, setReferenceVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const dispatchKling = useAction(api.replicate.dispatchKlingJob);

  const handleSubmit = async () => {
    if (!modelName || brief.length < 10 || !startingImageUrl || !referenceVideoUrl) return;
    setIsDispatching(true);
    setError('');
    try {
      await dispatchKling({
        modelName,
        brief,
        provider,
        startingImageUrl,
        referenceVideoUrl,
        mode: 'pro',
        characterOrientation: 'video',
        keepOriginalSound: false,
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to dispatch job';
      setError(message);
      console.error('Dispatch error:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Manual Generate</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Close"
          >
            <X size={16} className="text-neutral-400" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Model</label>
          <select
            value={modelName}
            onChange={e => setModelName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs"
            style={{ borderColor: 'rgba(0,0,0,0.09)' }}
          >
            <option value="">Select a model</option>
            {models.map(model => (
              <option key={model._id} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Provider</label>
          <select
            value={provider}
            onChange={e => setProvider(e.target.value as 'FLUX' | 'Kling' | 'Higgsfield')}
            className="w-full px-3 py-2 rounded-lg border text-xs"
            style={{ borderColor: 'rgba(0,0,0,0.09)' }}
          >
            <option value="FLUX">FLUX</option>
            <option value="Kling">Kling</option>
            <option value="Higgsfield">Higgsfield</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Brief</label>
          <textarea
            placeholder="Describe the scene..."
            rows={3}
            value={brief}
            onChange={e => setBrief(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs"
            style={{ borderColor: 'rgba(0,0,0,0.09)' }}
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-lg text-xs text-red-600" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Starting Image URL</label>
          <input
            type="text"
            placeholder="R2 URL of character image"
            value={startingImageUrl}
            onChange={e => setStartingImageUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs"
            style={{ borderColor: 'rgba(0,0,0,0.09)' }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Reference Video URL</label>
          <input
            type="text"
            placeholder="R2 URL of reference video"
            value={referenceVideoUrl}
            onChange={e => setReferenceVideoUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs"
            style={{ borderColor: 'rgba(0,0,0,0.09)' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!modelName || brief.length < 10 || !startingImageUrl || !referenceVideoUrl || isDispatching}
          className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          {isDispatching ? 'Dispatching...' : 'Generate'}
        </button>

        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
