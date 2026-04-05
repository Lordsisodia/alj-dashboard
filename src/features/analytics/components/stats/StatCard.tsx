'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  iconColor: string;
  change?: number;
  changeLabel?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  suffix = '',
  icon,
  iconColor,
  change,
  changeLabel,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-xl p-4 bg-white flex flex-col gap-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-neutral-900 tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} duration={1.2 + delay} />
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <TrendingUp size={11} style={{ color: change >= 0 ? '#16a34a' : '#dc2626' }} />
          <span className="text-[11px] font-semibold" style={{ color: change >= 0 ? '#16a34a' : '#dc2626' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-[11px] text-neutral-400">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
