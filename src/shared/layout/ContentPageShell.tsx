'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BadgeTag } from '@/components/ui/badge-tag';
import { CreatePresetModal } from '@/isso/ui/CreatePresetModal';

// ─── Animated double-pill stat ────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string | number }) {
  const isNumber = typeof value === 'number';
  const [displayed, setDisplayed] = useState(isNumber ? 0 : value);

  useEffect(() => {
    if (!isNumber) return;
    const target = value as number;
    const duration = 1400;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(ease(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, isNumber]);

  const formatted = isNumber
    ? (displayed as number).toLocaleString()
    : (value as string);

  return (
    <BadgeTag
      className="ml-3 flex-shrink-0"
      tag={<span className="text-[11px] text-neutral-500 font-medium">{label}</span>}
      label={<span className="font-semibold text-neutral-700">{formatted}</span>}
    />
  );
}

// ─── Add Filter dropdown ──────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  icon?: ReactNode;
  badge?: string;        // e.g. "Meta Only"
}

export interface FilterCategory {
  id: string;
  label: string;
  icon: ReactNode;
  options?: FilterOption[];
}

function SavedFiltersPanel({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <Search size={12} className="text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Saved Filters..."
            className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
          />
        </div>

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <ChevronRight size={12} className="rotate-180" />
          Back
        </button>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-4 py-6 gap-3 text-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <SlidersHorizontal size={18} className="text-neutral-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-800">No Discovery presets yet</p>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Create and save your favorite<br />filter combinations to access<br />them quickly later.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <Plus size={13} />
            Create new preset
          </button>
        </div>
      </div>

      {createOpen && (
        <CreatePresetModal
          onClose={() => setCreateOpen(false)}
          onSave={(name, filters) => {
            // TODO: persist to Convex
            console.log('New preset:', name, filters);
            setCreateOpen(false);
          }}
        />
      )}
    </>
  );
}

// ─── Category sub-panel ───────────────────────────────────────────────────────

