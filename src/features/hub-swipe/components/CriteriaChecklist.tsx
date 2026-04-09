'use client';

import { useState } from 'react';
import { CheckSquare, Square, Target, TrendingUp } from 'lucide-react';

interface Criterion {
  id:    string;
  label: string;
}

const MOTION_CRITERIA: Criterion[] = [
  { id: 'mc1', label: 'Not too many cuts' },
  { id: 'mc2', label: 'Consistent body position' },
  { id: 'mc3', label: 'Clear face visible' },
  { id: 'mc4', label: 'Good lighting - no harsh shadows' },
  { id: 'mc5', label: 'Sensual, not explicit' },
  { id: 'mc6', label: 'Hook lands in ≤3s' },
  { id: 'mc7', label: 'Minimal background distractions' },
];

const VIRALITY_CRITERIA: Criterion[] = [
  { id: 'vc1', label: 'Hook score ≥70' },
  { id: 'vc2', label: 'Trending or recognisable audio' },
  { id: 'vc3', label: 'Strong emotional trigger' },
  { id: 'vc4', label: 'Engagement rate ≥3%' },
  { id: 'vc5', label: 'Shareable / relatable concept' },
  { id: 'vc6', label: 'Holds attention past 3s' },
];

interface ChecklistBoxProps {
  title:    string;
  icon:     React.ReactNode;
  accent:   string;
  items:    Criterion[];
  checked:  Set<string>;
  onToggle: (id: string) => void;
}

function ChecklistBox({ title, icon, accent, items, checked, onToggle }: ChecklistBoxProps) {
  const passed = items.filter(c => checked.has(c.id)).length;

  return (
    <div
      className="rounded-xl overflow-hidden bg-white"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <span style={{ color: accent }}>{icon}</span>
        <span className="text-[11px] font-semibold text-neutral-800 flex-1">{title}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={
            passed === items.length
              ? { background: accent, color: '#fff' }
              : { background: 'rgba(0,0,0,0.06)', color: '#737373' }
          }
        >
          {passed}/{items.length}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">
        {items.map(c => {
          const isChecked = checked.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onToggle(c.id)}
              className="w-full flex items-center gap-2 py-1 text-left group"
            >
              {isChecked
                ? <CheckSquare size={12} style={{ color: accent, flexShrink: 0 }} />
                : <Square      size={12} className="text-neutral-300 flex-shrink-0 group-hover:text-neutral-400 transition-colors" />
              }
              <span
                className="text-[11px] transition-colors"
                style={{ color: isChecked ? '#171717' : '#737373' }}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MotionCriteria() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <ChecklistBox
      title="Motion Control"
      icon={<Target size={12} />}
      accent="#ff0069"
      items={MOTION_CRITERIA}
      checked={checked}
      onToggle={toggle}
    />
  );
}

export function ViralityCriteria() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <ChecklistBox
      title="Virality"
      icon={<TrendingUp size={12} />}
      accent="#7c3aed"
      items={VIRALITY_CRITERIA}
      checked={checked}
      onToggle={toggle}
    />
  );
}

export function CriteriaChecklist() {
  return (
    <div className="flex flex-col gap-3">
      <MotionCriteria />
      <ViralityCriteria />
    </div>
  );
}
