'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import { FilterPill, ActiveChip } from './FilterPill';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreatorFilters {
  niche:      string[];
  platform:   string[];
  followers:  string;
  following:  string;
  posts:      string;
  engRate:    string;
  score:      string;
  health:     string;
  status:     string[];
}

export const DEFAULT_FILTERS: CreatorFilters = {
  niche: [], platform: [], followers: '', following: '', posts: '', engRate: '', score: '', health: '', status: [],
};

export function hasActiveFilters(f: CreatorFilters) {
  return f.niche.length > 0 || f.platform.length > 0 || f.followers || f.following || f.posts || f.engRate || f.score || f.health || f.status.length > 0;
}

// ── Filter options ────────────────────────────────────────────────────────────

const NICHE_OPTS     = ['GFE','Fitness','Lifestyle','ABG','Cosplay','Alt','Unknown'].map(v => ({ value: v }));
const PLATFORM_OPTS  = ['Instagram','TikTok','Twitter / X'].map(v => ({ value: v }));
const FOLLOWERS_OPTS = [{ value: 'under-100k', label: 'Under 100K' }, { value: '100k-500k', label: '100K - 500K' }, { value: 'over-500k', label: '500K+' }];
const ENG_OPTS       = [{ value: 'under-2', label: 'Under 2%' }, { value: '2-5', label: '2% - 5%' }, { value: 'over-5', label: '5%+' }];
const SCORE_OPTS     = [{ value: 'low', label: 'Low  (< 50)' }, { value: 'mid', label: 'Mid  (50 - 70)' }, { value: 'high', label: 'High (70+)' }];
const HEALTH_OPTS    = [{ value: 'critical', label: 'Needs enrichment  (< 25%)' }, { value: 'partial', label: 'Partial  (25 - 74%)' }, { value: 'healthy', label: 'Healthy  (75%+)' }];
const STATUS_OPTS    = ['Active','Paused'].map(v => ({ value: v }));

// ── Main filter bar ───────────────────────────────────────────────────────────

interface CreatorsFilterBarProps {
  filters: CreatorFilters;
  onChange: (f: CreatorFilters) => void;
}

export function CreatorsFilterBar({ filters, onChange }: CreatorsFilterBarProps) {
  function set<K extends keyof CreatorFilters>(key: K, val: CreatorFilters[K]) {
    onChange({ ...filters, [key]: val });
  }

  const active = hasActiveFilters(filters);

  const chips: { label: string; clear: () => void }[] = [
    ...filters.niche.map(v => ({ label: v, clear: () => set('niche', filters.niche.filter(x => x !== v)) })),
    ...filters.platform.map(v => ({ label: v, clear: () => set('platform', filters.platform.filter(x => x !== v)) })),
    ...(filters.followers ? [{ label: FOLLOWERS_OPTS.find(o => o.value === filters.followers)?.label ?? filters.followers, clear: () => set('followers', '') }] : []),
    ...(filters.engRate   ? [{ label: ENG_OPTS.find(o => o.value === filters.engRate)?.label ?? filters.engRate,           clear: () => set('engRate', '') }] : []),
    ...(filters.score     ? [{ label: SCORE_OPTS.find(o => o.value === filters.score)?.label ?? filters.score,             clear: () => set('score', '') }] : []),
    ...(filters.health    ? [{ label: HEALTH_OPTS.find(o => o.value === filters.health)?.label ?? filters.health,         clear: () => set('health', '') }] : []),
    ...filters.status.map(v => ({ label: v, clear: () => set('status', filters.status.filter(x => x !== v)) })),
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Pill row */}
      <div className="flex items-center gap-1.5 px-5 py-2 border-b flex-wrap" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <SlidersHorizontal size={12} className="text-neutral-400 flex-shrink-0 mr-0.5" />
        <FilterPill label="Niche"          options={NICHE_OPTS}     value={filters.niche}     multi onChange={v => set('niche', v as string[])} />
        <FilterPill label="Platform"       options={PLATFORM_OPTS}  value={filters.platform}  multi onChange={v => set('platform', v as string[])} />
        <FilterPill label="Followers"      options={FOLLOWERS_OPTS} value={filters.followers}       onChange={v => set('followers', v as string)} />
        <FilterPill label="Eng. Rate"      options={ENG_OPTS}       value={filters.engRate}         onChange={v => set('engRate', v as string)} />
        <FilterPill label="Score"          options={SCORE_OPTS}     value={filters.score}           onChange={v => set('score', v as string)} />
        <FilterPill label="Profile Health" options={HEALTH_OPTS}    value={filters.health}          onChange={v => set('health', v as string)} />
        <FilterPill label="Status"         options={STATUS_OPTS}    value={filters.status}    multi onChange={v => set('status', v as string[])} />

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
