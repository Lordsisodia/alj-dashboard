'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterPill, ActiveChip } from './FilterPill';

// -- Types ---------------------------------------------------------------------

export interface NumericRange {
  min: number;
  max: number;
}

export interface CreatorFilters {
  niche:      string[];
  platform:   string[];
  followers:  NumericRange;
  following:  NumericRange;
  posts:      string;
  engRate:    NumericRange;
  score:      NumericRange;
  health:     string;
  status:     string[];
}

export const DEFAULT_FILTERS: CreatorFilters = {
  niche: [], platform: [], followers: { min: 0, max: Infinity }, following: { min: 0, max: Infinity },
  posts: '', engRate: { min: 0, max: Infinity }, score: { min: 0, max: Infinity },
  health: '', status: [],
};

export function hasActiveFilters(f: CreatorFilters) {
  return f.niche.length > 0 || f.platform.length > 0
    || f.followers.min > 0 || f.followers.max < Infinity
    || f.following.min > 0 || f.following.max < Infinity
    || f.posts
    || f.engRate.min > 0 || f.engRate.max < Infinity
    || f.score.min > 0 || f.score.max < Infinity
    || f.health || f.status.length > 0;
}

// -- Filter options ------------------------------------------------------------

const NICHE_OPTS    = ['GFE','Fitness','Lifestyle','ABG','Cosplay','Alt','Unknown'].map(v => ({ value: v }));
const PLATFORM_OPTS = ['Instagram','TikTok','Twitter / X'].map(v => ({ value: v }));
const HEALTH_OPTS   = [
  { value: 'critical', label: 'Needs enrichment  (< 25%)' },
  { value: 'partial',  label: 'Partial  (25 - 74%)' },
  { value: 'healthy',  label: 'Healthy  (75%+)' },
];
const STATUS_OPTS   = ['Active','Paused'].map(v => ({ value: v }));
export const POSTS_OPTS    = [
  { value: 'under-100', label: '< 100' },
  { value: '100-500',   label: '100 - 500' },
  { value: 'over-500',  label: '500 +' },
];

// -- Range filter pill ---------------------------------------------------------

