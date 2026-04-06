'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import type { Priority } from '../../types';
import { PRIORITIES } from './lib';

const inputStyle = {
  backgroundColor: '#fff',
  border: '1px solid rgba(0,0,0,0.1)',
  ['--tw-ring-color' as string]: 'rgba(255,0,105,0.3)',
};

interface Props {
  onClose: () => void;
  onSubmit: (title: string, description: string, priority: Priority) => Promise<void>;
}

export function RequestForm({ onClose, onSubmit }: Props) {
  const [title,      setTitle]      = useState('');
  const [desc,       setDesc]       = useState('');
  const [priority,   setPriority]   = useState<Priority>('Medium');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim(), desc.trim(), priority);
      setTitle(''); setDesc(''); setPriority('Medium');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="overflow-hidden"
    >
      <div
        className="p-4 rounded-xl space-y-3"
        style={{ backgroundColor: 'rgba(255,0,105,0.03)', border: '1px solid rgba(255,0,105,0.15)' }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-900">New Feature Request</p>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={14} />
          </button>
        </div>

        <input
          className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow"
          style={inputStyle}
          placeholder="Feature title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow resize-none"
          style={inputStyle}
          placeholder="Describe what you need..."
          rows={3}
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Priority</p>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9' }}>
            {PRIORITIES.map(p => (
              <button
                key={p} type="button" onClick={() => setPriority(p)}
                className="flex-1 py-1.5 text-xs font-semibold transition-all"
                style={priority === p
                  ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
                  : { background: 'transparent', color: '#6b7280' }}
              >{p}</button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Send size={11} />
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </motion.form>
  );
}
