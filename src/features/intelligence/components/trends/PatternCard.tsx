'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fadeUp, NICHE_COLORS } from '../../constants';
import type { PatternCluster } from '../../types';

const HANDLE_COLORS = ['#ff0069', '#833ab4', '#4a9eff', '#78c257', '#fcaf45', '#06b6d4', '#f97316', '#8b5cf6'];

function handleColor(handle: string): string {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) hash = handle.charCodeAt(i) + ((hash << 5) - hash);
  return HANDLE_COLORS[Math.abs(hash) % HANDLE_COLORS.length];
}

function AccountChip({ handle }: { handle: string }) {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 -ml-1 first:ml-0 ring-1 ring-white" style={{ backgroundColor: handleColor(handle) }} title={handle}>
      {handle.replace('@', '').charAt(0).toUpperCase()}
    </div>
  );
}

function ExpandedPosts({ cluster }: { cluster: PatternCluster }) {
  const router = useRouter();
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">Top posts in pattern</p>
        {cluster.posts.map(p => (
          <div key={p._id.toString()} className="flex items-start gap-2 rounded-lg p-2" style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-neutral-700 leading-snug line-clamp-2">{p.hook}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] text-neutral-400">{p.handle}</span>
                <span className="text-[9px] font-semibold px-1 py-0.5 rounded text-white" style={{ backgroundColor: NICHE_COLORS[p.niche] ?? '#833ab4' }}>{p.niche}</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/content-gen/ideas?${new URLSearchParams({ niche: p.niche, format: p.contentType, hook: p.hook, from: p.handle }).toString()}`)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              <Sparkles size={9} />Brief<ArrowRight size={9} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function PatternCard({ cluster, index }: { cluster: PatternCluster; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isAbove = cluster.multiplier >= 1;

  return (
    <motion.div variants={fadeUp} className="rounded-xl p-4 space-y-3 cursor-pointer" style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }} onClick={() => setExpanded(v => !v)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-neutral-800 truncate">{cluster.theme}</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">{cluster.postCount} post{cluster.postCount !== 1 ? 's' : ''} · {cluster.handles.length} account{cluster.handles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold" style={isAbove ? { backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a' } : { backgroundColor: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>
          {isAbove ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {cluster.multiplier.toFixed(1)}× avg
        </div>
      </div>

      <div className="flex items-center">
        {cluster.handles.slice(0, 6).map(h => <AccountChip key={h} handle={h} />)}
        {cluster.handles.length > 6 && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold -ml-1 ring-1 ring-white" style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' }}>
            +{cluster.handles.length - 6}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-neutral-400">Avg ER</span>
          <span className="font-semibold" style={{ color: isAbove ? '#16a34a' : '#9ca3af' }}>
            {(cluster.avgER * 100).toFixed(1)}% vs {(cluster.baselineER * 100).toFixed(1)}% baseline
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: isAbove ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'rgba(0,0,0,0.15)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((cluster.multiplier / 3) * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} className="text-neutral-300" />
        </motion.div>
      </div>

      <AnimatePresence>{expanded && <ExpandedPosts cluster={cluster} />}</AnimatePresence>
    </motion.div>
  );
}
