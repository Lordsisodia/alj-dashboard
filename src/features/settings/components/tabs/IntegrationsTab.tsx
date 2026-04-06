'use client';

import { motion } from 'framer-motion';
import { FolderOpen, MessageSquare, Sliders, Hash } from 'lucide-react';
import { SettingsCard } from '../controls/SettingsCard';
import { TAB_TRANSITION } from '../../constants';

const INTEGRATIONS = [
  { name: 'Google Drive',  desc: 'Auto-sync clips and exports',             connected: true,  icon: <FolderOpen size={18} style={{ color: '#4285f4' }} />,  lastSynced: '2h ago',  model: null },
  { name: 'Gemini AI',     desc: 'Brief generation and analysis',           connected: true,  icon: <span className="text-base font-bold" style={{ color: '#4285f4' }}>G</span>, lastSynced: '5m ago',  model: 'gemini-2.0-flash' },
  { name: 'Telegram Bot',  desc: '@ISSO_bot - team notifications',          connected: true,  icon: <MessageSquare size={18} style={{ color: '#0088cc' }} />, lastSynced: '5m ago',  model: null },
  { name: 'Airtable',      desc: 'Pipeline and content management',         connected: false, icon: <Sliders size={18} style={{ color: '#ff0069' }} />,       lastSynced: null,      model: null },
  { name: 'Zapier',        desc: 'Workflow automation',                     connected: false, icon: <Hash size={18} style={{ color: '#ff4a00' }} />,          lastSynced: null,      model: null },
];

export function IntegrationsTab() {
  return (
    <motion.div
      key="integrations"
      {...TAB_TRANSITION}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Integrations</h2>
        <p className="text-sm text-neutral-500">Connect and manage third-party services.</p>
      </div>

      <div className="space-y-2">
        {INTEGRATIONS.map(intg => (
          <div
            key={intg.name}
            className="rounded-xl p-4 flex items-center gap-4 bg-white"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-neutral-50"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              {intg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-neutral-900">{intg.name}</p>
                {intg.model && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                    {intg.model}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">{intg.desc}</p>
              {intg.lastSynced && (
                <p className="text-[10px] text-neutral-300 mt-0.5">Last synced {intg.lastSynced}</p>
              )}
            </div>
            {intg.connected ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <button
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:bg-neutral-100 text-neutral-600"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  Configure
                </button>
              </div>
            ) : (
              <button
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <SettingsCard>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Coming Soon</p>
        <div className="grid grid-cols-3 gap-3">
          {['Slack', 'Notion', 'Discord'].map(name => (
            <div
              key={name}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <p className="text-sm font-medium text-neutral-400">{name}</p>
              <p className="text-[10px] text-neutral-300 mt-0.5">Soon</p>
            </div>
          ))}
        </div>
      </SettingsCard>
    </motion.div>
  );
}
