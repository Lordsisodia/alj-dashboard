'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Preset = 'last7' | 'last14' | 'last30' | 'last90' | 'last365' | 'all';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface PresetOption {
  id: Preset;
  label: string;
  getDays: () => number | null; // null = all time
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS: PresetOption[] = [
  { id: 'last7',   label: 'Last 7 days',   getDays: () => 7   },
  { id: 'last14',  label: 'Last 14 days',  getDays: () => 14  },
  { id: 'last30',  label: 'Last 30 days',  getDays: () => 30  },
  { id: 'last90',  label: 'Last 90 days',  getDays: () => 90  },
  { id: 'last365', label: 'Last 365 days', getDays: () => 365 },
  { id: 'all',     label: 'All time',      getDays: () => null },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** 0 = Mon … 6 = Sun (matches our header) */
function getFirstDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}

function presetToRange(preset: Preset): DateRange {
  const opt = PRESETS.find(p => p.id === preset)!;
  const days = opt.getDays();
  if (days === null) return { from: null, to: null };
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from, to };
}

function formatLabel(preset: Preset, range: DateRange): string {
  if (preset === 'all') return 'All Time';
  const opt = PRESETS.find(p => p.id === preset);
  return opt?.label ?? 'All Time';
}

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  year,
  month,
  range,
  onDayClick,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  range: DateRange;
  onDayClick: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);
  const daysInPrev = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  // Build 42-cell grid (6 rows × 7 cols)
  const cells: { day: number; current: boolean }[] = [];
  for (let i = 0; i < offset; i++) {
    cells.push({ day: daysInPrev - offset + 1 + i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - daysInMonth - offset + 1, current: false });
  }

  function isInRange(d: Date) {
    if (!range.from || !range.to) return false;
    return d >= range.from && d <= range.to;
  }

  function isEndpoint(d: Date) {
    return (
      (range.from && d.toDateString() === range.from.toDateString()) ||
      (range.to   && d.toDateString() === range.to.toDateString())
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3 min-w-[220px]">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={onPrev}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors"
        >
          <ChevronLeft size={13} className="text-neutral-500" />
        </button>
        <span className="text-xs font-semibold text-neutral-800">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={onNext}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/[0.06] transition-colors"
        >
          <ChevronRight size={13} className="text-neutral-500" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d, i) => (
          <div key={i} className="h-7 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-neutral-400">{d}</span>
          </div>
        ))}

        {/* Day cells */}
        {cells.map((cell, i) => {
          const date = new Date(year, month + (cell.current ? 0 : cell.day > 15 ? -1 : 1), cell.day);
          const inRange = isInRange(date);
          const endpoint = isEndpoint(date);

          return (
            <button
              key={i}
              onClick={() => cell.current && onDayClick(date)}
              className={cn(
                'h-7 w-full flex items-center justify-center text-[11px] rounded-md transition-colors',
                !cell.current && 'text-neutral-300 cursor-default',
                cell.current && !inRange && !endpoint && 'text-neutral-600 hover:bg-black/[0.05]',
                inRange && !endpoint && 'bg-[#ff0069]/10 text-[#ff0069] rounded-none',
                endpoint && 'bg-[#ff0069] text-white font-semibold',
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DateRangePill ────────────────────────────────────────────────────────────

export function DateRangePill({
  onChange,
}: {
  onChange?: (range: DateRange, preset: Preset) => void;
}) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>('all');
  const [pending, setPending] = useState<Preset>('all');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [pendingRange, setPendingRange] = useState<DateRange>({ from: null, to: null });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        // reset pending to committed
        setPending(preset);
        setPendingRange(presetToRange(preset));
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [preset]);

  function selectPreset(p: Preset) {
    setPending(p);
    setPendingRange(presetToRange(p));
  }

  function handleDayClick(d: Date) {
    // first click = from, second = to
    if (!pendingRange.from || (pendingRange.from && pendingRange.to)) {
      setPendingRange({ from: d, to: null });
      setPending('all'); // custom range, no preset label
    } else {
      const from = pendingRange.from;
      if (d < from) {
        setPendingRange({ from: d, to: from });
      } else {
        setPendingRange({ from, to: d });
      }
    }
  }

  function handleApply() {
    setPreset(pending);
    onChange?.(pendingRange, pending);
    setOpen(false);
  }

  function handleCancel() {
    setPending(preset);
    setPendingRange(presetToRange(preset));
    setOpen(false);
  }

  const label = formatLabel(preset, presetToRange(preset));

  return (
    <div ref={ref} className="relative">
      {/* Pill button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
          open
            ? 'bg-black/[0.07] text-neutral-800'
            : 'text-neutral-600 hover:text-neutral-800 hover:bg-black/[0.04]',
        )}
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
      >
        <Calendar size={12} />
        {label}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] rounded-xl z-50 overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            minWidth: '420px',
          }}
        >
          <div className="flex" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            {/* Left: presets */}
            <div
              className="flex flex-col py-2 min-w-[150px] flex-shrink-0"
              style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
            >
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p.id)}
                  className={cn(
                    'flex items-center justify-between px-4 py-2.5 text-xs transition-colors text-left',
                    pending === p.id
                      ? 'text-neutral-900 font-medium'
                      : 'text-neutral-600 hover:bg-black/[0.04]',
                  )}
                >
                  {p.label}
                  {pending === p.id && <Check size={12} className="text-neutral-500 flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Right: calendar */}
            <MiniCalendar
              year={calYear}
              month={calMonth}
              range={pendingRange}
              onDayClick={handleDayClick}
              onPrev={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                else setCalMonth(m => m - 1);
              }}
              onNext={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                else setCalMonth(m => m + 1);
              }}
            />
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Info size={11} />
              Only show posts saved between these dates
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  pendingRange.from || pending !== 'all'
                    ? 'text-white'
                    : 'text-neutral-300 cursor-not-allowed',
                )}
                style={
                  pendingRange.from || pending !== 'all'
                    ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' }
                    : { backgroundColor: '#f3f4f6' }
                }
                disabled={!pendingRange.from && pending === 'all'}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
