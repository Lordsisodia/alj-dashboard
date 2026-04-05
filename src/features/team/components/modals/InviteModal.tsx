'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { ALL_ACCOUNTS } from '../../constants';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'VA' | 'Editor'>('VA');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (acc: string) =>
    setSelected(p => (p.includes(acc) ? p.filter(a => a !== acc) : [...p, acc]));

  const handleSend = () => {
    setName(''); setEmail(''); setRole('VA'); setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl overflow-hidden bg-white"
          style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div>
              <h2 className="text-neutral-900 font-semibold">Invite Member</h2>
              <p className="text-xs mt-0.5 text-neutral-500">They&apos;ll receive an email invitation</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-neutral-100 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jamie Chen"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50"
                style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#ff0069')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. jamie@isso.co"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50"
                style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#ff0069')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-600">Role</label>
              <div className="flex gap-2">
                {(['VA', 'Editor'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: role === r ? 'rgba(255,0,105,0.08)' : '#fafafa',
                      color: role === r ? '#ff0069' : '#6b7280',
                      border: role === r ? '1px solid rgba(255,0,105,0.3)' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-neutral-600">Account Access</label>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_ACCOUNTS.map(acc => {
                  const checked = selected.includes(acc);
                  return (
                    <button
                      key={acc}
                      onClick={() => toggle(acc)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-left transition-all"
                      style={{
                        backgroundColor: checked ? 'rgba(255,0,105,0.06)' : '#fafafa',
                        border: checked ? '1px solid rgba(255,0,105,0.25)' : '1px solid rgba(0,0,0,0.07)',
                        color: checked ? '#ff0069' : '#6b7280',
                      }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: checked ? '#ff0069' : 'transparent',
                          border: checked ? '1px solid #ff0069' : '1px solid #d1d5db',
                        }}
                      >
                        {checked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-neutral-100 text-neutral-600"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!name || !email}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              Send Invite
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
