'use client';

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const { color, bg } =
    score >= 80 ? { color: '#16a34a', bg: 'rgba(22,163,74,0.10)'  } :
    score >= 65 ? { color: '#2563eb', bg: 'rgba(37,99,235,0.10)'  } :
    score >= 50 ? { color: '#d97706', bg: 'rgba(217,119,6,0.10)'  } :
                  { color: '#dc2626', bg: 'rgba(220,38,38,0.10)'  };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums"
      style={{ backgroundColor: bg, color }}
    >
      {score}
    </span>
  );
}
