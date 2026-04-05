'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, X } from 'lucide-react';
import { FEATURE_REQUESTS, containerVariants, fadeUp } from '../../constants';
import { RequestCard } from './RequestCard';

export function RequestsView() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTitle('');
    setDesc('');
    setShowForm(false);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <AnimatePresence>
        {showForm && (
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
                <button type="button" onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={14} />
                </button>
              </div>
              <input
                className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  // @ts-expect-error focus ring style via CSS variable not typed
                  '--tw-ring-color': 'rgba(255,0,105,0.3)',
                }}
                placeholder="Feature title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full px-3 py-2 rounded-lg text-xs text-neutral-900 outline-none focus:ring-2 transition-shadow resize-none"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  // @ts-expect-error focus ring style via CSS variable not typed
                  '--tw-ring-color': 'rgba(255,0,105,0.3)',
                }}
                placeholder="Describe what you need…"
                rows={3}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                <Send size={11} /> Submit Request
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!showForm && (
        <motion.button
          variants={fadeUp}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          onClick={() => setShowForm(true)}
        >
          <Plus size={12} /> New Request
        </motion.button>
      )}

      {FEATURE_REQUESTS.map(r => (
        <RequestCard key={r.id} request={r} />
      ))}
    </motion.div>
  );
}
