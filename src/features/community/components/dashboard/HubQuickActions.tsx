'use client';

import { Play, Package, Send, LayoutGrid } from 'lucide-react';

interface HubQuickActionsProps {
  onStartSession: () => void;
  onBrowseVault: () => void;
  onSendToClient: () => void;
}

const ACTIONS = [
  {
    key: 'session' as const,
    icon: <Play size={16} className="fill-white text-white" />,
    label: 'Start Swipe Session',
    sub: 'Rate content in your vault',
    gradient: true,
  },
  {
    key: 'send' as const,
    icon: <Send size={16} className="text-green-500" />,
    label: 'Send to Client',
    sub: 'Push approved content',
    gradient: false,
  },
  {
    key: 'vault' as const,
    icon: <Package size={16} className="text-violet-500" />,
    label: 'Browse Vault',
    sub: 'All collected inspiration',
    gradient: false,
  },
];

export function HubQuickActions({ onStartSession, onBrowseVault, onSendToClient }: HubQuickActionsProps) {
  const handlers: Record<typeof ACTIONS[number]['key'], () => void> = {
    session: onStartSession,
    send: onSendToClient,
    vault: onBrowseVault,
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <LayoutGrid size={13} className="text-neutral-400" />
        <p className="text-xs font-bold text-neutral-800">Quick Actions</p>
      </div>
      <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        {ACTIONS.map(action => (
          <button
            key={action.key}
            onClick={handlers[action.key]}
            className="flex flex-col items-center gap-2 px-4 py-4 transition-colors hover:bg-neutral-50 text-center"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={
                action.gradient
                  ? { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }
                  : { background: '#f5f5f4' }
              }
            >
              {action.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-800">{action.label}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{action.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
