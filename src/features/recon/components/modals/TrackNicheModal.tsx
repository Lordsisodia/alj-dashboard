'use client';

import { Globe } from 'lucide-react';
import { ModalShell } from './ModalShell';

export function TrackNicheModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Track Niche" onClose={onClose}>
      <div className="rounded-xl p-5 text-center space-y-2" style={{ backgroundColor: '#f5f5f4' }}>
        <Globe size={28} className="mx-auto text-neutral-300" />
        <p className="text-sm font-semibold text-neutral-700">Niche auto-discovery</p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Phase 2 - Apify will continuously scan for new profiles in a niche and surface them in your Discovery queue automatically.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          Got it
        </button>
      </div>
    </ModalShell>
  );
}
