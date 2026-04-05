'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Zap } from 'lucide-react';
import type { ClipData } from '../../types';
import { STATUS_STYLE, ENHANCEMENTS } from '../../constants';
import { EnhancementBadge } from './EnhancementBadge';
import { ClipCardActions } from './ClipCardActions';

interface ClipCardProps {
  clip: ClipData;
  index: number;
}

export function ClipCard({ clip, index }: ClipCardProps) {
  const [selected, setSelected] = useState<string[]>(clip.enhancements);
  const statusStyle = STATUS_STYLE[clip.status];

  const toggleEnhancement = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video relative flex items-center justify-center"
        style={{ background: clip.gradient }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          <Play size={14} className="text-white" fill="white" />
        </div>
        <span
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          {clip.duration}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-neutral-800 truncate flex-1" title={clip.filename}>
            {clip.filename}
          </p>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
          >
            {clip.status}
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mb-2">{clip.size}</p>

        {clip.enhancements.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {clip.enhancements.map(id => (
              <EnhancementBadge key={id} id={id} />
            ))}
          </div>
        )}

        <ClipCardActions
          status={clip.status}
          selected={selected}
          onToggle={toggleEnhancement}
        />
      </div>
    </motion.div>
  );
}
