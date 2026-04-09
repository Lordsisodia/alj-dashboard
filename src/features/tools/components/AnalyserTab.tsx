'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  Upload, Loader2, X, Play,
  Sparkles, Zap, Send, RotateCcw, Film, Plus,
  MessageSquare, Clock,
} from 'lucide-react';
import { StatusStrip, timeAgo } from '@/components/ui/status-strip';
import { DEFAULT_ANALYSIS_PROMPT } from '../constants';
import { SystemPromptPanel } from '@/features/intelligence/components/analysis/SystemPromptPanel';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

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

const COL_ACCENT = '#7c3aed';

function SessionsSidebar({
  sessions, selectedId, onSelect, onNew, onDelete,
}: {
  sessions: Session[] | undefined;
  selectedId: Id<'toolAnalyses'> | null;
  onSelect: (id: Id<'toolAnalyses'>) => void;
  onNew: () => void;
  onDelete: (id: Id<'toolAnalyses'>) => void;
}) {
  const count = sessions?.length ?? 0;
  const [hoveredId, setHoveredId] = useState<Id<'toolAnalyses'> | null>(null);

  return (
    <div className="w-56 flex-shrink-0 flex flex-col rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(0,0,0,0.07)',
        borderTop: `2px solid ${COL_ACCENT}`,
        background: `${COL_ACCENT}04`,
      }}>

      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${COL_ACCENT}18` }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COL_ACCENT }}>
          Sessions
        </p>
        {count > 0 && (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold leading-none"
            style={{ background: `${COL_ACCENT}18`, color: COL_ACCENT }}>
            {count}
          </span>
        )}
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-2 px-1.5 space-y-1.5 min-h-0">
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
          const hasScore = s.hookScore > 0;
          const topAccent = !hasScore
            ? 'rgba(0,0,0,0.1)'
            : s.hookScore >= 8 ? '#22c55e'
            : s.hookScore >= 6 ? '#f59e0b'
            : '#ef4444';

          const isHovered = hoveredId === s._id;
          return (
            <div key={s._id} className="relative"
              onMouseEnter={() => setHoveredId(s._id)}
              onMouseLeave={() => setHoveredId(null)}>
              <button onClick={() => onSelect(s._id)}
                className="w-full text-left rounded-xl overflow-hidden transition-all hover:-translate-y-px"
                style={{
                  background: isSelected ? `${COL_ACCENT}0d` : '#fff',
                  border: isSelected ? `1px solid ${COL_ACCENT}30` : '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  borderTop: `2px solid ${topAccent}`,
                }}>
                <div className="flex items-center gap-2.5 px-2 py-2">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 rounded-lg overflow-hidden bg-neutral-900"
                    style={{ width: 32, height: 56 }}>
                    <video src={s.videoUrl} preload="metadata" muted playsInline
                      className="w-full h-full object-cover" />
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-[11px] font-semibold text-neutral-800 truncate flex-1 leading-tight">
                        {s.label || 'Untitled'}
                      </p>
                      {hasScore && (
                        <span className="text-[9px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md leading-none"
                          style={{ color: c, background: `${c}18` }}>
                          {s.hookScore.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-neutral-400">{date}</span>
                      {chatCount > 0 && (
                        <>
                          <span className="text-neutral-300 text-[9px]">·</span>
                          <div className="flex items-center gap-0.5">
                            <MessageSquare size={7} className="text-neutral-400" />
                            <span className="text-[9px] text-neutral-400">{chatCount}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Delete button on hover */}
              {isHovered && (
                <button
                  onClick={e => { e.stopPropagation(); onDelete(s._id); }}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors z-10"
                  style={{ background: '#ef444490', color: '#fff' }}
                  title="Delete session">
                  <X size={8} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: New Session button */}
      <div className="flex-shrink-0 px-2 pb-2 pt-1.5"
        style={{ borderTop: `1px solid ${COL_ACCENT}18` }}>
        <button onClick={onNew}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          <Plus size={12} />
          New Session
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface AnalyserTabProps {
  /** Override the container height class. Defaults to calc(100vh - 180px) for Tools page. */
  className?: string;
}

export function AnalyserTab({ className }: AnalyserTabProps = {}) {
  const sessions = useQuery(api.toolAnalyses.list, { limit: 50 });
  const appendChatMessage = useMutation(api.toolAnalyses.appendChatMessage);
  const removeSession     = useMutation(api.toolAnalyses.remove);
  const setSessionLabel   = useMutation(api.toolAnalyses.setLabel);

  const [selectedId,  setSelectedId]  = useState<Id<'toolAnalyses'> | null>(null);
  const [showNew,     setShowNew]     = useState(true);

  const [selectedTypeKey, setSelectedTypeKey] = useState('standard');
  const [promptMode,      setPromptMode]      = useState<'saved' | 'custom'>('saved');
  const [customText,      setCustomText]      = useState(DEFAULT_ANALYSIS_PROMPT);
  const promptVersions = useQuery(api.analysisPrompts.listVersionsForType, { typeKey: selectedTypeKey });
  const savedPrompt = promptVersions?.find(v => v.isActive)?.prompt
    ?? promptVersions?.[0]?.prompt
    ?? DEFAULT_ANALYSIS_PROMPT;
  const activePrompt = promptMode === 'custom' ? customText : savedPrompt;

  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [label,     setLabel]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [dragging,  setDragging]  = useState(false);

  const [localMessages,  setLocalMessages]  = useState<ChatMessage[]>([]);
  const [apiMessages,    setApiMessages]    = useState<ApiMessage[]>([]);
  const [chatInput,      setChatInput]      = useState('');
  const [chatLoading,    setChatLoading]    = useState(false);

  const inputRef  = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedSession = sessions?.find(s => s._id === selectedId) ?? null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages, selectedSession?.chatHistory?.length]);

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
        body: JSON.stringify({ videoUrl: url, systemPrompt: activePrompt, label: label || undefined }),
      });
      if (!anRes.ok) { const e = await anRes.json(); throw new Error(e.error ?? 'Analysis failed'); }
      const data = await anRes.json();

      if (data.analysisId) {
        const analysisId = data.analysisId as Id<'toolAnalyses'>;
        setSelectedId(analysisId);
        setShowNew(false);
        setFile(null); setPreview(null);
        // Auto-label from hook line if user left title blank
        if (!label.trim() && data.hookLine) {
          const autoLabel = data.hookLine.split(' ').slice(0, 5).join(' ');
          setSessionLabel({ id: analysisId, label: autoLabel }).catch(() => {});
        }
        setLabel('');
        const analysisSummary = `Hook score: ${data.hookScore}/10. Hook line: "${data.hookLine}". ${data.breakdown ? `What's happening: ${data.breakdown}.` : ''} ${data.emotions?.length ? `Emotions: ${data.emotions.join(', ')}.` : ''} ${data.suggestions?.length ? `Tips: ${data.suggestions.join('; ')}.` : ''}`.trim();
        setApiMessages([
          { role: 'user',      content: `[Video: ${url}]\n\n${activePrompt}` },
          { role: 'assistant', content: analysisSummary },
        ]);
      } else {
        const analysisMsg: ChatMessage = { id: Date.now().toString(), role: 'assistant', kind: 'analysis', data };
        setLocalMessages([analysisMsg]);
        const analysisSummaryFallback = `Hook score: ${data.hookScore}/10. Hook line: "${data.hookLine}". ${data.breakdown ? `What's happening: ${data.breakdown}.` : ''} ${data.emotions?.length ? `Emotions: ${data.emotions.join(', ')}.` : ''} ${data.suggestions?.length ? `Tips: ${data.suggestions.join('; ')}.` : ''}`.trim();
        setApiMessages([
          { role: 'user',      content: `[Video: ${url}]\n\n${activePrompt}` },
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

  const persistedMessages: ChatMessage[] = selectedSession
    ? (selectedSession.chatHistory ?? []).map((m, i) => ({
        id: `p-${i}`,
        role: m.role,
        kind: 'chat' as const,
        text: m.content,
      }))
    : [];

  const localIds = new Set(persistedMessages.map(m => m.id));
  const dedupedLocal = localMessages.filter(m => !localIds.has(m.id));
  const allMessages: ChatMessage[] = selectedSession
    ? [...persistedMessages, ...dedupedLocal]
    : localMessages;

  const hasSession  = !!selectedSession;
  const hasMessages = allMessages.length > 0;
  const canChat     = hasSession || localMessages.some(m => m.kind === 'analysis');

  const containerStyle = className ? undefined : { height: 'calc(100vh - 180px)' };

  // Strip stats
  const analyzedSessions = sessions?.filter(s => s.hookScore > 0) ?? [];
  const unscoredCount    = (sessions?.length ?? 0) - analyzedSessions.length;
  const avgScore = analyzedSessions.length > 0
    ? analyzedSessions.reduce((sum, s) => sum + s.hookScore, 0) / analyzedSessions.length
    : 0;
  const topScore = analyzedSessions.length > 0
    ? Math.max(...analyzedSessions.map(s => s.hookScore))
    : 0;
  const sessionsWithChat = sessions?.filter(s => (s.chatHistory?.length ?? 0) > 0).length ?? 0;
  const lastSessionAt = sessions && sessions.length > 0
    ? Math.max(...sessions.map(s => s.analyzedAt))
    : 0;

  return (
    <div className={`flex flex-col ${className ?? ''}`} style={containerStyle}>

      {/* ── Stats strip ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <StatusStrip
          iconColor="text-violet-600"
          stats={[
            { value: sessions?.length ?? 0, label: 'sessions' },
            ...(unscoredCount > 0 ? [{ value: unscoredCount, label: 'unscored', accent: '#f59e0b' }] : []),
            ...(avgScore > 0 ? [{ value: avgScore.toFixed(1), label: 'avg hook', accent: avgScore >= 8 ? '#16a34a' : avgScore >= 6 ? '#ca8a04' : '#dc2626' }] : []),
            ...(topScore > 0 ? [{ value: topScore.toFixed(1), label: 'top score', accent: '#16a34a' }] : []),
            ...(sessionsWithChat > 0 ? [{ value: sessionsWithChat, label: 'with chat' }] : []),
          ]}
          status={{ label: analyzedSessions.length > 0 ? 'Analyser ready' : 'No analyses yet', active: analyzedSessions.length > 0 }}
          rightSlot={lastSessionAt > 0 ? (
            <>
              <Clock size={10} className="text-violet-600" />
              <span>Last session: <span className="font-medium text-neutral-700">{timeAgo(lastSessionAt)}</span></span>
            </>
          ) : undefined}
        />
      </div>

      {/* ── Main row ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4 pt-2 gap-3">

      {/* ── Sessions rail ── */}
      <SessionsSidebar
        sessions={sessions as Session[] | undefined}
        selectedId={selectedId}
        onSelect={id => { setSelectedId(id); setShowNew(false); }}
        onNew={() => { setSelectedId(null); setShowNew(true); setFile(null); setPreview(null); setLocalMessages([]); setError(null); }}
        onDelete={id => {
          removeSession({ id }).catch(() => {});
          if (selectedId === id) { setSelectedId(null); setShowNew(true); }
        }}
      />

      {/* ── Center panel ── */}
      {showNew || !hasSession ? (
        <div className="flex-1 min-w-0 flex flex-col gap-3 p-4" style={{ maxWidth: 380 }}>

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

          <div className="flex gap-2 items-center">
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              placeholder="Title session..."
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

          {/* Prompt mode toggle */}
          <div className="flex items-center gap-1 flex-shrink-0 p-0.5 rounded-lg self-start"
            style={{ background: 'rgba(0,0,0,0.05)' }}>
            {(['saved', 'custom'] as const).map(mode => (
              <button key={mode} onClick={() => setPromptMode(mode)}
                className="px-3 py-1 rounded-md text-[10px] font-semibold capitalize transition-all"
                style={promptMode === mode
                  ? { background: '#fff', color: '#7c3aed', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                  : { color: '#9ca3af' }}>
                {mode === 'saved' ? 'Saved Prompts' : 'Custom'}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0">
            {promptMode === 'saved' ? (
              <SystemPromptPanel
                selectedTypeKey={selectedTypeKey}
                onTypeChange={setSelectedTypeKey}
              />
            ) : (
              <div className="flex flex-col h-full rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(109,40,217,0.15)', backgroundColor: '#faf9ff' }}>
                <div className="shrink-0 px-3 pt-2.5 pb-2 flex items-center gap-1.5"
                  style={{ borderBottom: '1px solid rgba(109,40,217,0.1)' }}>
                  <Sparkles size={10} className="text-purple-500" />
                  <p className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">Custom Prompt</p>
                </div>
                <textarea
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Write your own system prompt..."
                  className="flex-1 min-h-0 w-full px-3 py-2.5 text-[10px] outline-none resize-none font-mono leading-relaxed text-neutral-800"
                  style={{ backgroundColor: '#faf9ff' }}
                />
              </div>
            )}
          </div>
        </div>

      ) : (

        <div className="flex-1 min-w-0 flex overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>

          <div className="flex-shrink-0 bg-neutral-950 flex items-start border-r overflow-hidden"
            style={{ width: 220, borderColor: 'rgba(255,255,255,0.05)' }}>
            <video
              src={selectedSession.videoUrl}
              controls
              className="w-full object-contain"
              style={{ maxHeight: '100%' }}
            />
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-4">
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

            {selectedSession.breakdown && (
              <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} className="text-violet-500" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Breakdown</p>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{selectedSession.breakdown}</p>
              </div>
            )}

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

      {/* ── Chat panel ── */}
      <div className="flex-1 min-w-0 flex flex-col rounded-xl overflow-hidden min-h-0"
        style={{
          border: '1px solid rgba(0,0,0,0.07)',
          borderTop: `2px solid ${COL_ACCENT}`,
          background: `${COL_ACCENT}04`,
        }}>

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
          style={{ borderBottom: `1px solid ${COL_ACCENT}18` }}>
          <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles size={9} className="text-white" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider flex-1" style={{ color: COL_ACCENT }}>
            {selectedSession?.label ? selectedSession.label : 'Conversation'}
          </p>
          <span className="text-[9px] text-neutral-400 flex-shrink-0">Gemini AI</span>
          {hasMessages && !hasSession && (
            <button onClick={() => setLocalMessages([])}
              className="flex items-center gap-1 text-[9px] text-neutral-400 hover:text-neutral-600 transition-colors ml-1">
              <RotateCcw size={8} /> Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0">
          {!hasMessages && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              {/* AI avatar */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }}>
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-neutral-700 mb-0.5">Gemini Video Intelligence</p>
                <p className="text-[10px] text-neutral-400">
                  {hasSession ? 'Ask me anything about this video' : 'Ready when you are'}
                </p>
              </div>
              {/* Intro bubble */}
              <div className="max-w-[240px] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[11px] text-neutral-600 leading-relaxed"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {hasSession
                  ? `I've analysed "${selectedSession?.label || 'this video'}". Ask me anything - hooks, emotions, captions, ideas.`
                  : 'Drop a video clip and run analysis. I\'ll break down the hook, emotions and engagement patterns — then we can chat about it.'}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                <Loader2 size={18} className="animate-spin text-white" />
              </div>
              <p className="text-sm font-medium text-neutral-600">
                {uploading ? 'Uploading to R2...' : 'Gemini is watching...'}
              </p>
            </div>
          )}

          <AnimatePresence>
            {allMessages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
          </AnimatePresence>

          {chatLoading && (
            <div className="flex gap-2 items-start">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                <Sparkles size={9} className="text-white" />
              </div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-sm"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <Loader2 size={13} className="animate-spin text-violet-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {canChat && (
          <div className="flex-shrink-0 px-3 pb-3 pt-2 flex gap-2"
            style={{ borderTop: `1px solid ${COL_ACCENT}12` }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFollowUp(); } }}
              placeholder="Ask a follow-up..."
              className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400"
              style={{ border: '1px solid rgba(0,0,0,0.09)', backgroundColor: '#fff' }}
              disabled={chatLoading}
            />
            <button onClick={sendFollowUp} disabled={!chatInput.trim() || chatLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:brightness-110 disabled:opacity-40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Send size={14} />
            </button>
          </div>
        )}
      </div>

      </div> {/* end main row */}
    </div>
  );
}
