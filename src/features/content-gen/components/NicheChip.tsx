import { NICHES } from '../constants';
import type { Niche } from '../types';

export function NicheChip({ niche }: { niche: Niche }) {
  const cfg = NICHES[niche];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {niche}
    </span>
  );
}
