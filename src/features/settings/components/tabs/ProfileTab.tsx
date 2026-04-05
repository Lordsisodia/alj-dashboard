'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, BellRing } from 'lucide-react';
import { SettingsCard } from '../controls/SettingsCard';
import { FieldRow } from '../controls/FieldRow';
import { AnimatedToggle } from '../controls/AnimatedToggle';
import { TAB_TRANSITION } from '../../constants';

type TogglesState = { email: boolean; slack: boolean; push: boolean };

export function ProfileTab() {
  const [toggles, setToggles] = useState<TogglesState>({ email: true, slack: false, push: true });
  const toggle = (key: keyof TogglesState) =>
    setToggles(t => ({ ...t, [key]: !t[key] }));

  return (
    <motion.div
      key="profile"
      {...TAB_TRANSITION}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Profile</h2>
        <p className="text-sm text-neutral-500">Manage your personal account settings.</p>
      </div>

      <SettingsCard>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            AX
          </div>
          <div>
            <p className="text-neutral-900 font-semibold text-base">Alex Chen</p>
            <p className="text-sm text-neutral-500">alex@isso.co</p>
            <span
              className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ backgroundColor: 'rgba(255,0,105,0.08)', color: '#ff0069', border: '1px solid rgba(255,0,105,0.2)' }}
            >
              Admin
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Display Name" value="Alex Chen"      />
          <FieldRow label="Email"        value="alex@isso.co"   />
          <FieldRow label="Agency"       value="ALJ OFM Agency" />
          <FieldRow label="Timezone"     value="GMT+0 — London" />
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            Edit Profile
          </button>
        </div>
      </SettingsCard>

      <SettingsCard>
        <h3 className="text-neutral-900 font-medium mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email alerts',        desc: 'Get notified via email for important updates',   icon: <Bell size={15} style={{ color: '#ff0069' }} /> },
            { key: 'slack', label: 'Slack notifications', desc: 'Push updates to your Slack workspace',           icon: <MessageSquare size={15} style={{ color: '#833ab4' }} /> },
            { key: 'push',  label: 'Push notifications',  desc: 'In-app and browser push notifications',          icon: <BellRing size={15} style={{ color: '#f59e0b' }} /> },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="text-sm text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
              </div>
              <AnimatedToggle
                checked={toggles[item.key as keyof TogglesState]}
                onChange={() => toggle(item.key as keyof TogglesState)}
              />
            </div>
          ))}
        </div>
      </SettingsCard>
    </motion.div>
  );
}
