'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { TAG_CATEGORIES } from '../constants';
import type { TagSelection } from '../types';

// Quick presets — one-click annotation combos
const PRESETS: { label: string; tags: TagSelection }[] = [
  {
    label: 'Strong hook',
    tags: { hook: ['Strong hook'], pacing: ['Fast'], tone: ['Aspirational'] },
  },
  {
    label: 'Sensual aesthetic',
    tags: { visual: ['Clean'], tone: ['Sensual'], format: ['Mirror'] },
  },
  {
    label: 'Trending audio',
    tags: { audio: ['Trending sound'], pacing: ['Medium'] },
  },
];

interface QuickAnnotateProps {
  tags:     TagSelection;
  onChange: (tags: TagSelection) => void;
}

export function QuickAnnotate({ tags, onChange }: QuickAnnotateProps) {
  const selectedCount = Object.values(tags).filter(v => v && v.length > 0).length;
  const hasAny = selectedCount > 0;

  function toggle(categoryId: string, option: string) {
    const current = tags[categoryId] ?? [];
    const next = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    onChange({ ...tags, [categoryId]: next });
  }

  function applyPreset(preset: TagSelection) {
    onChange({ ...tags, ...preset });
  }

  function clear() {
    onChange({});
  }

  return (
    <div
      className="rounded-xl overflow-hidden bg-white flex flex-col gap-0"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div>
          <p className="text-xs font-semibold text-neutral-800">Annotations</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Optional — helps train filters</p>
        </div>
        <div className="flex items-center gap-2">
          {hasAny && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }}
            >
              {selectedCount} cat.
            </span>
          )}
          {hasAny && (
            <button
              onClick={clear}
              className="text-neutral-300 hover:text-neutral-500 transition-colors"
              title="Clear all"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Quick presets */}
      <div
        className="px-4 py-2.5 flex items-center gap-1.5 flex-wrap"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}
      >
        <span className="text-[10px] font-bold text-neutral-400 mr-0.5">Quick:</span>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.tags)}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-all hover:bg-neutral-100"
            style={{ border: '1px solid rgba(0,0,0,0.09)', color: '#525252' }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {TAG_CATEGORIES.map(cat => {
          const selected = tags[cat.id] ?? [];
          const filled   = selected.length > 0;
          return (
            <div key={cat.id}>
              <p
                className="text-[10px] font-bold uppercase tracking-wide mb-1.5"
                style={{ color: filled ? '#ff0069' : '#a3a3a3' }}
              >
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-1">
                {cat.options.map(opt => {
                  const active = selected.includes(opt);
                  return (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggle(cat.id, opt)}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all"
                      style={
                        active
                          ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff', border: '1px solid transparent' }
                          : { background: '#fff', color: '#525252', border: '1px solid rgba(0,0,0,0.1)' }
                      }
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
