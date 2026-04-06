import type { ReactNode } from 'react';

interface Props {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, hint, required, children }: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-1">
        <label className="text-xs font-semibold text-neutral-600">{label}</label>
        {required && <span className="text-[10px] text-red-400">*</span>}
        {hint && <span className="text-[10px] text-neutral-400 ml-1">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
