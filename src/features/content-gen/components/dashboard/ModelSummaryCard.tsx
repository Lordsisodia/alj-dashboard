'use client';

import type { Doc } from '@/convex/_generated/dataModel';

interface Props {
  model: Doc<'models'>;
  stats: {
    clipsToday: number;
    approved: number;
    blocked: number;
  };
}

export function ModelSummaryCard({ model, stats }: Props) {
  const approvedPct = stats.clipsToday > 0 ? Math.round((stats.approved / stats.clipsToday) * 100) : 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header with avatar */}
      <div className="px-3 pt-3 flex items-center gap-2">
        {/* Avatar — real photo or circle+letter fallback */}
        {/* TODO(schema): real avatarUrl pending */}
        {/* Until models.avatarUrl is added to schema, always use fallback circle+letter */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: model.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {model.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-900 truncate">{model.name}</p>
          <p className="text-[11px] text-neutral-400">
            {stats.clipsToday} today · {stats.approved} approved
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 pb-3 pt-2">
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${approvedPct}%`,
              background: 'linear-gradient(90deg, #10b981, #059669)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
