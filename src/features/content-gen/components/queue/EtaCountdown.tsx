'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface Props { initialSeconds: number }

export function EtaCountdown({ initialSeconds }: Props) {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    setSecs(initialSeconds);
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const label = m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${secs}s`;

  return (
    <span className="flex items-center gap-1 text-xs text-neutral-400 tabular-nums">
      <Clock size={11} />
      {label}
    </span>
  );
}
