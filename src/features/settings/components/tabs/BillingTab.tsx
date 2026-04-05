'use client';

import { motion } from 'framer-motion';
import { SettingsCard } from '../controls/SettingsCard';
import { TAB_TRANSITION } from '../../constants';

const USAGE_ITEMS = [
  { label: 'Briefs Generated',  used: 84,  max: 100 },
  { label: 'Posts Scheduled',   used: 312, max: 500 },
  { label: 'AI Video Renders',  used: 27,  max: 50  },
  { label: 'Active Models',     used: 4,   max: 10  },
];

export function BillingTab() {
  return (
    <motion.div
      key="billing"
      {...TAB_TRANSITION}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Billing</h2>
        <p className="text-sm text-neutral-500">Manage your plan and usage.</p>
      </div>

      <div
        className="rounded-xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold opacity-75 uppercase tracking-wider">Current Plan</p>
            <p className="text-2xl font-black mt-0.5">ISSO Agency</p>
          </div>
          <p className="text-3xl font-black">$79<span className="text-base font-normal opacity-75">/mo</span></p>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <span>Next billing: May 1, 2026</span>
          <span>·</span>
          <span>Visa ending 4242</span>
        </div>
      </div>

      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Usage This Month</h3>
        <div className="space-y-4">
          {USAGE_ITEMS.map(item => {
            const pct = Math.round((item.used / item.max) * 100);
            const warn = pct > 80;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-neutral-700">{item.label}</span>
                  <span className="text-xs font-semibold" style={{ color: warn ? '#f59e0b' : '#6b7280' }}>
                    {item.used} / {item.max}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: warn
                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                        : 'linear-gradient(90deg, #ff0069, #833ab4)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SettingsCard>

      <div className="flex gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          Upgrade Plan
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-neutral-100 text-neutral-600"
          style={{ border: '1px solid rgba(0,0,0,0.1)' }}
        >
          View Invoices
        </button>
      </div>
    </motion.div>
  );
}
