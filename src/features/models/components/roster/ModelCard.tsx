'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import type { ModelData } from '../../types';
import { PipelineTracker } from '../pipeline/PipelineTracker';
import { ReelGrid } from '../pipeline/ReelGrid';

export function ModelCard({ model, index }: { model: ModelData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{model.name}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: model.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)',
                  color: model.status === 'Active' ? '#16a34a' : '#737373',
                }}
              >
                {model.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{model.niche}</p>
            <a
              href={`https://onlyfans.com/${model.handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 hover:underline"
              style={{ color: model.color }}
            >
              <ExternalLink size={9} />
              {model.handle}
            </a>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-semibold text-neutral-700">
              {model.reelsInPipeline} reel{model.reelsInPipeline !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-neutral-400">in pipeline</p>
          </div>

          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/[0.04]"
          >
            <ChevronRight
              size={13}
              className={`text-neutral-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        <PipelineTracker currentStep={model.pipelineStep} color={model.color} />
      </div>

      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mt-3 mb-1">
            Recent Reels
          </p>
          <ReelGrid color={model.color} />
        </div>
      )}
    </motion.div>
  );
}
