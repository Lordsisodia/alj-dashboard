'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCardHealth } from './health/cardHealthState';
import { CardBandA } from './card/CardBandA';
import { CardBandB } from './card/CardBandB';
import { CardBandC } from './card/CardBandC';
import { CardBandD } from './card/CardBandD';
import type { ModelData } from '../../types';

export function ModelRosterCard({ model, index }: { model: ModelData; index: number }) {
  const router = useRouter();
  const health = getCardHealth(model);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    border: `1px solid ${health.isContentStale ? 'rgba(245,158,11,0.4)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const contentStyle: React.CSSProperties = health.isPaused ? { opacity: 0.75 } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      whileHover={{ scale: 1.005, boxShadow: '0 6px 20px rgba(0,0,0,0.09)' }}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={cardStyle}
      onClick={() => router.push(`/isso/models/${model.id}`)}
    >
      <div style={contentStyle}>
        <CardBandA model={model} health={health} />
        <CardBandB model={model} health={health} />
        <CardBandC model={model} />
        <CardBandD model={model} health={health} onNavigate={() => router.push(`/isso/models/${model.id}`)} />
      </div>
    </motion.div>
  );
}
