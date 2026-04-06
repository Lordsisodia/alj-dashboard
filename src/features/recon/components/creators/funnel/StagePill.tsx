'use client';

import { motion } from 'framer-motion';
import type { FunnelStage } from './funnelData';

function DropBadge({ from, to }: { from: number; to: number }) {
  return (
    <span className="text-[9px] font-semibold text-neutral-400 tabular-nums">
      {Math.round((to / from) * 100)}%
    </span>
  );
}

export function StagePill({ stage, isActive, onHover, fromCount }: {
  stage: FunnelStage;
  isActive: boolean;
  onHover: (id: string | null) => void;
  fromCount?: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-default select-none flex-1"
      style={{
        backgroundColor: isActive ? `${stage.color}10` : 'transparent',
        border: `1px solid ${isActive ? `${stage.color}30` : 'transparent'}`,
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={() => onHover(stage.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stage.color}15`, color: stage.color }}>
        {stage.icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-neutral-900 tabular-nums leading-none">{stage.count.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-neutral-400">{stage.unit}</span>
        </div>
        <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{stage.label}</p>
      </div>
      {fromCount && isActive && (
        <div className="ml-auto flex-shrink-0">
          <DropBadge from={fromCount} to={stage.count} />
        </div>
      )}
    </motion.div>
  );
}
