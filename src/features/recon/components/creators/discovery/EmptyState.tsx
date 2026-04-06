'use client';

import { Play, Sparkles } from 'lucide-react';

export function EmptyState({ filter, onRunDiscovery }: { filter: string; onRunDiscovery: () => void }) {
  const showRun = filter === 'all' || filter === 'pending';
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(131,58,180,0.08)', color: '#833ab4' }}>
        <Sparkles size={22} />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-1">
        {filter === 'pending' ? 'No pending candidates' : filter === 'approved' ? 'None approved yet' : filter === 'rejected' ? 'None rejected' : 'No candidates yet'}
      </p>
      <p className="text-xs text-neutral-400 max-w-[200px] mb-5">
        {showRun
          ? 'Run Discovery to automatically find new accounts from your tracked creators.'
          : 'Use the filter above to switch views.'}
      </p>
      {showRun && (
        <button
          onClick={onRunDiscovery}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Play size={13} />
          Run Discovery
        </button>
      )}
    </div>
  );
}
