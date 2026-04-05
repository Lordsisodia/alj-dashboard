export function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl flex-1"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ backgroundColor: color + '14', color }}
      >
        {value}
      </div>
      <span className="text-xs text-neutral-500 font-medium leading-tight">{label}</span>
    </div>
  );
}
