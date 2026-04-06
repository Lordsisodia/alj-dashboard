'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import {
  Wrench, Video, Upload, Loader2, X, Play,
  Sparkles, Zap, Clock, TrendingUp, History,
  Send, RotateCcw, Film, Bug, CheckCircle2,
  AlertCircle, ChevronDown, ChevronRight, Timer, Plus,
  MessageSquare,
} from 'lucide-react';
import { DEFAULT_ANALYSIS_PROMPT } from '../constants';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToolTab = 'analyser' | 'uploads' | 'debug';

interface AnalysisResult {
  transcript?:  string | null;
  hookScore:    number;
  hookLine:     string;
  emotions:     string[];
  breakdown:    string;
  suggestions:  string[];
}

type ChatMessage =
  | { id: string; role: 'user';      kind: 'chat';     text: string }
  | { id: string; role: 'assistant'; kind: 'chat';     text: string }
  | { id: string; role: 'assistant'; kind: 'analysis'; data: AnalysisResult };

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const EMOTION_COLORS: Record<string, string> = {
  curiosity: '#8b5cf6', anticipation: '#f59e0b', surprise: '#f97316',
  recognition: '#3b82f6', reward: '#22c55e', laughter: '#eab308',
  tension: '#ef4444',
};

function scoreColor(score: number) {
  return score >= 8 ? '#16a34a' : score >= 6 ? '#ca8a04' : '#dc2626';
}

// ── Analysis result card ──────────────────────────────────────────────────────

