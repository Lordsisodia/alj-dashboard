"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: ReactNode;
  color: string;
  delay?: number;
}

export function StatTile({ label, value, sub, icon, color, delay = 0 }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 p-5 rounded-2xl bg-white"
      style={{ border: "1px solid rgba(0,0,0,0.07)" }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-neutral-900">{value}</div>
        <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-neutral-300 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}
