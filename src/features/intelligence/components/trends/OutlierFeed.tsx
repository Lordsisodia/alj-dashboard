'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { fadeUp } from '../../constants';
import { OutlierCard } from './OutlierCard';
import type { OutlierPost } from '../../types';

type Threshold = 1 | 2 | 5 | 10;
type Source    = 'all' | 'competitors' | 'own';

const OWN_HANDLES = new Set(['@abg.ricebunny', '@onlytylerrex', '@rhinxrenx', '@ellamira']);

const THRESHOLD_OPTS: { label: string; value: Threshold }[] = [{ label: '1×', value: 1 }, { label: '2×', value: 2 }, { label: '5×', value: 5 }, { label: '10×', value: 10 }];
const SOURCE_OPTS:    { label: string; value: Source }[]    = [{ label: 'All', value: 'all' }, { label: 'Competitors', value: 'competitors' }, { label: 'Own', value: 'own' }];

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

function TogglePill<T extends string | number>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} className="px-2.5 py-1.5 text-[10px] font-semibold transition-colors" style={value === o.value ? { background: GRAD, color: '#fff' } : { color: '#9ca3af' }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function OutlierFeed({ posts }: { posts: OutlierPost[] }) {
  const [threshold, setThreshold] = useState<Threshold>(1);
  const [source,    setSource]    = useState<Source>('all');

  const filtered = posts
    .filter(p => p.outlierRatio >= threshold)
    .filter(p => source === 'own' ? OWN_HANDLES.has(p.handle) : source === 'competitors' ? !OWN_HANDLES.has(p.handle) : true);

  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}><Flame size={13} className="text-white" /></div>
          <div>
            <p className="text-xs font-semibold text-neutral-900">Outlier Alert Feed</p>
            <p className="text-[10px] text-neutral-400">Posts massively outperforming their baseline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069' }}>{filtered.length} signals</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl gap-2 text-center" style={{ border: '1px dashed rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}>
          <Flame size={20} className="text-neutral-300" />
          <p className="text-xs font-medium text-neutral-500">No outliers at {threshold}× threshold</p>
          <p className="text-[10px] text-neutral-400">Lower the threshold or widen the date range</p>
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {filtered.map((post, i) => <OutlierCard key={post._id.toString()} post={post} rank={i + 1} />)}
          </div>
          {filtered.length > 4 && (
            <div className="absolute right-0 top-0 bottom-2 w-12 flex items-center justify-end pr-1 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))' }}>
              <ChevronRight size={14} className="text-neutral-400" />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
