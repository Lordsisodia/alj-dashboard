'use client';

import { useState, useEffect, useRef } from 'react';

function useCountUp(target: number, duration = 650): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export function MiniStat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const displayed = useCountUp(value);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white flex-1"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-neutral-900 leading-none tabular-nums">{displayed.toLocaleString()}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
