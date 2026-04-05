'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import type { ApprovalItem } from '../../types';
import { STATUS_CONFIG, CONTENT_TYPE_ICON } from '../../constants';

interface ApprovalCardProps {
  item: ApprovalItem;
  onOpen: (item: ApprovalItem) => void;
}

export function ApprovalCard({ item, onOpen }: ApprovalCardProps) {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl overflow-hidden cursor-pointer group"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      onClick={() => onOpen(item)}
    >
      {/* Thumbnail */}
      <div
        className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
        style={{ background: item.thumbnailGradient }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors" />
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#525252', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          {CONTENT_TYPE_ICON[item.contentType]}
          {item.contentType}
        </div>
        <div
          className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{ backgroundColor: item.accountColor + '18', color: item.accountColor, border: `1px solid ${item.accountColor}30` }}
        >
          {item.account}
        </div>
        <div>{item.thumbnailIcon}</div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <p className="text-sm text-neutral-800 leading-snug line-clamp-2 mb-2.5">{item.caption}</p>
        <div className="flex items-center gap-1.5 mb-3 text-[11px] text-neutral-400">
          <span>{item.submittedBy}</span>
          <span>·</span>
          <span>{item.submittedAt}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold"
            style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            {cfg.label}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={e => { e.stopPropagation(); onOpen(item); }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              Review
            </button>
            <button
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-black/[0.04]"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <RefreshCw size={11} className="text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
