'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Link2,
  Puzzle,
  Sliders,
  Users,
  CreditCard,
  Bell,
  MessageSquare,
  BellRing,
  Check,
  AlertCircle,
  Plus,
  FolderOpen,
  Hash,
  ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsTab = 'profile' | 'accounts' | 'integrations' | 'content' | 'billing';

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',            icon: <User size={15} /> },
  { id: 'accounts',     label: 'Connected Accounts', icon: <Link2 size={15} /> },
  { id: 'integrations', label: 'Integrations',       icon: <Puzzle size={15} /> },
  { id: 'content',      label: 'Content Defaults',   icon: <Sliders size={15} /> },
  { id: 'billing',      label: 'Billing',            icon: <CreditCard size={15} /> },
];

// ─── Animated Toggle ──────────────────────────────────────────────────────────

function AnimatedToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
      style={{ backgroundColor: checked ? '#ff0069' : '#e5e7eb' }}
      role="switch"
      aria-checked={checked}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white block shadow-sm"
        animate={{ x: checked ? 22 : 3 }}
        style={{ left: 0 }}
      />
    </button>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function SettingsCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl bg-white p-5 ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {children}
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-neutral-400">{label}</p>
      <p className="text-sm text-neutral-900">{value}</p>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [toggles, setToggles] = useState({ email: true, slack: false, push: true });
  const toggle = (key: keyof typeof toggles) =>
    setToggles(t => ({ ...t, [key]: !t[key] }));

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
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
          <FieldRow label="Display Name"  value="Alex Chen"       />
          <FieldRow label="Email"         value="alex@isso.co"    />
          <FieldRow label="Agency"        value="ALJ OFM Agency"  />
          <FieldRow label="Timezone"      value="GMT+0 — London"  />
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
                checked={toggles[item.key as keyof typeof toggles]}
                onChange={() => toggle(item.key as keyof typeof toggles)}
              />
            </div>
          ))}
        </div>
      </SettingsCard>
    </motion.div>
  );
}

// ─── Connected Accounts Tab ───────────────────────────────────────────────────

