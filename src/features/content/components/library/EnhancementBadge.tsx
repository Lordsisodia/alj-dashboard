'use client';

import { ENHANCEMENT_MAP } from '../../constants';

interface EnhancementBadgeProps {
  id: string;
}

export function EnhancementBadge({ id }: EnhancementBadgeProps) {
  const e = ENHANCEMENT_MAP[id];
  if (!e) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: e.bg, color: e.color }}
    >
      {e.label}
    </span>
  );
}
