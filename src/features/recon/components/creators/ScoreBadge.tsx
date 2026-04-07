'use client';

interface ScoreBadgeProps {
  score?: number;
  aiVerdict?: 'HIRE' | 'WATCH' | 'PASS' | null;
}

const VERDICT_COLOR: Record<string, string> = {
  HIRE:  '#16a34a',
  WATCH: '#d97706',
  PASS:  '#dc2626',
};

export function ScoreBadge({ score, aiVerdict }: ScoreBadgeProps) {
  const { color, bg } =
    (score ?? 0) >= 80 ? { color: '#16a34a', bg: 'rgba(22,163,74,0.10)'  } :
    (score ?? 0) >= 65 ? { color: '#2563eb', bg: 'rgba(37,99,235,0.10)'  } :
    (score ?? 0) >= 50 ? { color: '#d97706', bg: 'rgba(217,119,6,0.10)'  } :
                          { color: '#dc2626', bg: 'rgba(220,38,38,0.10)'  };

  return (
    <span className="inline-flex items-center gap-1 min-w-0 overflow-hidden">
      {score != null && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums flex-shrink-0"
          style={{ backgroundColor: bg, color }}
        >
          {score}
        </span>
      )}
      {aiVerdict && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide flex-shrink-0"
          style={{ backgroundColor: `${VERDICT_COLOR[aiVerdict]}18`, color: VERDICT_COLOR[aiVerdict] }}
        >
          {aiVerdict}
        </span>
      )}
    </span>
  );
}
