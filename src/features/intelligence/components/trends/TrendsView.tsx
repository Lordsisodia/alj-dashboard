'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { StatsBar }   from './StatsBar';
import { OutlierPanel } from '../qualify/OutlierPanel';
import { QualifyTableView } from '../qualify/QualifyTableView';
import { QualifyKanbanView } from '../qualify/QualifyKanbanView';
import { containerVariants } from '../../constants';

interface Props {
  days:      number;
  metric:    'er' | 'views';
  niche?:    string;
  platform?: string;
}

export function TrendsView({ days: initialDays, metric: initialMetric, niche = 'all', platform = 'all' }: Props) {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [days, setDays] = useState(initialDays);
  const [metric, setMetric] = useState<'er' | 'views'>(initialMetric);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 min-w-0">
      <StatsBar days={days} niche={niche} platform={platform} metric={metric} />

      <div className="relative">
        <div className="pr-80">
          {view === 'table'
            ? <QualifyTableView view={view} onViewChange={setView} days={days} onDaysChange={setDays} metric={metric} onMetricChange={setMetric} niche={niche} platform={platform} />
            : <QualifyKanbanView view={view} onViewChange={setView} days={days} onDaysChange={setDays} niche={niche} platform={platform} />
          }
        </div>
        <OutlierPanel days={days} niche={niche} />
      </div>
    </motion.div>
  );
}
