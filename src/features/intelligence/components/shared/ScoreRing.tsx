'use client';

interface Props { score: number; size?: number; }

export function ScoreRing({ score, size = 56 }: Props) {
  const r     = size * 0.357; // ~20 for size=56
  const circ  = 2 * Math.PI * r;
  const dash  = circ * (score / 10);
  const color = score >= 7 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={size * 0.071} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.071}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute font-bold" style={{ fontSize: size * 0.25, color }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}
