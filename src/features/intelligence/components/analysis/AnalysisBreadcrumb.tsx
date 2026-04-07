'use client';

import { ChevronLeft } from 'lucide-react';

interface Props {
  current: string;
  onBack: () => void;
}

export function AnalysisBreadcrumb({ current, onBack }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4 text-[11px] text-neutral-400">
      <button
        onClick={onBack}
        className="flex items-center gap-1 hover:text-neutral-700 transition-colors font-medium"
      >
        <ChevronLeft size={11} />
        Analysis
      </button>
      <span>/</span>
      <span className="text-neutral-700 font-semibold">{current}</span>
    </div>
  );
}