function AnalysisCard({ data }: { data: AnalysisResult }) {
  const c = scoreColor(data.hookScore);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${c}0d`, border: `1px solid ${c}22` }}>
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke="rgba(0,0,0,0.06)" />
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke={c}
              strokeDasharray={`${(data.hookScore / 10) * 94.2} 94.2`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: c }}>
            {data.hookScore.toFixed(1)}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Hook Score</p>
          <p className="text-sm font-bold text-neutral-800 leading-snug italic">"{data.hookLine}"</p>
        </div>
      </div>

      {(data.emotions ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(data.emotions ?? []).map(e => (
            <span key={e} className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize text-white"
              style={{ backgroundColor: EMOTION_COLORS[e.toLowerCase()] ?? '#6b7280' }}>
              {e}
            </span>
          ))}
        </div>
      )}

      <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles size={10} className="text-violet-500" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Breakdown</p>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">{data.breakdown}</p>
      </div>

      {(data.suggestions ?? []).length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-amber-500" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Tips</p>
          </div>
          {(data.suggestions ?? []).map((s, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl text-sm"
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
              <span className="font-bold text-amber-500 flex-shrink-0">{i + 1}.</span>
              <p className="text-neutral-700 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      )}

      {data.transcript && (
        <details>
          <summary className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors select-none">
            Transcript ▾
          </summary>
          <p className="mt-2 text-sm text-neutral-500 leading-relaxed p-3 rounded-xl bg-neutral-50 border border-neutral-100 italic">
            "{data.transcript}"
          </p>
        </details>
      )}
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.kind === 'analysis') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles size={10} className="text-white" />
          </div>
          <p className="text-[10px] font-semibold text-neutral-400">Gemini Analysis</p>
        </div>
        <AnalysisCard data={msg.data} />
      </motion.div>
    );
  }
  if (msg.role === 'user') {
    return (
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          {msg.text}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <Sparkles size={10} className="text-white" />
      </div>
      <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-neutral-800 leading-relaxed"
        style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
      </div>
    </motion.div>
  );
}

// ── Sessions sidebar ──────────────────────────────────────────────────────────

type Session = {
  _id:            Id<'toolAnalyses'>;
  label?:         string | null;
  videoUrl:       string;
  hookScore:      number;
  hookLine:       string;
  emotions:       string[];
  breakdown?:     string | null;
  suggestions?:   string[] | null;
  transcript?:    string | null;
  systemPrompt?:  string | null;
  analyzedAt:     number;
  chatHistory?:   { role: 'user' | 'assistant'; content: string; ts: number }[] | null;
};

function SessionsSidebar({
  sessions, selectedId, onSelect, onNew,
}: {
  sessions: Session[] | undefined;
  selectedId: Id<'toolAnalyses'> | null;
  onSelect: (id: Id<'toolAnalyses'>) => void;
  onNew: () => void;
}) {
  return (
    <div className="w-52 flex-shrink-0 flex flex-col border-r overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>

      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-3 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Sessions</p>
        <button onClick={onNew}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          title="New session">
          <Plus size={12} />
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {!sessions && (
          <div className="flex justify-center pt-8">
            <Loader2 size={14} className="animate-spin text-neutral-300" />
          </div>
        )}
        {sessions?.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-12 gap-2 px-4 text-center">
            <Film size={20} className="text-neutral-300" />
            <p className="text-[11px] text-neutral-400">No sessions yet</p>
            <p className="text-[10px] text-neutral-300">Hit + to analyse your first video</p>
          </div>
        )}
        {sessions?.map(s => {
          const c = scoreColor(s.hookScore);
          const isSelected = selectedId === s._id;
          const chatCount = s.chatHistory?.length ?? 0;
          const date = new Date(s.analyzedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          return (
            <button key={s._id} onClick={() => onSelect(s._id)}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all text-left"
              style={{
                background: isSelected ? 'rgba(124,58,237,0.08)' : 'transparent',
                border: isSelected ? '1px solid rgba(124,58,237,0.18)' : '1px solid transparent',
              }}>
              {/* Video thumbnail */}
              <div className="flex-shrink-0 rounded-lg overflow-hidden bg-neutral-900"
                style={{ width: 34, height: 60 }}>
                <video src={s.videoUrl} preload="metadata" muted playsInline
                  className="w-full h-full object-cover" />
              </div>
              {/* Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-[11px] font-semibold text-neutral-800 truncate flex-1">
                    {s.label || 'Untitled'}
                  </p>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: c }}>
                    {s.hookScore.toFixed(1)}
                  </span>
                </div>
                <p className="text-[9px] text-neutral-400">{date}</p>
                {chatCount > 0 && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <MessageSquare size={8} className="text-neutral-400" />
                    <span className="text-[9px] text-neutral-400">{chatCount}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Analyser Tab ──────────────────────────────────────────────────────────────

function AnalyserTab() {
  const sessions = useQuery(api.toolAnalyses.list, { limit: 50 });
  const appendChatMessage = useMutation(api.toolAnalyses.appendChatMessage);

  // Session selection
  const [selectedId,  setSelectedId]  = useState<Id<'toolAnalyses'> | null>(null);
  const [showNew,     setShowNew]     = useState(true);

  // New session upload state
  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [prompt,    setPrompt]    = useState(DEFAULT_ANALYSIS_PROMPT);
  const [label,     setLabel]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [dragging,  setDragging]  = useState(false);

  // Chat state
  const [localMessages,  setLocalMessages]  = useState<ChatMessage[]>([]);
  const [apiMessages,    setApiMessages]    = useState<ApiMessage[]>([]);
  const [chatInput,      setChatInput]      = useState('');
  const [chatLoading,    setChatLoading]    = useState(false);

  const inputRef  = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedSession = sessions?.find(s => s._id === selectedId) ?? null;

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages, selectedSession?.chatHistory?.length]);

  // When switching to an existing session, reconstruct apiMessages context
  useEffect(() => {
    if (!selectedSession) { setLocalMessages([]); setApiMessages([]); return; }
    setLocalMessages([]);
    const ctx: ApiMessage[] = [
      { role: 'user',      content: `[Video: ${selectedSession.videoUrl}]\n\n${selectedSession.systemPrompt ?? DEFAULT_ANALYSIS_PROMPT}` },
      { role: 'assistant', content: `Hook score: ${selectedSession.hookScore}/10. Hook line: "${selectedSession.hookLine}". ${selectedSession.breakdown ? `What's happening: ${selectedSession.breakdown}.` : ''} ${selectedSession.emotions?.length ? `Emotions: ${selectedSession.emotions.join(', ')}.` : ''}`.trim() },
      ...(selectedSession.chatHistory ?? []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];
    setApiMessages(ctx);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFile(f: File) {
    if (!f.type.startsWith('video/')) { setError('Please upload a video file'); return; }
    setFile(f); setError(null); setPreview(URL.createObjectURL(f));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function runAnalysis() {
    if (!file) return;
    setError(null); setLocalMessages([]); setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const upRes = await fetch('/api/tools/upload', { method: 'POST', body: form });
      if (!upRes.ok) throw new Error('Upload failed');
      const { url } = await upRes.json();
      setUploading(false); setAnalysing(true);

      const anRes = await fetch('/api/tools/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url, systemPrompt: prompt, label: label || undefined }),
      });
      if (!anRes.ok) { const e = await anRes.json(); throw new Error(e.error ?? 'Analysis failed'); }
      const data = await anRes.json();

      // Switch into the new session
      if (data.analysisId) {
        setSelectedId(data.analysisId as Id<'toolAnalyses'>);
        setShowNew(false);
        setFile(null); setPreview(null); setLabel('');
        // Build apiMessages for follow-ups
        const analysisSummary = `Hook score: ${data.hookScore}/10. Hook line: "${data.hookLine}". ${data.breakdown ? `What's happening: ${data.breakdown}.` : ''} ${data.emotions?.length ? `Emotions: ${data.emotions.join(', ')}.` : ''} ${data.suggestions?.length ? `Tips: ${data.suggestions.join('; ')}.` : ''}`.trim();
        setApiMessages([
          { role: 'user',      content: `[Video: ${url}]\n\n${prompt}` },
          { role: 'assistant', content: analysisSummary },
        ]);
      } else {
        // Fallback: show inline if Convex not connected
        const analysisMsg: ChatMessage = { id: Date.now().toString(), role: 'assistant', kind: 'analysis', data };
        setLocalMessages([analysisMsg]);
        const analysisSummaryFallback = `Hook score: ${data.hookScore}/10. Hook line: "${data.hookLine}". ${data.breakdown ? `What's happening: ${data.breakdown}.` : ''} ${data.emotions?.length ? `Emotions: ${data.emotions.join(', ')}.` : ''} ${data.suggestions?.length ? `Tips: ${data.suggestions.join('; ')}.` : ''}`.trim();
        setApiMessages([
          { role: 'user',      content: `[Video: ${url}]\n\n${prompt}` },
          { role: 'assistant', content: analysisSummaryFallback },
        ]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setUploading(false); setAnalysing(false);
    }
  }

  async function sendFollowUp() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput('');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', kind: 'chat', text };
    setLocalMessages(prev => [...prev, userMsg]);

    // Persist to Convex
    if (selectedId) {
      try { await appendChatMessage({ id: selectedId, role: 'user', content: text }); } catch { /* silent */ }
    }

    const newApiMessages: ApiMessage[] = [...apiMessages, { role: 'user', content: text }];
    setApiMessages(newApiMessages);
    setChatLoading(true);

    try {
      const res = await fetch('/api/tools/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newApiMessages }),
      });
      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();
      const reply = data.text ?? '';
      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', kind: 'chat', text: reply };
      setLocalMessages(prev => [...prev, assistantMsg]);
      setApiMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Persist to Convex
      if (selectedId) {
        try { await appendChatMessage({ id: selectedId, role: 'assistant', content: reply }); } catch { /* silent */ }
      }
    } catch {
      const errMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', kind: 'chat', text: 'Something went wrong. Try again.' };
      setLocalMessages(prev => [...prev, errMsg]);
    } finally {
      setChatLoading(false);
    }
  }

  const isLoading = uploading || analysing;

  // Build full message list for chat panel
  const persistedMessages: ChatMessage[] = selectedSession
    ? (selectedSession.chatHistory ?? []).map((m, i) => ({
        id: `p-${i}`,
        role: m.role,
        kind: 'chat' as const,
        text: m.content,
      }))
    : [];

  // Deduplicate: localMessages may overlap with newly fetched persistedMessages
  const localIds = new Set(persistedMessages.map(m => m.id));
  const dedupedLocal = localMessages.filter(m => !localIds.has(m.id));
  const allMessages: ChatMessage[] = selectedSession
    ? [...persistedMessages, ...dedupedLocal]
    : localMessages;

  const hasSession    = !!selectedSession;
  const hasMessages   = allMessages.length > 0;
  const canChat       = hasSession || localMessages.some(m => m.kind === 'analysis');

  return (
    <div className="flex" style={{ height: 'calc(100vh - 180px)' }}>

      {/* ── Sessions rail ── */}
      <SessionsSidebar
        sessions={sessions as Session[] | undefined}
        selectedId={selectedId}
        onSelect={id => { setSelectedId(id); setShowNew(false); }}
        onNew={() => { setSelectedId(null); setShowNew(true); setFile(null); setPreview(null); setLocalMessages([]); setError(null); }}
      />

      {/* ── Center panel ── */}
      {showNew || !hasSession ? (

        /* NEW SESSION - compact form, chat gets the space */
        <div className="flex-1 min-w-0 flex flex-col border-r gap-3 p-4" style={{ borderColor: 'rgba(0,0,0,0.07)', maxWidth: 380 }}>

          {/* Drop zone - compact */}
          {!file ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-4 rounded-2xl cursor-pointer transition-all px-5"
              style={{
                height: 110,
                border: `2px dashed ${dragging ? '#7c3aed' : 'rgba(0,0,0,0.1)'}`,
                backgroundColor: dragging ? 'rgba(124,58,237,0.04)' : 'rgba(0,0,0,0.02)',
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124,58,237,0.08)' }}>
                <Upload size={20} style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700">Drop video here</p>
                <p className="text-xs text-neutral-400 mt-0.5">MP4 · MOV · WebM · max 15 MB</p>
                <p className="text-xs font-medium mt-1" style={{ color: '#7c3aed' }}>or click to browse</p>
              </div>
              <input ref={inputRef} type="file" accept="video/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            /* File selected - inline compact preview */
            <div className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ border: '1px solid rgba(124,58,237,0.2)', backgroundColor: 'rgba(124,58,237,0.04)' }}>
              <div className="relative rounded-xl overflow-hidden bg-black flex-shrink-0"
                style={{ width: 48, height: 84 }}>
                {preview && <video src={preview} className="w-full h-full object-cover" muted playsInline />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{file.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{(file.size / (1024 * 1024)).toFixed(1)} MB · ready to analyse</p>
              </div>
              <button onClick={() => { setFile(null); setPreview(null); setError(null); }}
                className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          )}

          {/* Label + Run */}
          <div className="flex gap-2 items-center">
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              placeholder="Label (optional)"
              className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400"
              style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.02)' }} />
            <button onClick={runAnalysis} disabled={!file || isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {uploading  ? <><Loader2 size={13} className="animate-spin" /> Uploading...</>
              : analysing ? <><Loader2 size={13} className="animate-spin" /> Analysing...</>
              : <><Play size={13} /> Run</>}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 px-1">{error}</p>}

          {/* System prompt - collapsed */}
          <details>
            <summary className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 cursor-pointer select-none hover:text-neutral-600 transition-colors flex items-center gap-1 list-none">
              <ChevronRight size={10} /> System Prompt
            </summary>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              className="mt-2 w-full px-3 py-2 text-xs rounded-xl outline-none resize-none leading-relaxed font-mono text-neutral-900"
              style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.02)', minHeight: 120 }} />
          </details>
        </div>

      ) : (

        /* SELECTED SESSION - video column + analysis column */
        <div className="flex-1 min-w-0 flex border-r overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>

          {/* Video column */}
          <div className="flex-shrink-0 bg-neutral-950 flex items-start border-r overflow-hidden"
            style={{ width: 220, borderColor: 'rgba(255,255,255,0.05)' }}>
            <video
              src={selectedSession.videoUrl}
              controls
              className="w-full object-contain"
              style={{ maxHeight: 'calc(100vh - 180px)' }}
            />
          </div>

          {/* Analysis column */}
          <div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-4">

            {/* Score + hook line */}
            {(() => {
              const c = scoreColor(selectedSession.hookScore);
              return (
                <div className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ backgroundColor: `${c}0d`, border: `1px solid ${c}22` }}>
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke="rgba(0,0,0,0.06)" />
                      <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke={c}
                        strokeDasharray={`${(selectedSession.hookScore / 10) * 94.2} 94.2`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: c }}>
                      {selectedSession.hookScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Hook Score</p>
                    <p className="text-base font-bold text-neutral-800 leading-snug italic">"{selectedSession.hookLine}"</p>
                  </div>
                </div>
              );
            })()}

            {/* Emotions */}
            {(selectedSession.emotions ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSession.emotions.map(e => (
                  <span key={e} className="px-3 py-1 rounded-full text-xs font-semibold capitalize text-white"
                    style={{ backgroundColor: EMOTION_COLORS[e.toLowerCase()] ?? '#6b7280' }}>
                    {e}
                  </span>
                ))}
              </div>
            )}

            {/* Breakdown */}
            {selectedSession.breakdown && (
              <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} className="text-violet-500" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Breakdown</p>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{selectedSession.breakdown}</p>
              </div>
            )}

            {/* Suggestions grid */}
            {(selectedSession.suggestions ?? []).length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap size={11} className="text-amber-500" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Tips</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(selectedSession.suggestions ?? []).map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-sm"
                      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
                      <span className="font-bold text-amber-500 flex-shrink-0">{i + 1}.</span>
                      <p className="text-neutral-700 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript */}
            {selectedSession.transcript && (
              <details>
                <summary className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors select-none">
                  Transcript ▾
                </summary>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed p-3 rounded-xl bg-neutral-50 border border-neutral-100 italic">
                  "{selectedSession.transcript}"
                </p>
              </details>
            )}

            <button onClick={() => { setShowNew(true); setSelectedId(null); }}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-neutral-500 hover:text-violet-600 transition-colors self-start"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <RotateCcw size={11} /> New session
            </button>
          </div>
        </div>
      )}

      {/* ── Chat panel (fixed right) ── */}
      <div className="w-96 flex-shrink-0 flex flex-col min-h-0 overflow-hidden pl-5 pr-2 py-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <Sparkles size={12} className="text-violet-600" />
          </div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Conversation</p>
          {selectedSession && (
            <span className="ml-1 text-[10px] text-neutral-400 truncate max-w-[140px]">
              - {selectedSession.label || 'Untitled'}
            </span>
          )}
          {hasMessages && !hasSession && (
            <button onClick={() => setLocalMessages([])}
              className="ml-auto flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors">
              <RotateCcw size={10} /> Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {!hasMessages && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.06)' }}>
                <Sparkles size={20} className="text-violet-400" />
              </div>
              <p className="text-sm font-medium text-neutral-500 text-center">
                {hasSession ? 'Start a follow-up' : 'Upload a video to begin'}
              </p>
              <p className="text-xs text-neutral-400 text-center">
                {hasSession ? 'Ask anything about this video' : 'Drop a clip, run analysis, then chat'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 size={20} className="animate-spin text-violet-400" />
              <p className="text-sm text-neutral-500">{uploading ? 'Uploading to R2...' : 'Gemini is watching...'}</p>
            </div>
          )}

          <AnimatePresence>
            {allMessages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
          </AnimatePresence>

          {chatLoading && (
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-sm" style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Loader2 size={14} className="animate-spin text-neutral-400" />
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        {canChat && (
          <div className="flex-shrink-0 mt-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFollowUp(); } }}
              placeholder="Ask a follow-up... e.g. write me a GFE caption"
              className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400"
              style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.02)' }}
              disabled={chatLoading}
            />
            <button onClick={sendFollowUp} disabled={!chatInput.trim() || chatLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:brightness-110 disabled:opacity-40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Send size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
