'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, Clock, CheckCircle2 } from 'lucide-react';
import type { ReactElement } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  index?: number;
}

function StatCard({ label, value, icon: Icon, color, subtitle, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-2xl p-5"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-neutral-400 font-medium">{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={15} />
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 mb-0.5">{value}</p>
      {subtitle && <p className="text-[11px] text-neutral-400">{subtitle}</p>}
    </motion.div>
  );
}

export { StatCard };
