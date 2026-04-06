'use client';

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return <span className="text-xs italic text-neutral-300">--</span>;
  const w = 80, h = 26, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <polyline points={`${pad},${h} ${pts} ${w - pad},${h}`} fill={color} opacity="0.08" />
    </svg>
  );
}
