'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { inputCls, inputStyle, NICHES } from './modalHelpers';
import { cn } from '@/lib/utils';

export { inputCls, inputStyle, NICHES };

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function ModalShell({
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel,
  disabled,
  children,
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <h2 className="text-base font-bold text-neutral-900">{title}</h2>
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 -mr-1 -mt-1">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">{children}</div>

        {/* Footer */}
        {onSubmit && (
          <div className="px-6 pb-5 flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={disabled}
              className={cn('px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50')}
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              {submitLabel ?? 'Add'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
