'use client';

import { Play, CheckCircle2, Send, X } from 'lucide-react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from './types';
import { jobGenerator, generatorMeta } from './types';

interface Props {
  job: ConvexJob;
  models: ConvexModel[];
  onApprove: (id: Id<'ideas'>) => void;
  onSend:    (id: Id<'ideas'>) => void;
  onDismiss: (id: Id<'ideas'>) => void;
}

export function GalleryCard({ job, models, onApprove, onSend, onDismiss }: Props) {
  const model = models.find(m => m._id === job.modelId);
  const meta  = generatorMeta(jobGenerator(job));

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
      <div
        className="w-full flex items-center justify-center"
        style={{
          aspectRatio: '9/16',
          background: model
            ? `linear-gradient(160deg, ${model.avatarColor}40 0%, ${model.avatarColor}15 100%)`
            : 'linear-gradient(160deg, rgba(255,0,105,0.20) 0%, rgba(131,58,180,0.10) 100%)',
          backgroundColor: '#f0f0ee',
        }}
      >
        <Play size={22} className="text-neutral-300" />
      </div>

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%)' }}
      >
        {model && (
          <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: model.avatarColor }}>
            {model.name}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <button onClick={() => onApprove(job._id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            <CheckCircle2 size={10} /> Approve
          </button>
          <button onClick={() => onSend(job._id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white/90 hover:bg-white/20 transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Send size={10} /> Send
          </button>
          <button onClick={() => onDismiss(job._id)} className="w-7 flex items-center justify-center py-1.5 rounded-lg hover:bg-white/20 transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <X size={10} className="text-white/70" />
          </button>
        </div>
      </div>

      <div className="px-2.5 py-2" style={{ backgroundColor: '#fafaf9' }}>
        <p className="text-[11px] font-medium text-neutral-700 leading-snug line-clamp-2">{job.hook}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md text-white" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            {meta.label}
          </span>
          <span className="text-[9px] text-neutral-400">{job.style}</span>
        </div>
      </div>
    </div>
  );
}
