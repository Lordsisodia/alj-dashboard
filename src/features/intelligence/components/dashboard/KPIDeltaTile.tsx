'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  label:    string;
  value:    string | number;
  delta?:   number;   // positive = up, negative = down, undefined = no comparison
  icon:     React.ReactNode;
  iconBg:   string;
  iconColor: string;
  cta?:     { label: string; onClick: () => void };
}

export function KPIDeltaTile({ label, value, delta, icon, iconBg, iconColor, cta }: Props) {
  const hasDelta  = delta !== undefined;
  const isUp      = (delta ?? 0) > 0;
  const isDown    = (delta ?? 0) < 0;
  const deltaAbs  = Math.abs(delta ?? 0);

  return (
    <motion.div
      className="rounded-xl px-4 py-3.5 flex flex-col gap-2"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
        {hasDelta && (
          <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
            style={isUp
              ? { color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.09)' }
              : isDown
                ? { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.09)' }
                : { color: '#9ca3af', backgroundColor: 'rgba(0,0,0,0.05)' }
            }>
            {isUp ? <TrendingUp size={8} /> : isDown ? <TrendingDown size={8} /> : <Minus size={8} />}
            {isUp ? '+' : isDown ? '-' : ''}{deltaAbs}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-neutral-900 leading-tight">{value}</p>
      </div>
      {cta && (
        <button onClick={cta.onClick}
          className="text-[9px] font-semibold self-start underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: iconColor }}>
          {cta.label} →
        </button>
      )}
    </motion.div>
  );
}
