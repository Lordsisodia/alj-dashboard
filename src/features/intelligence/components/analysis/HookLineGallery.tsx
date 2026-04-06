'use client';

import { motion } from 'framer-motion';
import { Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { NICHE_COLORS } from '../../constants';
import { ScoreRing } from '../shared/ScoreRing';
import { fadeUp } from '../../constants';

interface HookLine { hookLine: string; hookScore: number; handle: string; niche: string; engagementRate: number; }
interface Props     { hookLines: HookLine[]; }

function HookCard({ h, index }: { h: HookLine; index: number }) {
  const [copied, setCopied] = useState(false);
  const color = (NICHE_COLORS as Record<string, string>)[h.niche] ?? '#833ab4';

  function copy() {
    navigator.clipboard.writeText(h.hookLine).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <motion.div
      className="rounded-xl p-3 flex gap-3 items-start"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <ScoreRing score={h.hookScore} size={40} />
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[11px] text-neutral-700 leading-snug italic">"{h.hookLine}"</p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: color }}>{h.niche}</span>
          <span className="text-[9px] text-neutral-400">{h.handle} · {(h.engagementRate * 100).toFixed(1)}% ER</span>
        </div>
      </div>
      <button onClick={copy} className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:bg-black/[0.05]"
        style={{ color: copied ? '#22c55e' : '#9ca3af' }}>
        <Copy size={11} />
      </button>
    </motion.div>
  );
}

export function HookLineGallery({ hookLines }: Props) {
  if (hookLines.length === 0) return null;

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
          <Sparkles size={12} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Top Hook Lines</p>
          <p className="text-[10px] text-neutral-400">Best opening lines by hook score - click to copy</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {hookLines.map((h, i) => <HookCard key={i} h={h} index={i} />)}
      </div>
    </motion.div>
  );
}
