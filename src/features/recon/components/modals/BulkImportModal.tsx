'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Candidate } from '../../types';
import { ModalShell, Field, inputCls, inputStyle, NICHES } from './ModalShell';
import { makeCandidate } from './modalHelpers';

export function BulkImportModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (candidates: Candidate[]) => void;
}) {
  const [raw, setRaw]     = useState('');
  const [niche, setNiche] = useState('');

  const handles = raw
    .split(/[\n,]+/)
    .map(h => h.trim().replace(/^@/, ''))
    .filter(Boolean);

  function submit() {
    if (!handles.length || !niche) return;
    onAdd(handles.map(h => makeCandidate(h, niche)));
    onClose();
  }

  return (
    <ModalShell
      title="Bulk Import"
      subtitle="Paste handles (one per line) to add them all as pending candidates"
      onClose={onClose}
      onSubmit={submit}
      submitLabel={handles.length > 0 ? `Import ${handles.length} handle${handles.length > 1 ? 's' : ''}` : 'Import'}
      disabled={!handles.length || !niche}
    >
      <Field label="Handles (one per line)">
        <textarea
          autoFocus
          className={cn(inputCls, 'resize-none h-28 leading-relaxed')}
          style={inputStyle}
          placeholder={'@username1\n@username2\n@username3'}
          value={raw}
          onChange={e => setRaw(e.target.value)}
        />
        {handles.length > 0 && (
          <p className="text-[11px] text-neutral-400 mt-1">
            <span className="font-semibold text-neutral-600">{handles.length}</span> handle{handles.length > 1 ? 's' : ''} detected
          </p>
        )}
      </Field>
      <Field label="Niche (applies to all)">
        <select
          className={cn(inputCls, 'bg-white cursor-pointer')}
          style={inputStyle}
          value={niche}
          onChange={e => setNiche(e.target.value)}
        >
          <option value="">Select niche...</option>
          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </Field>
    </ModalShell>
  );
}
