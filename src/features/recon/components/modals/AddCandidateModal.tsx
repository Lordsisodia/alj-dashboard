'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Candidate } from '../../types';
import { ModalShell, Field, inputCls, inputStyle, NICHES } from './ModalShell';
import { makeCandidate } from './modalHelpers';

export function AddCandidateModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (candidate: Candidate) => void;
}) {
  const [handle, setHandle] = useState('');
  const [niche, setNiche]   = useState('');

  function submit() {
    const h = handle.trim();
    if (!h || !niche) return;
    onAdd(makeCandidate(h, niche));
    onClose();
  }

  return (
    <ModalShell
      title="Add to Discovery"
      subtitle="Adds the profile as a pending candidate for review"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="Add to Queue"
      disabled={!handle.trim() || !niche}
    >
      <Field label="Instagram / TikTok handle">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none">@</span>
          <input
            autoFocus
            className={cn(inputCls, 'pl-7')}
            style={inputStyle}
            placeholder="username"
            value={handle}
            onChange={e => setHandle(e.target.value.replace('@', ''))}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
        </div>
      </Field>
      <Field label="Niche">
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
