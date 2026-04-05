'use client';

import { SEED_CLIPS } from '../../constants';
import { ClipCard } from './ClipCard';

interface LibraryViewProps {
  activeFilter: string;
}

export function LibraryView({ activeFilter }: LibraryViewProps) {
  const filtered = SEED_CLIPS.filter(c => {
    if (activeFilter === 'reels')     return c.status === 'Raw';
    if (activeFilter === 'posts')     return c.status === 'Enhanced';
    if (activeFilter === 'carousels') return c.status === 'In Pipeline';
    return true;
  });

  return (
    <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {filtered.map((clip, i) => (
        <ClipCard key={clip.id} clip={clip} index={i} />
      ))}
    </div>
  );
}
