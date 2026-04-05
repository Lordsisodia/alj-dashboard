'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Sparkles, Clapperboard, Send, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelStage {
  id: string;
  label: string;
  sublabel: string;
  count: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

// ─── Stage data ───────────────────────────────────────────────────────────────

const STAGES: FunnelStage[] = [
  {
    id: 'basket',
    label: 'Basket',
    sublabel: 'Creators tracked',
    count: 8,
    unit: 'creators',
    icon: <Users size={14} />,
    color: '#6b7280',
  },
  {
    id: 'scraped',
    label: 'Scraped',
    sublabel: 'Posts captured today',
    count: 284,
    unit: 'posts',
    icon: <Download size={14} />,
    color: '#4a9eff',
    href: '/isso/recon',
  },
  {
    id: 'refined',
    label: 'Refined',
    sublabel: 'Saved to Hub',
    count: 47,
    unit: 'saved',
    icon: <Sparkles size={14} />,
    color: '#833ab4',
    href: '/isso',
  },
  {
    id: 'generated',
    label: 'Generated',
    sublabel: 'AI clips created',
    count: 12,
    unit: 'clips',
    icon: <Clapperboard size={14} />,
    color: '#ff0069',
    href: '/isso/ideas',
  },
  {
    id: 'posted',
    label: 'Posted',
    sublabel: 'Live this week',
    count: 8,
    unit: 'live',
    icon: <Send size={14} />,
    color: '#78c257',
    href: '/isso/schedule',
  },
];

// ─── Conversion drop badge ────────────────────────────────────────────────────

function DropBadge({ from, to }: { from: number; to: number }) {
  const pct = Math.round((to / from) * 100);
  return (
    <span className="text-[9px] font-semibold text-neutral-400 tabular-nums">
      {pct}%
    </span>
  );
}

// ─── Single stage pill ────────────────────────────────────────────────────────

function StagePill({ stage, isActive, onHover, fromCount }: {
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
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
      >
        {stage.icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-neutral-900 tabular-nums leading-none">
            {stage.count.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-neutral-400">{stage.unit}</span>
        </div>
        <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{stage.label}</p>
      </div>

      {/* Conversion drop (shown when hovered and has a previous stage) */}
      {fromCount && isActive && (
        <div className="ml-auto flex-shrink-0">
          <DropBadge from={fromCount} to={stage.count} />
        </div>
      )}
    </motion.div>
  );
}

// ─── Pipeline Funnel ──────────────────────────────────────────────────────────

export function PipelineFunnel() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-xl bg-white px-3 py-2"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1 min-w-0">
            <StagePill
              stage={stage}
              isActive={activeId === stage.id}
              onHover={setActiveId}
              fromCount={i > 0 ? STAGES[i - 1].count : undefined}
            />
            {i < STAGES.length - 1 && (
              <div className="flex flex-col items-center gap-0.5 px-1 flex-shrink-0">
                <ChevronRight size={14} className="text-neutral-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
