'use client';

import { motion } from 'framer-motion';
import { TAG_CATEGORIES } from '../constants';
import type { TagSelection } from '../types';

interface WhyTagPanelProps {
  tags: TagSelection;
  onChange: (tags: TagSelection) => void;
}

function isComplete(tags: TagSelection): boolean {
  return TAG_CATEGORIES.every((cat) => {
    const selected = tags[cat.id];
    return selected && selected.length > 0;
  });
}

export function WhyTagPanel({ tags, onChange }: WhyTagPanelProps) {
  const complete = isComplete(tags);

  function toggleTag(categoryId: string, option: string) {
    const current = tags[categoryId] ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange({ ...tags, [categoryId]: next });
  }

  return (
    <div
      className="flex flex-col gap-0 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.07)', background: '#fafafa' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div>
          <p className="text-xs font-semibold text-neutral-800">Why Tags</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Select at least 1 per category to rate</p>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all"
          style={
            complete
              ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
              : { background: 'rgba(0,0,0,0.06)', color: '#a3a3a3' }
          }
        >
          {complete ? '✓ Ready' : `${TAG_CATEGORIES.filter((c) => (tags[c.id]?.length ?? 0) > 0).length}/${TAG_CATEGORIES.length}`}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {TAG_CATEGORIES.map((cat) => {
          const selected = tags[cat.id] ?? [];
          const filled = selected.length > 0;
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: filled ? '#ff0069' : '#a3a3a3' }}
                >
                  {cat.label}
                </span>
                {filled && (
                  <span className="text-[9px] text-neutral-400">
                    · {selected.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.options.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggleTag(cat.id, opt)}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all"
                      style={
                        active
                          ? {
                              background: 'linear-gradient(135deg, #ff0069, #833ab4)',
                              color: '#fff',
                              border: '1px solid transparent',
                            }
                          : {
                              background: '#fff',
                              color: '#525252',
                              border: '1px solid rgba(0,0,0,0.1)',
                            }
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

export { isComplete as isTagSelectionComplete };
