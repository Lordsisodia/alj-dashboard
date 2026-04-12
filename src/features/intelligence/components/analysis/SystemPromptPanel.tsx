'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ChevronDown, Pencil, X, Sparkles } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';

const PURPLE_GRAD = 'linear-gradient(135deg, #6d28d9, #4c1d95)';

// ── Sub-components ────────────────────────────────────────────────────────────

function TypeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-[9px] font-semibold whitespace-nowrap transition-all"
      style={active
        ? { background: PURPLE_GRAD, color: '#fff' }
        : { backgroundColor: 'rgba(0,0,0,0.05)', color: '#6b7280' }}
    >
      {label}
    </button>
  );
}

function VersionPill({
  version, name, active, onClick,
}: { version: number; name: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-semibold whitespace-nowrap transition-all border"
      style={active
        ? { background: 'rgba(109,40,217,0.08)', borderColor: 'rgba(109,40,217,0.3)', color: '#6d28d9' }
        : { backgroundColor: 'transparent', borderColor: 'rgba(0,0,0,0.1)', color: '#9ca3af' }}
    >
      {active && <Check size={7} />}
      v{version}{name !== `v${version}` ? ` · ${name}` : ''}
    </button>
  );
}

// ── New type modal ────────────────────────────────────────────────────────────

function NewTypeForm({ onClose }: { onClose: () => void }) {
  const [label,  setLabel]  = useState('');
  const [prompt, setPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const createType = useMutation(api.analysisPrompts.createType);

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }

  async function handleSave() {
    if (!label.trim() || !prompt.trim()) return;
    setSaving(true);
    try {
      await createType({ typeKey: slugify(label), typeLabel: label.trim(), name: 'v1', prompt: prompt.trim() });
      onClose();
    } catch (e: any) {
      alert(e.message ?? 'Failed to create type');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2.5 rounded-xl border border-purple-200 bg-purple-50/40">
      <p className="text-[9px] font-semibold text-purple-700 uppercase tracking-wide">New prompt type</p>
      <input
        autoFocus
        placeholder="Type name e.g. Fashion Focus"
        value={label}
        onChange={e => setLabel(e.target.value)}
        className="w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-purple-400"
      />
      <textarea
        placeholder="Write the system prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        rows={5}
        className="w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-purple-400 resize-none font-mono leading-relaxed"
      />
      <div className="flex gap-1.5">
        <button onClick={onClose}
          className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving || !label.trim() || !prompt.trim()}
          className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: PURPLE_GRAD }}>
          {saving ? 'Creating...' : 'Create type'}
        </button>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface SystemPromptPanelProps {
  selectedTypeKey: string;
  onTypeChange: (key: string) => void;
}