function ConnectedAccountsTab() {
  const [driveConnected, setDriveConnected] = useState(true);
  const accounts = [
    { handle: '@abg.ricebunny', name: 'Tyler Rex',  subscribers: '12.4k', connected: true  },
    { handle: '@rhinxrenx',     name: 'Ren Rhinx',  subscribers: '8.7k',  connected: true  },
    { handle: '@ellamira',      name: 'Ella Mira',  subscribers: '5.2k',  connected: true  },
    { handle: '@samchase',      name: 'Sam Chase',  subscribers: '—',     connected: false },
  ];

  return (
    <motion.div
      key="accounts"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Connected Accounts</h2>
        <p className="text-sm text-neutral-500">Manage accounts linked to ISSO.</p>
      </div>

      {/* Google Drive */}
      <SettingsCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-50" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
              <FolderOpen size={18} style={{ color: '#4285f4' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Google Drive</p>
              <p className="text-xs text-neutral-400">{driveConnected ? 'Connected — ALJ_OFM_Content' : 'Not connected'}</p>
            </div>
          </div>
          <button
            onClick={() => setDriveConnected(p => !p)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={driveConnected
              ? { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
              : { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
            }
          >
            {driveConnected ? 'Disconnect' : 'Connect Drive'}
          </button>
        </div>
        {driveConnected && (
          <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-neutral-400">Last synced 2h ago · 847 files indexed</span>
          </div>
        )}
      </SettingsCard>

      {/* Instagram / OF Accounts */}
      <div>
        <p className="text-sm font-semibold text-neutral-900 mb-3">Model Accounts</p>
        <div className="space-y-2">
          {accounts.map(acc => (
            <div
              key={acc.handle}
              className="rounded-xl p-3.5 flex items-center gap-3 bg-white"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
              >
                {acc.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{acc.handle}</p>
                <p className="text-[11px] text-neutral-400">{acc.name} · {acc.subscribers} subscribers</p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 flex items-center gap-1"
                style={{
                  backgroundColor: acc.connected ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                  color: acc.connected ? '#16a34a' : '#d97706',
                }}
              >
                {acc.connected ? (
                  <><Check size={10} /> Connected</>
                ) : (
                  <><AlertCircle size={10} /> Pending</>
                )}
              </span>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-3 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Plus size={15} />
          Add Account
        </button>
      </div>
    </motion.div>
  );
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const integrations = [
    { name: 'Google Drive',  desc: 'Auto-sync clips and exports',             connected: true,  icon: <FolderOpen size={18} style={{ color: '#4285f4' }} />,  lastSynced: '2h ago',  model: null },
    { name: 'Gemini AI',     desc: 'Brief generation and analysis',           connected: true,  icon: <span className="text-base font-bold" style={{ color: '#4285f4' }}>G</span>, lastSynced: '5m ago',  model: 'gemini-2.0-flash' },
    { name: 'Telegram Bot',  desc: '@ISSO_bot — team notifications',          connected: true,  icon: <MessageSquare size={18} style={{ color: '#0088cc' }} />,lastSynced: '5m ago',  model: null },
    { name: 'Airtable',      desc: 'Pipeline and content management',         connected: false, icon: <Sliders size={18} style={{ color: '#ff0069' }} />,      lastSynced: null,      model: null },
    { name: 'Zapier',        desc: 'Workflow automation',                     connected: false, icon: <Hash size={18} style={{ color: '#ff4a00' }} />,         lastSynced: null,      model: null },
  ];

  return (
    <motion.div
      key="integrations"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Integrations</h2>
        <p className="text-sm text-neutral-500">Connect and manage third-party services.</p>
      </div>

      <div className="space-y-2">
        {integrations.map(intg => (
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

      {/* Coming soon */}
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

// ─── Content Defaults Tab ─────────────────────────────────────────────────────

function ContentDefaultsTab() {
  const [contentType, setContentType] = useState('Reel');
  const [hashtags, setHashtags] = useState('#onlyfans #creator #exclusive');
  const [scheduleTime, setScheduleTime] = useState('19:00');

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Content Defaults</h2>
        <p className="text-sm text-neutral-500">Set defaults for new posts and schedules.</p>
      </div>

      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Default Content Type</h3>
        <div className="flex gap-2 flex-wrap">
          {['Reel', 'Photo Set', 'Story', 'PPV'].map(type => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: contentType === type ? 'rgba(255,0,105,0.08)' : '#fafafa',
                color: contentType === type ? '#ff0069' : '#6b7280',
                border: contentType === type ? '1px solid rgba(255,0,105,0.3)' : '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Default Hashtags</h3>
        <textarea
          value={hashtags}
          onChange={e => setHashtags(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 bg-neutral-50 resize-none"
          style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
          onFocus={e => (e.target.style.borderColor = '#ff0069')}
          onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
        <p className="text-[11px] text-neutral-400 mt-1.5">Applied to all posts unless overridden.</p>
      </SettingsCard>

      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Default Posting Time</h3>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={scheduleTime}
            onChange={e => setScheduleTime(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm text-neutral-900 bg-neutral-50"
            style={{ border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
          />
          <span className="text-sm text-neutral-500">GMT+0 London</span>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          Save Defaults
        </button>
      </div>
    </motion.div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function BillingTab() {
  const usage = [
    { label: 'Briefs Generated',   used: 84,  max: 100  },
    { label: 'Posts Scheduled',    used: 312, max: 500  },
    { label: 'AI Video Renders',   used: 27,  max: 50   },
    { label: 'Active Models',      used: 4,   max: 10   },
  ];

  return (
    <motion.div
      key="billing"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Billing</h2>
        <p className="text-sm text-neutral-500">Manage your plan and usage.</p>
      </div>

      {/* Plan Card */}
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

      {/* Usage */}
      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Usage This Month</h3>
        <div className="space-y-4">
          {usage.map(item => {
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

      {/* Actions */}
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

// ─── Main Component ───────────────────────────────────────────────────────────

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
                color: active ? '#ff0069' : '#6b7280',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: active ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
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
