'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { PanelPreview } from './PanelPreview';
import { PanelForm } from './PanelForm';
import { PanelChecklist } from './PanelChecklist';
import { AVATAR_COLORS, GRAD } from '../constants';
import { completionPct } from '../utils';
import type { ModelDoc, PanelState } from '../types';

interface Props {
  initial?: ModelDoc;
  onClose: () => void;
  onSave: (data: PanelState) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function ModelPanel({ initial, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<PanelState>({
    name:        initial?.name        ?? '',
    niche:       initial?.niche       ?? 'GFE',
    ofHandle:    initial?.ofHandle    ?? '',
    igHandle:    initial?.igHandle    ?? '',
    avatarColor: initial?.avatarColor ?? AVATAR_COLORS[0],
    active:      initial?.active      ?? false,
    bio:         initial?.bio         ?? '',
  });
  const [saving, setSaving]   = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const pct    = completionPct(form);
  const isEdit = !!initial;

  function onChange<K extends keyof PanelState>(k: K, v: PanelState[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      className="fixed right-0 top-0 bottom-0 w-[400px] bg-white z-50 flex flex-col"
      style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', borderLeft: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-neutral-900">
            {isEdit ? 'Edit Model' : 'Add Model'}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: pct === 100 ? '#d1fae5' : '#f5f5f4',
              color: pct === 100 ? '#065f46' : '#a3a3a3',
            }}
          >
            {pct}% complete
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.05] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <PanelPreview
          avatarColor={form.avatarColor}
          name={form.name}
          preview={preview}
          dragging={dragging}
          active={form.active}
          onFileSelect={handleFile}
          onDragOver={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
        />
        <PanelForm form={form} onChange={onChange} />
        <PanelChecklist form={form} isEdit={isEdit} onDelete={onDelete} />
      </div>

      {/* Footer */}
      <div
        className="flex gap-2 px-5 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!form.name.trim() || saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: GRAD }}
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Model'}
        </button>
      </div>
    </motion.div>
  );
}
