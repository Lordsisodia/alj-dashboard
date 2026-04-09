'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import {
  Wrench, Video, Film, Bug, Loader2, Clock,
  CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Timer,
} from 'lucide-react';
import { AnalyserTab } from './AnalyserTab';

// ── Uploads Tab ───────────────────────────────────────────────────────────────

function UploadsTab() {
  const uploads = useQuery(api.mediaUploads.list, { limit: 100 });

  if (!uploads) return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-neutral-300" /></div>;

  if (uploads.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.06)' }}>
        <Film size={20} className="text-violet-400" />
      </div>
      <p className="text-sm font-medium text-neutral-500">No uploads yet</p>
      <p className="text-xs text-neutral-400">Videos uploaded via the Analyser appear here</p>
    </div>
  );

  function fmtBytes(b: number) {
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {uploads.map(u => {
        const date = new Date(u.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
        const time = new Date(u.uploadedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return (
          <motion.div key={u._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="relative bg-neutral-950 flex items-center justify-center" style={{ aspectRatio: '9/16', maxHeight: 200 }}>
              {u.mimeType.startsWith('video/')
                ? <video src={u.url} className="w-full h-full object-contain" muted playsInline />
                : <Film size={28} className="text-neutral-600" />}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide text-white"
                style={{ background: 'rgba(0,0,0,0.55)' }}>
                {u.mimeType.split('/')[1] ?? 'file'}
              </span>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-neutral-800 truncate">{u.label || u.filename}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Clock size={9} className="text-neutral-400" />
                  <p className="text-[10px] text-neutral-400">{date} · {time}</p>
                </div>
                <p className="text-[10px] text-neutral-400">{fmtBytes(u.sizeBytes)}</p>
              </div>
              <a href={u.url} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-medium text-violet-500 hover:text-violet-700 transition-colors truncate mt-0.5">
                Open in R2 ↗
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Debug Tab ─────────────────────────────────────────────────────────────────

function DebugTab() {
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'error'>('all');
  const [filterAgent,  setFilterAgent]  = useState<string>('all');

  const logs = useQuery(api.agentDebugLogs.list, {
    limit:   200,
    status:  filterStatus === 'all' ? undefined : filterStatus,
    agentId: filterAgent  === 'all' ? undefined : filterAgent,
  });

  if (!logs) return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-neutral-300" /></div>;

  if (logs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.06)' }}>
        <Bug size={20} className="text-violet-400" />
      </div>
      <p className="text-sm font-medium text-neutral-500">No debug logs yet</p>
      <p className="text-xs text-neutral-400">Agent calls are logged here automatically</p>
    </div>
  );

  const agents = ['all', ...Array.from(new Set(logs.map(l => l.agentId)))];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          {(['all', 'ok', 'error'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors"
              style={{
                background: filterStatus === s ? (s === 'error' ? '#fee2e2' : s === 'ok' ? '#dcfce7' : '#f4f4f5') : 'transparent',
                color:      filterStatus === s ? (s === 'error' ? '#dc2626' : s === 'ok' ? '#16a34a' : '#3f3f46') : '#a1a1aa',
              }}>
              {s}
            </button>
          ))}
        </div>
        <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-xl outline-none"
          style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#f4f4f5', color: '#3f3f46' }}>
          {agents.map(a => <option key={a} value={a}>{a === 'all' ? 'All agents' : a}</option>)}
        </select>
        <p className="ml-auto text-[11px] text-neutral-400">{logs.length} entries</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        {logs.map((log, i) => {
          const isOpen = expanded === log._id;
          const ts     = new Date(log.timestamp);
          const date   = ts.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          const time   = ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return (
            <div key={log._id} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
              <button onClick={() => setExpanded(isOpen ? null : log._id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left">
                {log.status === 'ok'
                  ? <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                  : <AlertCircle  size={13} className="text-red-500 flex-shrink-0" />}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
                    {log.agentId}
                  </span>
                  <span className="text-[10px] text-neutral-400">{log.stage}</span>
                </div>
                <span className="text-[10px] text-neutral-400 hidden sm:block truncate max-w-[160px]">{log.model}</span>
                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                  <Timer size={10} className="text-neutral-400" />
                  <span className="text-[10px] text-neutral-500 font-mono">{log.latencyMs}ms</span>
                </div>
                {log.tokens && (
                  <span className="text-[10px] text-neutral-400 font-mono hidden md:block flex-shrink-0">
                    {log.tokens.total.toLocaleString()} tok
                  </span>
                )}
                <span className="text-[10px] text-neutral-400 flex-shrink-0 hidden lg:block">{date} {time}</span>
                {isOpen ? <ChevronDown size={12} className="text-neutral-400 flex-shrink-0" /> : <ChevronRight size={12} className="text-neutral-400 flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Input</p>
                        <pre className="text-[11px] text-neutral-700 bg-neutral-50 rounded-xl p-3 overflow-auto max-h-48 whitespace-pre-wrap font-mono leading-relaxed"
                          style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                          {log.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Output</p>
                        <pre className="text-[11px] text-neutral-700 bg-neutral-50 rounded-xl p-3 overflow-auto max-h-48 whitespace-pre-wrap font-mono leading-relaxed"
                          style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                          {log.output}
                        </pre>
                      </div>
                      {log.error && (
                        <div className="col-span-2 px-3 py-2 rounded-xl text-xs text-red-700"
                          style={{ background: '#fee2e2', border: '1px solid #fecaca' }}>
                          {log.error}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type ToolTab = 'analyser' | 'uploads' | 'debug';

export function ToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('analyser');

  return (
    <ContentPageShell
      icon={<Wrench size={18} />}
      title="Tools"
      tabs={[
        { id: 'analyser', label: 'Video Analyser', icon: <Video size={12} /> },
        { id: 'uploads',  label: 'Uploads',        icon: <Film  size={12} /> },
        { id: 'debug',    label: 'Debug Logs',     icon: <Bug   size={12} /> },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as ToolTab)}
    >
      <div className="px-6 py-4 w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
            {activeTab === 'analyser' && <AnalyserTab />}
            {activeTab === 'uploads'  && <UploadsTab />}
            {activeTab === 'debug'    && <DebugTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ContentPageShell>
  );
}
