'use client';

import { CheckCircle, Loader, AlertCircle } from 'lucide-react';

export function EnrichDot({ status }: { status: string | null | undefined }) {
  if (status === 'done')      return <CheckCircle size={12} className="text-green-500" />;
  if (status === 'enriching') return <Loader size={12} className="text-blue-400 animate-spin" />;
  if (status === 'error')    return <AlertCircle size={12} className="text-red-400" />;
  return null;
}
