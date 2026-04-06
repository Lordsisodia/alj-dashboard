'use client';

interface Stage { label: string; count: number }

interface Props {
  total: number;
  pending: number;
  approved: number;
  tracking: number;
}

export function DiscoveryFunnel({ total, pending, approved, tracking }: Props) {
  const stages: Stage[] = [
    { label: 'Total candidates',    count: total    },
    { label: 'Pending review',      count: pending  },
    { label: 'Approved to track',   count: approved },
    { label: 'Currently tracking',  count: tracking },
  ];

  const max = Math.max(...stages.map(s => s.count), 1);

  const RED_BG    = ['rgba(220,38,38,0.12)', 'rgba(185,28,28,0.12)', 'rgba(239,68,68,0.12)', 'rgba(127,29,29,0.12)'];
  const RED_BAR   = ['#dc2626', '#b91c1c', '#ef4444', '#7f1d1d'];
  const RED_TEXT  = ['#dc2626', '#b91c1c', '#ef4444', '#fca5a5'];

  return (
    <div
      className="rounded-xl bg-white px-4 py-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-3">Pipeline funnel</p>
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const pct = (stage.count / max) * 100;
          return (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-600">{stage.label}</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: RED_TEXT[i] }}>{stage.count}</span>
              </div>
              <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: RED_BG[i] }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: RED_BAR[i] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
