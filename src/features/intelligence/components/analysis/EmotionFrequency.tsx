'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { fadeUp } from '../../constants';

interface EmotionRow { emotion: string; count: number; avgER: number; }
interface Props       { emotions: EmotionRow[]; }

const EMOTION_COLORS: Record<string, string> = {
  motivational: '#833ab4', energetic: '#ff0069', emotional: '#f97316',
  funny: '#eab308', sensual: '#ec4899', aspirational: '#06b6d4',
  relatable: '#22c55e', dramatic: '#ef4444',
};

export function EmotionFrequency({ emotions }: Props) {
  const max = Math.max(...emotions.map(e => e.count), 1);

  return (
    <motion.div variants={fadeUp} className="rounded-xl p-4 space-y-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}>
      <div className="flex items-center gap-2">
        <Zap size={13} className="text-neutral-400" />
        <div>
          <p className="text-xs font-semibold text-neutral-900">Emotion Tags in Top Posts</p>
          <p className="text-[10px] text-neutral-400">Which emotional triggers appear most in analysed outliers?</p>
        </div>
      </div>

      <div className="space-y-2">
        {emotions.map((e, i) => {
          const color = EMOTION_COLORS[e.emotion.toLowerCase()] ?? '#833ab4';
          const w     = (e.count / max) * 100;
          return (
            <div key={e.emotion} className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-neutral-600 capitalize w-24 flex-shrink-0">{e.emotion}</span>
              <div className="flex-1 relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                <motion.div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }} />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500 w-6 text-right">{e.count}</span>
              <span className="text-[9px] text-neutral-400 w-12 text-right">{(e.avgER * 100).toFixed(1)}% ER</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