function fmtNum(n: number, suffix = '') {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K${suffix}`;
  return `${n}${suffix}`;
}

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (range: NumericRange) => void;
}

function RangeFilter({ label, min: glMin, max: glMax, step, suffix = '', onChange }: RangeFilterProps) {
  const [open, setOpen]       = useState(false);
  const [lo,   setLo]         = useState(glMin);
  const [hi,   setHi]         = useState(glMax === Infinity ? '' : glMax);

  const isActive = glMin > 0 || glMax < Infinity;

  function handleApply() {
    onChange({ min: lo, max: hi === '' ? Infinity : Number(hi) });
    setOpen(false);
  }

  function handleClear() {
    setLo(0);
    setHi('');
    onChange({ min: 0, max: Infinity });
    setOpen(false);
  }

  const effectiveMax = glMax === Infinity ? Math.max(Number(hi) || 500000, 100000) : glMax;

  return (
    <div className="relative">
      <button
        onClick={() => { setLo(glMin); setHi(glMax === Infinity ? '' : glMax); setOpen(v => !v); }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap border ${
          isActive
            ? 'bg-[#ff006910] text-[#ff0069] border-[#ff006930]'
            : 'text-neutral-600 hover:text-neutral-800 hover:bg-black/[0.04] border-transparent hover:border-neutral-200'
        }`}
      >
        {isActive
          ? `${fmtNum(glMin, suffix)} - ${glMax === Infinity ? '∞' : fmtNum(glMax, suffix)}`
          : label}
        <SlidersHorizontal size={10} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] min-w-[220px] rounded-xl py-3 px-3 z-50"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">{label}</p>

          {/* Dual slider */}
          <div className="px-1 mb-4">
            <div className="relative h-4 flex items-center">
              <div className="absolute left-0 right-0 h-1 rounded-full bg-neutral-200" />
              <div
                className="absolute h-1 rounded-full bg-[#ff0069]"
                style={{
                  left:  `${Math.min(lo, hi === '' ? lo : Number(hi)) / effectiveMax * 100}%`,
                  right: `${hi === '' ? 0 : Math.max(0, (1 - Number(hi) / effectiveMax) * 100)}%`,
                }}
              />
              <input
                type="range"
                min={0} max={effectiveMax} step={step}
                value={lo}
                onChange={e => setLo(Math.min(Number(e.target.value), hi === '' ? Number(e.target.value) : Number(hi)))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#ff0069] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab"
              />
              <input
                type="range"
                min={0} max={effectiveMax} step={step}
                value={hi === '' ? effectiveMax : Number(hi)}
                onChange={e => setHi(String(Math.max(Number(hi === '' ? effectiveMax : hi), Number(e.target.value))))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#ff0069] [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab"
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-neutral-400">
              <span>0</span>
              <span>{glMax === Infinity ? '∞' : fmtNum(glMax, suffix)}</span>
            </div>
          </div>

          {/* Custom inputs */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wide text-neutral-400 mb-1 block">Min</label>
              <input
                type="number"
                value={lo}
                onChange={e => setLo(Number(e.target.value))}
                placeholder="0"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none"
              />
            </div>
            <span className="text-neutral-300 mt-3">–</span>
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wide text-neutral-400 mb-1 block">Max</label>
              <input
                type="number"
                value={hi}
                onChange={e => setHi(e.target.value)}
                placeholder="∞"
                className="w-full px-2 py-1 text-xs rounded-md border border-neutral-200 focus:border-[#ff0069] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleClear} className="flex-1 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 transition-colors border border-neutral-200">Clear</button>
            <button onClick={handleApply} className="flex-1 py-1.5 rounded-lg text-xs text-white font-medium" style={{ backgroundColor: '#ff0069' }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

// -- Main filter bar -----------------------------------------------------------

interface CreatorsFilterBarProps {
  filters: CreatorFilters;
  onChange: (f: CreatorFilters) => void;
}

export function CreatorsFilterBar({ filters, onChange }: CreatorsFilterBarProps) {
  function set<K extends keyof CreatorFilters>(key: K, val: CreatorFilters[K]) {
    onChange({ ...filters, [key]: val });
  }

  const active = hasActiveFilters(filters);

  function rangeChip(label: string, r: NumericRange, suffix = '') {
    if (r.min === 0 && r.max === Infinity) return null;
    return { label: `${fmtNum(r.min, suffix)} - ${r.max === Infinity ? '∞' : fmtNum(r.max, suffix)}`, clear: () => set(label as 'followers', { min: 0, max: Infinity }) };
  }

  const chips: { label: string; clear: () => void }[] = [
    ...filters.niche.map(v => ({ label: v, clear: () => set('niche', filters.niche.filter(x => x !== v)) })),
    ...filters.platform.map(v => ({ label: v, clear: () => set('platform', filters.platform.filter(x => x !== v)) })),
    ...([rangeChip('Followers', filters.followers)] .filter(Boolean) as { label: string; clear: () => void }[]),
    ...([rangeChip('Following', filters.following)] .filter(Boolean) as { label: string; clear: () => void }[]),
    ...([rangeChip('EngRate', filters.engRate, '%')].filter(Boolean) as { label: string; clear: () => void }[]),
    ...([rangeChip('Score', filters.score)]         .filter(Boolean) as { label: string; clear: () => void }[]),
    ...(filters.posts ? [{ label: POSTS_OPTS.find(o => o.value === filters.posts)?.label ?? filters.posts, clear: () => set('posts', '') }] : []),
    ...(filters.health ? [{ label: HEALTH_OPTS.find(o => o.value === filters.health)?.label ?? filters.health, clear: () => set('health', '') }] : []),
    ...filters.status.map(v => ({ label: v, clear: () => set('status', filters.status.filter(x => x !== v)) })),
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Pill row */}
      <div className="flex items-center gap-1.5 px-5 py-2 border-b flex-wrap" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <SlidersHorizontal size={12} className="text-neutral-400 flex-shrink-0 mr-0.5" />
        <FilterPill label="Niche"           options={NICHE_OPTS}     value={filters.niche}     multi onChange={v => set('niche', v as string[])} />
        <FilterPill label="Platform"        options={PLATFORM_OPTS}  value={filters.platform}  multi onChange={v => set('platform', v as string[])} />
        <RangeFilter label="Followers"  min={filters.followers.min}  max={filters.followers.max}  step={1000}  suffix=""  onChange={v => set('followers', v)} />
        <RangeFilter label="Following"  min={filters.following.min}  max={filters.following.max}  step={100}   suffix=""  onChange={v => set('following', v)} />
        <FilterPill  label="Posts"          options={POSTS_OPTS}    value={filters.posts}            onChange={v => set('posts', v as string)} />
        <RangeFilter label="Eng. Rate"  min={filters.engRate.min}    max={filters.engRate.max}    step={0.1}  suffix="%" onChange={v => set('engRate', v)} />
        <RangeFilter label="Score"      min={filters.score.min}      max={filters.score.max}      step={1}    suffix=""  onChange={v => set('score', v)} />
        <FilterPill  label="Profile Health" options={HEALTH_OPTS}   value={filters.health}          onChange={v => set('health', v as string)} />
        <FilterPill  label="Status"         options={STATUS_OPTS}   value={filters.status}    multi onChange={v => set('status', v as string[])} />

        {active && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors ml-auto"
          >
            <X size={10} />
            Clear all
          </button>
        )}
      </div>

      {/* Active chips */}
      {chips.length > 0 && (
        <div className="flex items-center gap-1.5 px-5 pb-1 flex-wrap">
          {chips.map((chip, i) => (
            <ActiveChip key={i} label={chip.label} onRemove={chip.clear} />
          ))}
        </div>
      )}
    </div>
  );
}
