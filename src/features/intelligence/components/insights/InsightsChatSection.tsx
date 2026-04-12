'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIChatPanel } from '../trends/AIChatPanel';
import { LearningSignal } from './LearningSignal';
import type { InsightsData, TrendsData } from '../../types';

const GRAD = 'linear-gradient(135deg, #ff0069, #833ab4)';

interface Props {
  chatOpen:   boolean;
  setChatOpen: (v: boolean) => void;
  data:       InsightsData | undefined;
  trends:     TrendsData | undefined;
}

export function InsightsChatSection({ chatOpen, setChatOpen, data, trends }: Props) {
  return (
    <div className="col-span-3 flex flex-col gap-3">
      {/* Ask Intelligence card */}
      <div
        className={cn(
          "rounded-xl overflow-hidden border border-black/[0.07]",
          !chatOpen && "shadow-sm shadow-black/5"
        )}
        style={{ backgroundColor: '#fff' }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
              <Sparkles size={11} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-900">Ask Intelligence</p>
              <p className="text-[9px] text-neutral-400">MiniMax - full context</p>
            </div>
          </div>
          {!chatOpen ? (
            <button
              onClick={() => setChatOpen(true)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-white shadow-sm transition-all hover:shadow hover:opacity-90 active:scale-95"
              style={{ background: GRAD }}
            >
              Open
            </button>
          ) : (
            <button
              onClick={() => setChatOpen(false)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-[#ff0069] hover:bg-[#ff006908] transition-colors active:scale-95"
            >
              Close
            </button>
          )}
        </div>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <AIChatPanel
                data={trends}
                insightsData={data}
                onClose={() => setChatOpen(false)}
                embedded
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team Learning card */}
      <div
        className="rounded-xl overflow-hidden border border-black/[0.07]"
        style={{ backgroundColor: '#fff' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}
        >
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
            <Brain size={11} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-900">Team Learning</p>
            <p className="text-[9px] text-neutral-400">Curation signals</p>
          </div>
        </div>
        <div className="px-3 py-3">
          {data && <LearningSignal data={data} />}
        </div>
      </div>
    </div>
  );
}