'use client';

import { motion } from 'framer-motion';
import { Play, Zap, Plus } from 'lucide-react';
import type { ModelData } from '../../../types';
import { THUMB_GRADIENTS } from '../../../constants';

const BRIEFS = [
  { id: 'b1', hook: 'POV: you just caught me mid-workout 🔥', style: 'Candid', status: 'Approved' },
  { id: 'b2', hook: 'Morning routine but make it spicy ☕', style: 'Aesthetic', status: 'In Review' },
  { id: 'b3', hook: 'What I eat in a day (the real version)', style: 'Lifestyle', status: 'Draft' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Approved:  { bg: 'rgba(34,197,94,0.1)',  color: '#16a34a' },
  'In Review': { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  Draft:     { bg: 'rgba(0,0,0,0.06)',      color: '#737373' },
};

export function ContentTab({ model }: { model: ModelData }) {
  return (
    <div className="p-4 space-y-5">
      {/* Active Briefs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-800">Active Briefs</p>
          <a
            href="/content-gen/ideas"
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: '#ff0069' }}
          >
            <Plus size={11} />
            Create Brief for {model.name}
          </a>
        </div>
        <div className="space-y-2">
          {BRIEFS.map((brief, i) => {
            const sc = STATUS_COLORS[brief.status] ?? STATUS_COLORS.Draft;
            return (
              <motion.div
                key={brief.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-800 leading-snug">{brief.hook}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{brief.style}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                  style={{ backgroundColor: sc.bg, color: sc.color }}
                >
                  {brief.status}
                </span>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  <Zap size={10} />
                  Generate
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Generated Videos */}
      <section>
        <p className="text-sm font-semibold text-neutral-800 mb-3">Generated Videos</p>
        <div className="grid grid-cols-4 gap-2">
          {THUMB_GRADIENTS.map((grad, i) => (
            <div
              key={i}
              className="aspect-[9/16] rounded-xl relative overflow-hidden flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
              style={{ background: grad }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <Play size={12} className="text-white" fill="white" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
