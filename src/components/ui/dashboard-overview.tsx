'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

export type TrendType = 'up' | 'down' | 'neutral';

export interface DashboardMetricCardProps {
  value: string;
  title: string;
  icon?: React.ElementType;
  trendChange?: string;
  trendType?: TrendType;
  className?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  value,
  title,
  icon: IconComponent,
  trendChange,
  trendType = 'neutral',
  className,
}) => {
  const TrendIcon =
    trendType === 'up' ? ArrowUp : trendType === 'down' ? ArrowDown : Minus;

  const trendColorClass =
    trendType === 'up'
      ? 'text-green-600'
      : trendType === 'down'
      ? 'text-red-600'
      : 'text-neutral-400';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn('cursor-pointer rounded-xl', className)}
    >
      <Card className="h-full border-0 shadow-none bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
          <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.07em] text-neutral-400">
            {title}
          </CardTitle>
          {IconComponent && (
            <IconComponent className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="text-[26px] font-bold text-neutral-900 leading-none tracking-tight mb-2">
            {value}
          </div>
          {trendChange && (
            <p className={cn('flex items-center gap-1 text-[11px] font-medium', trendColorClass)}>
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              {trendChange}{' '}
              {trendType === 'up' ? 'increase' : trendType === 'down' ? 'decrease' : 'no change'}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardMetricCard;
