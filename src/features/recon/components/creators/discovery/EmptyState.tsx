'use client';

import { ProductIcon } from '@/shared/layout/ProductIcon';

export function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.06)' }}>
        <ProductIcon product="recon" size={24} />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-1">
        {filter === 'pending' ? 'No pending candidates' : filter === 'approved' ? 'None approved yet' : filter === 'rejected' ? 'None rejected' : 'No candidates yet'}
      </p>
    </div>
  );
}
