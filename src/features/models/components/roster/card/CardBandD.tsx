'use client';

import { ChevronRight } from 'lucide-react';
import type { ModelData } from '../../../types';
import type { CardHealthState } from '../health/cardHealthState';

interface Props {
  model: ModelData;
  health: CardHealthState;
  onNavigate: () => void;
}

const primaryBtnClass =
  'text-[11px] font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all';
const secondaryBtnClass =
  'text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-black/[0.09] text-neutral-600 hover:bg-black/[0.04] active:scale-95 transition-all';

export function CardBandD({ model: _model, health, onNavigate }: Props) {
  const { isOnboarding, isPaused, isNoBrief, pendingApprovals } = health;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate();
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  const OpenBtn = (
    <button
      onClick={handleClick}
      className="ml-auto text-[11px] font-medium text-neutral-400 hover:text-neutral-700 flex items-center gap-1 active:scale-95 transition-all group"
    >
      Open
      <ChevronRight
        size={12}
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </button>
  );

  if (isOnboarding) {
    return (
      <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-black/[0.05]">
        <button
          onClick={stopProp}
          className={primaryBtnClass}
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: 'white' }}
        >
          ↑ Upload Content
        </button>
        <button onClick={stopProp} className={secondaryBtnClass}>
          View Checklist
        </button>
        {OpenBtn}
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-black/[0.05]">
        <button onClick={stopProp} className={secondaryBtnClass}>
          ▶ Reactivate
        </button>
        {OpenBtn}
      </div>
    );
  }

  if (isNoBrief) {
    return (
      <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-black/[0.05]">
        <button onClick={stopProp} className={secondaryBtnClass}>
          ⚠ Add Brief
        </button>
        <button
          onClick={stopProp}
          className={`${primaryBtnClass} group`}
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: 'white' }}
        >
          <span className="inline-flex items-center gap-1">
            → Generate
          </span>
        </button>
        {OpenBtn}
      </div>
    );
  }

  // Default: active with content
  return (
    <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-black/[0.05]">
      <button
        onClick={stopProp}
        className={`${primaryBtnClass} group`}
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: 'white' }}
      >
        <span className="inline-flex items-center gap-1">
          → Generate
        </span>
      </button>
      {pendingApprovals > 0 && (
        <button onClick={stopProp} className={secondaryBtnClass}>
          ✓ Approve
          <span
            className="text-[9px] font-bold px-1 py-0.5 rounded-full ml-1"
            style={{ backgroundColor: '#ff0069', color: 'white' }}
          >
            {pendingApprovals}
          </span>
        </button>
      )}
      {OpenBtn}
    </div>
  );
}