export function SystemPromptPanel({ selectedTypeKey, onTypeChange }: SystemPromptPanelProps) {
  const [isEditing,        setIsEditing]        = useState(false);
  const [editText,         setEditText]          = useState('');
  const [versionName,      setVersionName]       = useState('');
  const [showNewType,      setShowNewType]       = useState(false);
  const [saving,           setSaving]            = useState(false);

  const ensureDefaults  = useMutation(api.analysisPrompts.ensureDefaults);
  const saveNewVersion  = useMutation(api.analysisPrompts.saveNewVersion);
  const setActiveVersion = useMutation(api.analysisPrompts.setActiveVersion);

  const types    = useQuery(api.analysisPrompts.listTypes);
  const versions = useQuery(api.analysisPrompts.listVersionsForType, { typeKey: selectedTypeKey });

  const activeType    = types?.find(t => t.typeKey === selectedTypeKey);
  const activeVersion = versions?.find(v => v.isActive) ?? versions?.[0] ?? null;

  // Seed defaults on first load
  useEffect(() => { ensureDefaults(); }, [ensureDefaults]);

  // Pick first type once loaded
  useEffect(() => {
    if (types && types.length > 0 && !types.find(t => t.typeKey === selectedTypeKey)) {
      onTypeChange(types[0].typeKey);
    }
  }, [types, selectedTypeKey, onTypeChange]);

  function startEdit() {
    setEditText(activeVersion?.prompt ?? '');
    setVersionName('');
    setIsEditing(true);
  }

  async function handleSave() {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await saveNewVersion({
        typeKey:   selectedTypeKey,
        typeLabel: activeType?.typeLabel ?? selectedTypeKey,
        name:      versionName.trim() || `v${(versions?.length ?? 0) + 1}`,
        prompt:    editText.trim(),
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const isLoading = types === undefined || versions === undefined;

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(109,40,217,0.15)', backgroundColor: '#faf9ff' }}>

      {/* Header */}
      <div className="shrink-0 px-3 pt-2.5 pb-2"
        style={{ borderBottom: '1px solid rgba(109,40,217,0.1)' }}>
        <div className="flex items-center gap-1 mb-2">
          <Sparkles size={10} className="text-purple-500 shrink-0" />
          <p className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">Analysis Prompts</p>
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {isLoading ? (
            <div className="h-5 w-24 rounded-full animate-pulse bg-neutral-200" />
          ) : (
            types?.map(t => (
              <TypeTab key={t.typeKey} label={t.typeLabel} active={t.typeKey === selectedTypeKey}
                onClick={() => { onTypeChange(t.typeKey); setIsEditing(false); }} />
            ))
          )}
          <button
            onClick={() => { setShowNewType(v => !v); setIsEditing(false); }}
            className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[9px] font-semibold text-neutral-400 hover:text-purple-500 hover:bg-purple-50 transition-colors border border-dashed border-neutral-300"
          >
            <Plus size={8} /> New
          </button>
        </div>
      </div>

      {/* Version pills */}
      {!showNewType && (
        <div className="shrink-0 px-3 py-2 flex items-center gap-1 flex-wrap"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {isLoading ? (
            <div className="h-4 w-16 rounded-full animate-pulse bg-neutral-200" />
          ) : (
            versions?.map(v => (
              <VersionPill
                key={v._id}
                version={v.version}
                name={v.name}
                active={v.isActive}
                onClick={() => setActiveVersion({ id: v._id as Id<'analysisPrompts'> })}
              />
            ))
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 flex flex-col px-3 py-2 gap-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {showNewType ? (
            <motion.div key="new-type" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto">
              <NewTypeForm onClose={() => setShowNewType(false)} />
            </motion.div>
          ) : isEditing ? (
            <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 flex-1 min-h-0">
              <input
                placeholder={`Version name e.g. "fashion-focused"`}
                value={versionName}
                onChange={e => setVersionName(e.target.value)}
                className="shrink-0 w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-purple-400"
              />
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="flex-1 min-h-0 w-full text-[10px] px-2.5 py-2 rounded-lg border border-purple-300 focus:outline-none focus:border-purple-500 resize-none font-mono leading-relaxed bg-white"
              />
              <div className="shrink-0 flex gap-1.5">
                <button onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 transition-colors">
                  <X size={9} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !editText.trim()}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: PURPLE_GRAD }}>
                  {saving ? 'Saving...' : <><Check size={9} /> Save as new version</>}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 min-h-0 gap-2">
              {isLoading ? (
                <div className="flex-1 rounded-lg animate-pulse bg-neutral-100" />
              ) : activeVersion ? (
                <div className="flex-1 min-h-0 overflow-y-auto rounded-lg bg-white px-2.5 py-2"
                  style={{ border: '1px solid rgba(0,0,0,0.07)', fontSize: '9px', lineHeight: 1.7, color: '#374151', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {activeVersion.prompt}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[10px] text-neutral-400">
                  No prompt yet
                </div>
              )}
              <button
                onClick={startEdit}
                className="shrink-0 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[10px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
              >
                <Pencil size={9} /> Edit &amp; save as new version
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
