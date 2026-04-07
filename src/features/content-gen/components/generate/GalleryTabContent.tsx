'use client';

import { Play } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexJob, ConvexModel } from './types';
import { GalleryCard } from './GalleryCard';

interface Props {
  jobs: ConvexJob[];
  models: ConvexModel[];
  onApprove: (id: Id<'ideas'>) => void;
  onSend:    (id: Id<'ideas'>) => void;
  onDismiss: (id: Id<'ideas'>) => void;
}

export function GalleryTabContent({ jobs, models, onApprove, onSend, onDismiss }: Props) {
  const completed = jobs.filter(j => j.status === 'ready' || j.status === 'sent');

  if (completed.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-48 gap-3">
        <Play size={28} className="text-neutral-200" />
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-300 select-none">No completed generations</p>
          <p className="text-xs text-neutral-300 mt-0.5">Generate content to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-4 gap-4">
        {completed.map(job => (
          <GalleryCard
            key={job._id}
            job={job}
            models={models}
            onApprove={onApprove}
            onSend={onSend}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}
