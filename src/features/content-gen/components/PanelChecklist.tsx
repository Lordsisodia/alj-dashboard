'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PanelState } from '../types';

interface Props {
  form: PanelState;
  isEdit: boolean;
  onDelete?: () => Promise<void>;
}

const CHECKLIST = [
  { label: 'Niche set',        key: 'niche'    },
  { label: 'OF handle linked', key: 'ofHandle' },
  { label: 'IG handle linked', key: 'igHandle' },
  { label: 'Style notes',      key: 'bio'      },
] as const;

export function PanelChecklist({ form, isEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  }

  return (
    <div className="px-5 pb-5 space-y-4">
      <div className="rounded-xl p-3.5 space-y-2" style={{ backgroundColor: '#f5f5f4' }}>
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
          Profile checklist
        </span>
        {CHECKLIST.map(({ label, key }) => {
          const done = !!String(form[key] ?? '').trim();
          return (
            <div key={label} className="flex items-center gap-2">
              {done
                ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                : <Circle size={13} className="text-neutral-300 flex-shrink-0" />
              }
              <span className={cn('text-xs', done ? 'text-neutral-700' : 'text-neutral-400')}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {isEdit && onDelete && (
        <div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
              Remove model
            </button>
          ) : (
            <div
              className="rounded-xl p-3 flex items-center justify-between gap-3"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <span className="text-xs text-red-700 font-medium">Delete this model?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded-lg hover:bg-black/[0.05]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
