export function SummaryRow({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
      {helper ? <p className="text-xs text-white/60">{helper}</p> : null}
    </div>
  );
}
