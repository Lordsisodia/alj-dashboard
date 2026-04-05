import { CheckCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <CheckCircle size={24} className="text-neutral-300" />
      </div>
      <p className="text-sm font-medium text-neutral-500">Nothing here</p>
      <p className="text-xs text-neutral-400 mt-0.5">No items match the current filters</p>
    </div>
  );
}
