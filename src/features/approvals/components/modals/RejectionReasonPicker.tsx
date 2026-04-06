'use client';

import { motion } from 'framer-motion';

export const REJECTION_REASONS = [
  { id: 'wrong-face',         label: 'Wrong face / likeness',        color: '#dc2626' },
  { id: 'motion-artifact',    label: 'Motion artifact / glitch',     color: '#ea580c' },
  { id: 'off-brand',          label: 'Off-brand visuals',            color: '#d97706' },
  { id: 'wrong-tone',         label: 'Wrong tone / vibe',            color: '#7c3aed' },
  { id: 'bad-lighting',       label: 'Bad lighting / quality',       color: '#0284c7' },
  { id: 'wrong-format',       label: 'Wrong format / aspect ratio',  color: '#059669' },
  { id: 'platform-violation', label: 'Platform guideline violation', color: '#be185d' },
] as const;

export type RejectionReasonId = typeof REJECTION_REASONS[number]['id'];

interface RejectionReasonPickerProps {
  selected: RejectionReasonId[];
  onToggle: (id: RejectionReasonId) => void;
  note: string;
  onNoteChange: (note: string) => void;
}

export function RejectionReasonPicker({ selected, onToggle, note, onNoteChange }: RejectionReasonPickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          Rejection reason <span style={{ color: '#dc2626' }}>*</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {REJECTION_REASONS.map(({ id, label, color }) => {
            const active = selected.includes(id);
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(id)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={active ? {
                  backgroundColor: color + '18',
                  color,
                  border: `1px solid ${color}40`,
                } : {
                  backgroundColor: '#fafafa',
                  color: '#737373',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>
      <textarea
        value={note}
        onChange={e => onNoteChange(e.target.value)}
        placeholder="Additional context (optional)..."
        className="w-full px-3.5 py-3 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 resize-none outline-none transition-all"
        style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.08)' }}
        rows={2}
      />
    </div>
  );
}
