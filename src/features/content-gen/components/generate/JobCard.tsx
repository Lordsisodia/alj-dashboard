'use client';

import { Loader2, Play, CheckCircle2, Send, X } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from './types';
import { jobGenerator, generatorMeta } from './types';

interface Props {
  job: ConvexJob;
  models: ConvexModel[];
  onDismiss: (id: Id<'ideas'>) => void;
}

export function JobCard({ job, models, onDismiss }: Props) {
  const model = models.find(m => m._id === job.modelId);
  const meta  = generatorMeta(jobGenerator(job));

  return (
    <div
      className="flex gap-3 p-3 rounded-2xl group relative transition-all hover:shadow-sm"
      style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div
        className="w-10 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{
          aspectRatio: '9/16',
          background: model
            ? `linear-gradient(135deg, ${model.avatarColor}30, ${model.avatarColor}15)`
            : 'linear-gradient(135deg, rgba(255,0,105,0.12), rgba(131,58,180,0.12))',
        }}
      >
        {job.status === 'generating'
          ? <Loader2 size={12} className="animate-spin" style={{ color: model?.avatarColor ?? '#ff0069' }} />
          : <Play   size={12}                           style={{ color: model?.avatarColor ?? '#ff0069' }} />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-800 leading-snug line-clamp-2">{job.hook}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {model && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: model.avatarColor }}>
              {model.name}
            </span>
          )}
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(131,58,180,0.10)', color: '#833ab4' }}>
            {meta.label}
          </span>
          <span className="text-[10px] text-neutral-400">{job.style}</span>
          {job.status === 'generating' && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-500 ml-auto">
              <Loader2 size={11} className="animate-spin" /> Generating
            </span>
          )}
          {job.status === 'ready' && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 ml-auto">
              <CheckCircle2 size={11} /> Ready
            </span>
          )}
          {job.status === 'sent' && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-blue-500 ml-auto">
              <Send size={11} /> Sent
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDismiss(job._id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-full transition-all"
        style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        <X size={10} className="text-neutral-500" />
      </button>
    </div>
  );
}
