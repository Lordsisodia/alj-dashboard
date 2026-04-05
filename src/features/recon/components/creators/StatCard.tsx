'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconColor: string;
  delay?: number;
}

export function StatCard({ label, value, sub, icon, iconColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-xl p-4 bg-white flex flex-col gap-2"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-neutral-400">{sub}</p>}
    </motion.div>
  );
}
