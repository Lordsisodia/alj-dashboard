'use client';

interface ProfileHealthBarProps {
  pct: number;
}

export function ProfileHealthBar({ pct }: ProfileHealthBarProps) {
  const color =
    pct >= 70 ? '#16a34a' :
    pct >= 35 ? '#d97706' :
                '#dc2626';

  const bg =
    pct >= 70 ? 'rgba(22,163,74,0.10)' :
    pct >= 35 ? 'rgba(217,119,6,0.10)' :
                'rgba(220,38,38,0.10)';

  return (
    <div className="flex flex-col gap-1">
      <span
        className="inline-flex items-center justify-center w-10 px-1.5 py-0.5 rounded-md text-[11px] font-bold tabular-nums"
        style={{ backgroundColor: bg, color }}
      >
        {pct}%
      </span>
      <div className="w-10 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
