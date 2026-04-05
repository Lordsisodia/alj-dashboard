'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Check, AlertCircle, Plus } from 'lucide-react';
import { SettingsCard } from '../controls/SettingsCard';
import { TAB_TRANSITION } from '../../constants';

const ACCOUNTS = [
  { handle: '@abg.ricebunny', name: 'Tyler Rex',  subscribers: '12.4k', connected: true  },
  { handle: '@rhinxrenx',     name: 'Ren Rhinx',  subscribers: '8.7k',  connected: true  },
  { handle: '@ellamira',      name: 'Ella Mira',  subscribers: '5.2k',  connected: true  },
  { handle: '@samchase',      name: 'Sam Chase',  subscribers: '—',     connected: false },
];

export function ConnectedAccountsTab() {
  const [driveConnected, setDriveConnected] = useState(true);

  return (
    <motion.div
      key="accounts"
      {...TAB_TRANSITION}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Connected Accounts</h2>
        <p className="text-sm text-neutral-500">Manage accounts linked to ISSO.</p>
      </div>

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

      <div>
        <p className="text-sm font-semibold text-neutral-900 mb-3">Model Accounts</p>
        <div className="space-y-2">
          {ACCOUNTS.map(acc => (
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
