'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import type { SettingsTab } from '../types';
import { TABS } from '../constants';
// ProfileTab is the default tab — keep eager
import { ProfileTab } from './tabs';
// Non-default tabs — lazy load
const ConnectedAccountsTab = dynamic(() => import('./tabs/ConnectedAccountsTab').then(m => ({ default: m.ConnectedAccountsTab })), { ssr: false });
const IntegrationsTab      = dynamic(() => import('./tabs/IntegrationsTab').then(m => ({ default: m.IntegrationsTab })),           { ssr: false });
const ContentDefaultsTab   = dynamic(() => import('./tabs/ContentDefaultsTab').then(m => ({ default: m.ContentDefaultsTab })),     { ssr: false });
const BillingTab           = dynamic(() => import('./tabs/BillingTab').then(m => ({ default: m.BillingTab })),                     { ssr: false });

export default function SettingsFeaturePage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const panels: Record<SettingsTab, React.ReactNode> = {
    profile:      <ProfileTab />,
    accounts:     <ConnectedAccountsTab />,
    integrations: <IntegrationsTab />,
    content:      <ContentDefaultsTab />,
    billing:      <BillingTab />,
  };

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Left Sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col py-4 overflow-y-auto"
        style={{ borderRight: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-4 mb-3">
          Settings
        </p>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all text-left mx-2 rounded-lg"
              style={{
                backgroundColor: active ? '#fff' : 'transparent',
                color:           active ? '#ff0069' : '#6b7280',
                boxShadow:       active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border:          active ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
              }}
            >
              <span style={{ color: active ? '#ff0069' : '#9ca3af' }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            {panels[activeTab]}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
