'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { IssuePriority } from '../../types';
import { X } from 'lucide-react';

const AGENTS = ['Recon Scraper #1', 'Recon Scraper #2', 'Intelligence Indexer', 'Post Scheduler Bot', 'Weekly Report Agent'];
const PRIORITIES: IssuePriority[] = ['low', 'medium', 'high', 'urgent'];

export function IssueCreateModal({ onClose }: { onClose: () => void }) {
  const create = useMutation(api.issues.create);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [assigneeAgent, setAssigneeAgent] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    setPending(true);
    await create({ title, description: description || undefined, priority, assigneeAgent: assigneeAgent || undefined });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">New Issue</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400">
            <X size={14} />
          </button>
        </div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Issue title"
          className="w-full px-3 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
          style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }} />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)"
          rows={3} className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none focus:ring-2 focus:ring-pink-300"
          style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }} />
        <div className="flex gap-2">
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => setPriority(p)}
              className="flex-1 py-2 rounded-xl text-[11px] font-bold uppercase transition-all"
              style={priority === p ? { background: 'linear-gradient(135deg,#ff0069,#833ab4)', color: '#fff' }
                : { backgroundColor: 'rgba(0,0,0,0.04)', color: '#888', border: '1px solid rgba(0,0,0,0.08)' }}>
              {p}
            </button>
          ))}
        </div>
        <select value={assigneeAgent} onChange={e => setAssigneeAgent(e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
          style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}>
          <option value="">No assignee</option>
          {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim() || pending}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
            {pending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
