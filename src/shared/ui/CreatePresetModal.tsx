'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, SlidersHorizontal, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Filter options per category ─────────────────────────────────────────────

const FILTER_OPTIONS: Record<string, string[]> = {
  format:          ['Reel', 'Post', 'Carousel', 'Story'],
  niche:           ['GFE', 'Fitness', 'Lifestyle', 'ABG', 'Meme', 'Thirst Trap'],
  platform:        ['Instagram', 'TikTok'],
  language:        ['English', 'Spanish', 'Filipino', 'Portuguese'],
  'content-style': ['Raw', 'Cinematic', 'Tutorial', 'Vlog', 'Media and Press'],
  'video-length':  ['Under 15s', '15-30s', '30-60s', '1-3 min', '3+ min'],
};

const CATEGORY_LABELS: Record<string, string> = {
  format:          'Format',
  niche:           'Niche',
  platform:        'Platform',
  language:        'Language',
  'content-style': 'Content Style',
  'video-length':  'Video Length',
};

const CATEGORY_ORDER = ['format', 'niche', 'platform', 'language', 'content-style', 'video-length'];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppliedFilter {
  categoryId: string;
  categoryLabel: string;
  value: string;
}

// ─── Mini filter picker (inline in modal) ────────────────────────────────────

function FilterPicker({
  applied,
  onAdd,
  onClose,
  triggerRef,
}: {
  applied: AppliedFilter[];
  onAdd: (f: AppliedFilter) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [step, setStep] = useState<'categories' | 'options'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position below the trigger button
  useEffect(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, [triggerRef]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) onClose();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose, triggerRef]);

  const filteredCategories = CATEGORY_ORDER.filter(id =>
    CATEGORY_LABELS[id].toLowerCase().includes(search.toLowerCase())
  );

  function pickCategory(id: string) {
    setSelectedCategory(id);
    setStep('options');
    setSearch('');
  }

  function pickOption(value: string) {
    if (!selectedCategory) return;
    onAdd({
      categoryId: selectedCategory,
      categoryLabel: CATEGORY_LABELS[selectedCategory],
      value,
    });
    onClose();
  }

  const options = selectedCategory
    ? (FILTER_OPTIONS[selectedCategory] ?? []).filter(o =>
        o.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div
      ref={ref}
      className="fixed w-52 rounded-xl z-[200] overflow-hidden"
      style={{
        top: pos.top,
        left: pos.left,
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.09)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        {step === 'options' && (
          <button onClick={() => { setStep('categories'); setSearch(''); }} className="flex-shrink-0">
            <ChevronLeft size={12} className="text-neutral-400" />
          </button>
        )}
        <Search size={12} className="text-neutral-400 flex-shrink-0" />
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={step === 'categories' ? 'Search filters...' : `Search ${CATEGORY_LABELS[selectedCategory!]}...`}
          className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
        />
      </div>

      <div className="py-1 max-h-48 overflow-y-auto">
        {step === 'categories'
          ? filteredCategories.map(id => (
              <button
                key={id}
                onClick={() => pickCategory(id)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                {CATEGORY_LABELS[id]}
                <ChevronRight size={11} className="text-neutral-300" />
              </button>
            ))
          : options.map(opt => (
              <button
                key={opt}
                onClick={() => pickOption(opt)}
                className="w-full text-left px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                {opt}
              </button>
            ))
        }
      </div>
    </div>
  );
}

// ─── CreatePresetModal ────────────────────────────────────────────────────────

export function CreatePresetModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (name: string, filters: AppliedFilter[]) => void;
}) {
  const [name, setName] = useState('');
  const [filters, setFilters] = useState<AppliedFilter[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const addFilterBtnRef = useRef<HTMLButtonElement>(null);

  function removeFilter(idx: number) {
    setFilters(f => f.filter((_, i) => i !== idx));
  }

  function addFilter(f: AppliedFilter) {
    // replace if same category already applied
    setFilters(prev => {
      const without = prev.filter(p => p.categoryId !== f.categoryId);
      return [...without, f];
    });
  }

  const canCreate = name.trim().length > 0;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-[440px] rounded-2xl"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <SlidersHorizontal size={14} className="text-neutral-500" />
            </div>
            <span className="text-sm font-semibold text-neutral-900">Create New Filter Preset</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/[0.06] transition-colors"
          >
            <X size={14} className="text-neutral-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* Preset name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700">Preset Name</label>
            <div
              className="flex items-center gap-2 px-3 h-10 rounded-xl"
              style={{
                border: `1px solid ${name.length > 0 ? 'rgba(255,0,105,0.4)' : 'rgba(0,0,0,0.12)'}`,
                backgroundColor: '#fafafa',
              }}
            >
              <input
                autoFocus
                maxLength={30}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter preset name"
                className="flex-1 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none"
              />
              <span className="text-[10px] text-neutral-400 flex-shrink-0">{name.length}/30</span>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            {/* Applied filter rows */}
            {filters.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 w-28 flex-shrink-0">{f.categoryLabel}</span>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-700"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  {f.value}
                  <button
                    onClick={() => removeFilter(i)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Filter button */}
            <div className="relative">
              <button
                ref={addFilterBtnRef}
                onClick={() => setPickerOpen(v => !v)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium transition-colors',
                  pickerOpen ? 'text-neutral-800' : 'text-neutral-500 hover:text-neutral-700',
                )}
              >
                <SlidersHorizontal size={12} />
                Add Filter
              </button>

              {pickerOpen && (
                <FilterPicker
                  applied={filters}
                  onAdd={addFilter}
                  onClose={() => setPickerOpen(false)}
                  triggerRef={addFilterBtnRef}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
        >
          <button
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canCreate}
            onClick={() => { if (canCreate) { onSave?.(name.trim(), filters); onClose(); } }}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              canCreate
                ? 'text-white hover:brightness-105 active:scale-95'
                : 'text-neutral-400 cursor-not-allowed',
            )}
            style={canCreate ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : { backgroundColor: '#f3f4f6' }}
          >
            Create Preset
          </button>
        </div>
      </div>
    </div>
  );
}