function CategoryPanel({
  category,
  onBack,
  onSelect,
}: {
  category: FilterCategory;
  onBack: () => void;
  onSelect: (value: string) => void;
}) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 40); }, []);

  const options = (category.options ?? []).filter(o =>
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <Search size={12} className="text-neutral-400 flex-shrink-0" />
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${category.label}s…`}
          className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
        />
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <ChevronRight size={12} className="rotate-180" />
        Back
      </button>

      {/* Options list */}
      <div className="py-1 max-h-64 overflow-y-auto">
        {options.length === 0 ? (
          <p className="px-3 py-3 text-xs text-neutral-400 text-center">No options found</p>
        ) : (
          options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {opt.icon && (
                  <span className="flex-shrink-0 w-4 flex items-center justify-center">
                    {opt.icon}
                  </span>
                )}
                {opt.value}
              </div>
              {opt.badge && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#e8f0fe', color: '#1a73e8' }}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── AddFilterPill ────────────────────────────────────────────────────────────

function AddFilterPill({ categories }: { categories: FilterCategory[] }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<'main' | 'saved' | string>('main');
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
        setPanel('main');
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  useEffect(() => {
    if (open && panel === 'main') setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, panel]);

  const filtered = categories.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  function handleCategoryClick(cat: FilterCategory) {
    setSearch('');
    if (cat.id === 'saved') {
      setPanel('saved');
    } else if (cat.options && cat.options.length > 0) {
      setPanel(cat.id);
    }
    // categories with no options: no-op for now
  }

  function goBack() { setPanel('main'); setSearch(''); }

  const activeCategory = categories.find(c => c.id === panel);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(v => !v); if (open) { setPanel('main'); setSearch(''); } }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
          open
            ? 'bg-black/[0.07] text-neutral-800'
            : 'text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04]',
        )}
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <SlidersHorizontal size={12} />
        Add Filter
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] w-56 rounded-xl z-50 overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {panel === 'saved' ? (
            <SavedFiltersPanel onBack={goBack} />
          ) : panel !== 'main' && activeCategory ? (
            <CategoryPanel
              category={activeCategory}
              onBack={goBack}
              onSelect={() => { setOpen(false); setPanel('main'); setSearch(''); }}
            />
          ) : (
            <>
              {/* Search */}
              <div
                className="flex items-center gap-2 px-3 py-2.5"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
              >
                <Search size={12} className="text-neutral-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-xs text-neutral-800 placeholder:text-neutral-400 bg-transparent outline-none"
                />
              </div>

              {/* Category list */}
              <div className="py-1">
                {filtered.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-neutral-400 text-center">No filters found</p>
                ) : (
                  filtered.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-neutral-700 hover:bg-black/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-neutral-400 flex-shrink-0 w-4 flex items-center justify-center">
                          {cat.icon}
                        </span>
                        {cat.label}
                      </div>
                      <ChevronRight size={12} className="text-neutral-300 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContentTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface ActionDropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface FilterChip {
  id: string;
  label: string;
}

export interface ContentPageShellProps {
  // Top header
  icon?: ReactNode;
  title: string;
  stat?: { label: string; value: string | number };
  searchPlaceholder?: string;
  searchShortcut?: string;
  // Primary action button
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  actionDropdownItems?: ActionDropdownItem[];
  // Sub-nav tabs
  tabs?: ContentTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  // Next product in pipeline (renders after last tab with arrow)
  nextProduct?: { label: string; icon: ReactNode; href?: string };
  // Filter bar
  filterCategories?: FilterCategory[];   // drives Add Filter dropdown
  filterChips?: FilterChip[];            // right-side sort chips
  activeFilter?: string;
  onFilterChange?: (id: string) => void;
  filterRightSlot?: ReactNode;           // custom element on the right (e.g. DateRangePill)
  // View toggle (grid / list) — controlled
  showViewToggle?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  // Content
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContentPageShell({
  icon,
  title,
  stat,
  searchPlaceholder = 'Search...',
  searchShortcut = '⌘K',
  actionLabel = 'New',
  actionIcon,
  onAction,
  actionDropdownItems,
  tabs,
  activeTab,
  onTabChange,
  nextProduct,
  filterCategories,
  filterChips,
  activeFilter,
  onFilterChange,
  filterRightSlot,
  showViewToggle = false,
  viewMode: viewModeProp,
  onViewModeChange,
  children,
}: ContentPageShellProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewModeInternal, setViewModeInternal] = useState<'grid' | 'list'>('grid');
  const viewMode = viewModeProp ?? viewModeInternal;
  const setViewMode = (m: 'grid' | 'list') => { setViewModeInternal(m); onViewModeChange?.(m); };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const hasDropdown = actionDropdownItems && actionDropdownItems.length > 0;
  const showFilterBar = filterCategories || filterChips || showViewToggle || filterRightSlot;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-4 px-3 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        {/* Left: icon + title + stat pill */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          {icon && <span className="flex-shrink-0 text-neutral-500">{icon}</span>}
          <span className="text-sm font-semibold text-neutral-900 whitespace-nowrap">{title}</span>
          {stat && <StatPill label={stat.label} value={stat.value} />}
        </div>

        {/* Centre: search */}
        <div className="absolute left-1/2 -translate-x-1/2 w-80 pointer-events-none">
          <div
            className="w-full flex items-center gap-2 px-3 h-9 rounded-xl pointer-events-auto"
            style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <Search size={13} className="text-neutral-400 flex-shrink-0" />
            <input
              className="flex-1 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none min-w-0"
              placeholder={searchPlaceholder}
            />
            <kbd
              className="text-[10px] text-neutral-400 px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)', fontFamily: 'inherit' }}
            >
              {searchShortcut}
            </kbd>
          </div>
        </div>

        <div className="flex-1" />

        {/* Right: action button + optional dropdown */}
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <div
            className="flex items-center h-9 rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <button
              onClick={onAction}
              className="flex items-center gap-1.5 px-4 h-full text-sm font-semibold text-white hover:brightness-105 transition-all active:scale-95"
            >
              {actionIcon ?? <Plus size={14} />}
              {actionLabel}
            </button>
            {hasDropdown && (
              <>
                <div className="w-px h-5 bg-white/25" />
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center justify-center w-8 h-full text-white hover:brightness-105 transition-all"
                >
                  <ChevronDown
                    size={13}
                    className={cn('transition-transform duration-150', dropdownOpen && 'rotate-180')}
                  />
                </button>
              </>
            )}
          </div>

          {dropdownOpen && hasDropdown && (
            <div
              className="absolute right-0 top-11 w-48 rounded-xl py-1 z-50"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.09)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {actionDropdownItems!.map(item => (
                <button
                  key={item.id}
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 hover:bg-black/[0.04] transition-colors text-left"
                >
                  {item.icon && <span className="text-neutral-400 flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sub-nav tabs ───────────────────────────────────────────── */}
      {tabs && tabs.length > 0 && (
        <div
          className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
              )}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}

          {/* Next product arrow */}
          {nextProduct && (
            <>
              <div className="w-px h-4 mx-1 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.10)' }} />
              <ChevronRight size={13} className="text-neutral-300 flex-shrink-0" />
              <a
                href={nextProduct.href ?? '#'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] transition-all select-none"
                title={`Next: ${nextProduct.label}`}
              >
                <span className="flex-shrink-0 opacity-70">{nextProduct.icon}</span>
                <span>{nextProduct.label}</span>
              </a>
            </>
          )}
        </div>
      )}

      {/* ── Filter bar ─────────────────────────────────────────────── */}
      {showFilterBar && (
        <div
          className="flex items-center justify-between px-3 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          {/* Left: Add Filter pill */}
          {filterCategories ? (
            <AddFilterPill categories={filterCategories} />
          ) : (
            <div />
          )}

          {/* Right: sort chips + view toggle + custom slot */}
          <div className="flex items-center gap-1.5">
            {filterChips?.map(chip => (
              <button
                key={chip.id}
                onClick={() => onFilterChange?.(chip.id)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  activeFilter === chip.id
                    ? 'text-neutral-900 bg-black/[0.07]'
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
                )}
              >
                {chip.label}
              </button>
            ))}

            {filterRightSlot}

            {showViewToggle && (
              <div
                className="flex items-center rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(0,0,0,0.09)' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 transition-colors',
                    viewMode === 'grid' ? 'bg-black/[0.06] text-neutral-700' : 'text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 transition-colors',
                    viewMode === 'list' ? 'bg-black/[0.06] text-neutral-700' : 'text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  <List size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Content area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
