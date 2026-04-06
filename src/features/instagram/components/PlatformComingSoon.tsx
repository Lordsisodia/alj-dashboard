'use client';

import type { ReactNode } from 'react';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { Clock } from 'lucide-react';

interface PlatformComingSoonProps {
  name: string;
  icon: ReactNode;
  gradient: string;
  description: string;
}

export default function PlatformComingSoon({ name, icon, gradient, description }: PlatformComingSoonProps) {
  return (
    <ContentPageShell
      icon={
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      }
      title={name}
      actionLabel="Notify Me"
      actionIcon={<Clock size={14} />}
    >
      <div
        className="flex flex-col items-center justify-center h-full min-h-[480px] gap-6"
        style={{ backgroundColor: '#fafafa' }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
          style={{ background: gradient }}
        >
          <div className="scale-[1.6] text-white">{icon}</div>
        </div>

        {/* Copy */}
        <div className="text-center max-w-sm">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#525252' }}
          >
            <Clock size={11} />
            Coming Soon
          </div>
          <h2 className="text-xl font-bold text-neutral-900">{name} Integration</h2>
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{description}</p>
        </div>

        {/* Notify button */}
        <button
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-95"
          style={{ background: gradient }}
        >
          <Clock size={14} />
          Notify Me When Ready
        </button>
      </div>
    </ContentPageShell>
  );
}
