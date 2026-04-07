'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '../../constants';
import { StatsBar }          from './StatsBar';
import { QualifyTableView }  from '../qualify/QualifyTableView';
import { QualifyKanbanView } from '../qualify/QualifyKanbanView';
import { OutlierPanel }      from '../qualify/OutlierPanel';

interface Props {
  days:          number;
  metric:        'er' | 'views';
  niche?:        string;
  platform?:     string;
  view?:         'table' | 'kanban';
  onViewChange?: (v: 'table' | 'kanban') => void;
}

export function TrendsView({ niche = 'all', platform = 'all', view: viewProp, onViewChange }: Props) {
  const [days, setDays] = useState<number>(30);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const activeView      = viewProp ?? view;
  const setActiveView   = onViewChange ?? setView;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 min-w-0 min-h-0 gap-3"
    >
      <StatsBar days={days} niche={niche} platform={platform} />

      <div className="relative flex-1 min-h-0">
        <div className={activeView === 'kanban' ? '' : 'pr-80'}>
          {activeView === 'table' ? (
            <QualifyTableView
              days={days}
              onDaysChange={setDays}
              niche={niche}
              platform={platform}
            />
          ) : (
            <QualifyKanbanView
              niche={niche}
              platform={platform}
            />
          )}
        </div>
        {activeView === 'table' && <OutlierPanel days={days} niche={niche} />}
      </div>
    </motion.div>
  );
}
