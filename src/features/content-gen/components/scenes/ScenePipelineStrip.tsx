'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Zap, ImagePlus, Clock, ChevronDown } from 'lucide-react';
import { timeAgo } from '@/components/ui/status-strip';
import type { Doc } from '@/convex/_generated/dataModel';

interface Props {
  blocked:             number;
  ready:               number;
  live:                number;
  awaitingImage:       number;
  lastGeneratedAt:     number; // max createdAt of Done scenes, 0 = never
  models:              Doc<'models'>[];
  modelFilter:         string; // 'all' | model _id
  onModelFilterChange: (id: string) => void;
}

export function ScenePipelineStrip({
  blocked, ready, live, awaitingImage, lastGeneratedAt,
  models, modelFilter, onModelFilterChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const active      = live > 0 || blocked > 0;
  const statusLabel = live > 0
    ? 'Generating'
    : blocked > 0
      ? 'Pipeline building'
      : ready > 0
        ? 'Queue full'
        : 'Idle';

  const selectedModel = models.find(m => m._id === modelFilter);
  const filterLabel   = selectedModel ? selectedModel.name : 'All models';

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl flex-wrap"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Status dot + label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? 'bg-green-400' : 'bg-amber-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-green-500' : 'bg-amber-500'}`} />
        </span>
        <span className="text-[11px] font-semibold" style={{ color: active ? '#22c55e' : '#f59e0b' }}>
          {statusLabel}
        </span>
      </div>

      <span className="text-neutral-200 select-none">|</span>

      {/* Model filter dropdown pill */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 px-2.5 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        >
          {selectedModel && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: selectedModel.avatarColor }}
            />
          )}
          {filterLabel}
          <ChevronDown size={10} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            className="absolute top-full left-0 mt-1.5 rounded-xl py-1 z-50 min-w-[140px]"
            style={{
              background:  '#fff',
              border:      '1px solid rgba(0,0,0,0.09)',
              boxShadow:   '0 4px 20px rgba(0,0,0,0.10)',
            }}
          >
            <button
              onClick={() => { onModelFilterChange('all'); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors"
              style={{ color: modelFilter === 'all' ? '#111' : '#6b7280' }}
            >
              All models
            </button>
            {models.map(m => (
              <button
                key={m._id}
                onClick={() => { onModelFilterChange(m._id); setOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors"
                style={{ color: modelFilter === m._id ? '#111' : '#6b7280' }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.avatarColor }} />
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="text-neutral-200 select-none">|</span>

      {/* Blocked */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 flex-shrink-0">
        <AlertCircle size={11} className="text-violet-500" />
        <span>
          <span className="font-semibold" style={{ color: blocked > 0 ? '#dc2626' : '#171717' }}>
            {blocked}
          </span>
          {' '}blocked
        </span>
      </div>

      <span className="text-neutral-200 select-none">|</span>

      {/* Awaiting image */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 flex-shrink-0">
        <ImagePlus size={11} className="text-violet-500" />
        <span>
          <span className="font-semibold text-neutral-800">{awaitingImage}</span>
          {' '}need image
        </span>
      </div>

      {/* Ready to ship — only when non-zero */}
      {ready > 0 && (
        <>
          <span className="text-neutral-200 select-none">|</span>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 flex-shrink-0">
            <CheckCircle2 size={11} className="text-violet-500" />
            <span>
              <span className="font-semibold text-neutral-800">{ready}</span>
              {' '}ready
            </span>
          </div>
        </>
      )}

      {/* Live — only when generating */}
      {live > 0 && (
        <>
          <span className="text-neutral-200 select-none">|</span>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 flex-shrink-0">
            <Zap size={11} className="text-violet-500" />
            <span>
              <span className="font-semibold" style={{ color: '#2563eb' }}>{live}</span>
              {' '}live
            </span>
          </div>
        </>
      )}

      {/* Right slot — last generated */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 ml-auto flex-shrink-0">
        <Clock size={10} className="text-violet-500" />
        <span>
          Last generated:{' '}
          <span className="font-medium text-neutral-700">
            {lastGeneratedAt > 0 ? timeAgo(lastGeneratedAt) : 'never'}
          </span>
        </span>
      </div>
    </motion.div>
  );
}
