'use client';

interface FieldRowProps {
  label: string;
  value: string;
}

export function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-neutral-400">{label}</p>
      <p className="text-sm text-neutral-900">{value}</p>
    </div>
  );
}
