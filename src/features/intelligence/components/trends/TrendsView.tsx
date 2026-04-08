'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { containerVariants } from '../../constants';
import { QualifyTableView }  from '../qualify/QualifyTableView';
import { QualifyKanbanView } from '../qualify/QualifyKanbanView';
import { OutlierPanel }      from '../qualify/OutlierPanel';
import { TrendsLoadingSkeleton } from './TrendsLoadingSkeleton';

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
      className="flex flex-col flex-1 min-w-0 min-h-0 px-4 py-4"
    >
      <div className="relative flex-1 min-h-0 flex flex-col">
        <div className={cn(activeView === 'kanban' ? 'flex flex-col flex-1 min-h-0' : 'flex flex-col flex-1 min-h-0 pr-80')}>
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
