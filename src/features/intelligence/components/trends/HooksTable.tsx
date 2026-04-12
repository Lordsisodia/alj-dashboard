'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Eye, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fadeUp, NICHE_COLORS } from '../../constants';
import { fmtNum } from '../../utils';
import type { HookRow } from '../../types';

const FORMAT_LABELS: Record<string, string> = { reel: 'Reel', post: 'Post', carousel: 'Carousel', story: 'Story' };
const COLS = '1fr 80px 64px 64px 56px 120px';

function HookRowItem({ hook, index, hovered, onHover, onLeave }: { hook: HookRow; index: number; hovered: boolean; onHover: () => void; onLeave: () => void }) {
  const router = useRouter();
  const color  = NICHE_COLORS[hook.niche] ?? '#833ab4';

  function goToBrief() {
    router.push(`/content-gen/ideas?${new URLSearchParams({ niche: hook.niche, format: hook.contentType, hook: hook.hook, from: hook.handle }).toString()}`);
  }

  return (
    <div className="grid items-center px-4 py-3 transition-colors cursor-default" style={{ gridTemplateColumns: COLS, borderBottom: index > 0 ? '1px solid rgba(0,0,0,0.04)' : undefined, backgroundColor: hovered ? 'rgba(255,0,105,0.025)' : '#fff' }} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className="flex items-start gap-2 min-w-0 pr-4">
        <span className="text-[10px] font-semibold text-neutral-300 mt-0.5 w-3 flex-shrink-0">{index + 1}</span>
        <div className="min-w-0">
          <p className="text-xs text-neutral-800 leading-snug line-clamp-2">{hook.hook}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: color }}>{hook.niche}</span>
            <span className="text-[9px] text-neutral-400 capitalize">{FORMAT_LABELS[hook.contentType] ?? hook.contentType}</span>
          </div>
        </div>
      </div>
      <span className="text-[11px] text-neutral-500 truncate">{hook.handle}</span>
      <div className="flex items-center gap-1"><Heart size={10} className="text-neutral-300" /><span className="text-[11px] text-neutral-700">{fmtNum(hook.likes)}</span></div>
      <div className="flex items-center gap-1"><Eye   size={10} className="text-neutral-300" /><span className="text-[11px] text-neutral-700">{fmtNum(hook.views)}</span></div>
      <span className="text-[11px] font-semibold" style={{ color }}>{(hook.engagementRate * 100).toFixed(1)}%</span>
      <motion.button onClick={goToBrief} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', opacity: hovered ? 1 : 0 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Sparkles size={10} />Turn into Brief<ArrowRight size={10} />
      </motion.button>
    </div>
  );
}

export function HooksTable({ hooks }: { hooks: HookRow[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div variants={fadeUp} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Top Performing Hooks</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Ranked by engagement rate - hover to turn into a brief</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}>{hooks.length} hooks</span>
      </div>
      <div className="grid px-4 py-2" style={{ gridTemplateColumns: COLS, borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}>
        {['Hook', 'Account', 'Likes', 'Views', 'ER', ''].map(h => (
          <span key={h} className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{h}</span>
        ))}
      </div>
      {hooks.length === 0
        ? <div className="flex items-center justify-center py-12 text-xs text-neutral-400">No data yet - check back once posts are scraped.</div>
        : hooks.map((hook, i) => <HookRowItem key={hook._id} hook={hook} index={i} hovered={hoveredId === hook._id} onHover={() => setHoveredId(hook._id)} onLeave={() => setHoveredId(null)} />)
      }
    </motion.div>
  );
}
