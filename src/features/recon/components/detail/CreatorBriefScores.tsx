'use client';

export function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 10);
  const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-neutral-400 w-20 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums w-5 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">{children}</p>
  );
}
