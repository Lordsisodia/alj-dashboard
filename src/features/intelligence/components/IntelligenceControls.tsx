import { Clock, Tag, Globe } from 'lucide-react';
import { NICHE_COLORS } from '../constants';
import type { FilterCategory } from '@/isso/layout/ContentPageShell';

export type Days   = 7 | 30 | 90;
export type Metric = 'er' | 'views';

const NICHE_OPTIONS = Object.keys(NICHE_COLORS).map(n => ({ value: n }));

export const QUALIFY_FILTERS: FilterCategory[] = [
  { id: 'niche',    label: 'Niche',    icon: <Tag   size={13} />, options: NICHE_OPTIONS },
  { id: 'platform', label: 'Platform', icon: <Globe size={13} />, options: [{ value: 'Instagram' }, { value: 'TikTok' }] },
];

export const ANALYSIS_FILTERS: FilterCategory[] = [
  { id: 'niche', label: 'Niche', icon: <Tag size={13} />, options: NICHE_OPTIONS },
];

export function TimePill({ value, onChange }: { value: Days; onChange: (d: Days) => void }) {
  const opts: { label: string; value: Days }[] = [{ label: '7d', value: 7 }, { label: '30d', value: 30 }, { label: '90d', value: 90 }];
  return (
    <div className="flex items-center gap-1">
      <Clock size={12} className="text-neutral-400" />
      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
        {opts.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)} className="px-2.5 py-1.5 text-[11px] font-semibold transition-colors" style={value === o.value ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' } : { color: '#9ca3af' }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MetricPill({ value, onChange }: { value: Metric; onChange: (v: Metric) => void }) {
  return (
    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
      {(['er', 'views'] as Metric[]).map(m => (
        <button key={m} onClick={() => onChange(m)} className="px-2.5 py-1.5 text-[11px] font-semibold transition-colors" style={value === m ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' } : { color: '#9ca3af' }}>
          {m === 'er' ? 'Eng. Rate' : 'Views'}
        </button>
      ))}
    </div>
  );
}
