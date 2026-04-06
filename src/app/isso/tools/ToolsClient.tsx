'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ToolsPage = dynamic(
  () => import('@/features/tools/components/ToolsPage').then(m => ({ default: m.ToolsPage })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={20} className="animate-spin text-neutral-300" />
      </div>
    ),
  }
);

export function ToolsClient() {
  return <ToolsPage />;
}
