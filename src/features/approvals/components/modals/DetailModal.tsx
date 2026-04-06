'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CheckCircle, RefreshCw, Hash } from 'lucide-react';
import type { ApprovalItem, ApprovalStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants';
import { RejectionReasonPicker, type RejectionReasonId } from './RejectionReasonPicker';
import { PlatformPreviewPanel } from './PlatformPreviewPanel';

interface DetailModalProps {
  item: ApprovalItem | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ApprovalStatus) => void;
}

export function DetailModal({ item, onClose, onStatusChange }: DetailModalProps) {
  const [showRevisionField, setShowRevisionField] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<RejectionReasonId[]>([]);
  const [revisionNote, setRevisionNote] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!item) return null;

  const cfg = STATUS_CONFIG[item.status];

  const toggleReason = (id: RejectionReasonId) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleAction = (action: string) => {
    if (action === 'publish') {
      onStatusChange(item.id, 'published');
    } else if (action === 'approve') {
      onStatusChange(item.id, 'approved');
    } else if (action === 'revision') {
      if (!showRevisionField) { setShowRevisionField(true); return; }
      if (selectedReasons.length === 0) return;
      onStatusChange(item.id, 'revision');
    }
    setActionDone(action);
    setTimeout(() => {
      onClose();
      setActionDone(null);
      setShowRevisionField(false);
      setSelectedReasons([]);
      setRevisionNote('');
    }, 1000);
  };

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden pointer-events-auto"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.accountColor + '14', border: `1px solid ${item.accountColor}28` }}
              >
                <div style={{ color: item.accountColor }}>{item.thumbnailIcon}</div>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.account}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[11px] text-neutral-400">{item.contentType} · {item.submittedAt}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/[0.04]"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <X size={14} className="text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Platform preview */}
            <PlatformPreviewPanel item={item} />

            {/* Hashtags */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Hash size={12} className="text-neutral-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.hashtags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-500"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              Submitted by <span className="font-semibold text-neutral-600">{item.submittedBy}</span> · {item.submittedAt}
            </p>

            {/* Revision reason picker */}
            <AnimatePresence>
              {showRevisionField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <RejectionReasonPicker
                    selected={selectedReasons}
                    onToggle={toggleReason}
                    note={revisionNote}
                    onNoteChange={setRevisionNote}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <AnimatePresence mode="wait">
              {!actionDone ? (
                <motion.div key="actions" className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleAction('publish')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                  >
                    <Check size={14} />
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleAction('approve')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-105"
                    style={{ backgroundColor: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction('revision')}
                    disabled={showRevisionField && selectedReasons.length === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'rgba(234,88,12,0.08)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.18)' }}
                  >
                    <RefreshCw size={14} />
                    {showRevisionField ? 'Send Revision' : 'Request Revision'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.18)' }}
                >
                  <Check size={16} style={{ color: '#16a34a' }} />
                  <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>Done!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
