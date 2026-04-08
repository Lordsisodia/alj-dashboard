'use client';

import { ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Candidate } from '../../../types';

interface DetailActionsProps {
  candidate: Candidate;
  alreadyTracked: boolean;
  approving: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function DetailActions({ candidate, alreadyTracked, approving, onApprove, onReject }: DetailActionsProps) {
  return (
    <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      {!alreadyTracked ? (
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', backgroundColor: 'rgba(239,68,68,0.04)' }}
          >
            <XCircle size={12} /> Reject
          </button>
          <button
            onClick={onApprove}
            disabled={approving}
            className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {approving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
            {approving ? 'Adding...' : 'Approve → Track'}
          </button>
        </div>
      ) : (
        <a
          href={`https://instagram.com/${candidate.handle.replace('@', '')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
          style={{ border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <ExternalLink size={10} /> View on Instagram
        </a>
      )}
    </div>
  );
}
