'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { STAGES } from './funnel/funnelData';
import { StagePill } from './funnel/StagePill';

export function PipelineFunnel() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-xl bg-white px-3 py-2"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1 min-w-0">
            <StagePill
              stage={stage}
              isActive={activeId === stage.id}
              onHover={setActiveId}
              fromCount={i > 0 ? STAGES[i - 1].count : undefined}
            />
            {i < STAGES.length - 1 && (
              <div className="flex flex-col items-center gap-0.5 px-1 flex-shrink-0">
                <ChevronRight size={14} className="text-neutral-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
