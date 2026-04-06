'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ModelData } from '../../../types';

export function SettingsTab({ model }: { model: ModelData }) {
  const [name, setName]       = useState(model.name);
  const [niche, setNiche]     = useState(model.niche);
  const [handle, setHandle]   = useState(model.handle.replace('@', ''));
  const [igHandle, setIg]     = useState((model.igHandle ?? '').replace('@', ''));
  const [status, setStatus]   = useState<'Active' | 'Paused'>(model.status);
  const [manager, setManager] = useState(model.manager ?? '');
  const [bio, setBio]         = useState(model.bio ?? '');

  const isDirty =
    name !== model.name ||
    niche !== model.niche ||
    handle !== model.handle.replace('@', '') ||
    igHandle !== (model.igHandle ?? '').replace('@', '') ||
    status !== model.status ||
    manager !== (model.manager ?? '') ||
    bio !== (model.bio ?? '');

  const inputCls = "w-full px-3 py-2 rounded-xl text-sm text-neutral-800 outline-none transition-colors focus:ring-2";
  const inputStyle = { border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fff' };

  return (
    <div className="p-4 space-y-4 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4 space-y-4"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <p className="text-sm font-semibold text-neutral-800">Model Settings</p>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Display Name</label>
          <input className={inputCls} style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
        </div>

        {/* Niche */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Niche</label>
          <input className={inputCls} style={inputStyle} value={niche} onChange={e => setNiche(e.target.value)} />
        </div>

        {/* OF Handle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">OnlyFans Handle</label>
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
            <span className="px-3 py-2 text-sm text-neutral-400 bg-neutral-50 border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>@</span>
            <input className="flex-1 px-3 py-2 text-sm text-neutral-800 outline-none bg-white" value={handle} onChange={e => setHandle(e.target.value)} />
          </div>
        </div>

        {/* IG Handle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Instagram Handle</label>
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
            <span className="px-3 py-2 text-sm text-neutral-400 bg-neutral-50 border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>@</span>
            <input className="flex-1 px-3 py-2 text-sm text-neutral-800 outline-none bg-white" value={igHandle} onChange={e => setIg(e.target.value)} />
          </div>
        </div>

        {/* Status toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Status</label>
          <div className="flex gap-2">
            {(['Active', 'Paused'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  status === s
                    ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                    : { border: '1px solid rgba(0,0,0,0.09)', color: '#737373' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Manager */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Manager</label>
          <input className={inputCls} style={inputStyle} value={manager} onChange={e => setManager(e.target.value)} />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-500">Bio</label>
          <textarea
            className={inputCls}
            style={{ ...inputStyle, resize: 'none' }}
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        {/* Save */}
        <button
          disabled={!isDirty}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{
            background: isDirty ? 'linear-gradient(135deg, #ff0069, #833ab4)' : 'rgba(0,0,0,0.12)',
            cursor: isDirty ? 'pointer' : 'not-allowed',
          }}
        >
          Save Changes
        </button>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400" />
          <p className="text-sm font-semibold text-red-500">Danger Zone</p>
        </div>
        <p className="text-xs text-neutral-500">
          {model.status === 'Active'
            ? 'Pausing this model will stop all active pipelines and content generation.'
            : 'Activating this model will resume pipelines and content generation.'}
        </p>
        <button
          className="w-full py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={
            model.status === 'Active'
              ? { backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
              : { backgroundColor: 'rgba(34,197,94,0.08)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }
          }
        >
          {model.status === 'Active' ? 'Pause Model' : 'Activate Model'}
        </button>
      </motion.div>
    </div>
  );
}
