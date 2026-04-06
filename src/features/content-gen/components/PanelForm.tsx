'use client';

import { AtSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Field } from './Field';
import { NICHES, AVATAR_COLORS, GRAD } from '../constants';
import type { Niche, PanelState } from '../types';

interface Props {
  form: PanelState;
  onChange: <K extends keyof PanelState>(k: K, v: PanelState[K]) => void;
}

export function PanelForm({ form, onChange }: Props) {
  return (
    <div className="px-5 py-5 space-y-5">
      <Field label="Name" required>
        <input
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. Kiroko"
          className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 outline-none"
          style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)' }}
        />
      </Field>

      <Field label="Niche">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(NICHES) as Niche[]).map(n => {
            const isActive = form.niche === n;
            const cfg = NICHES[n];
            return (
              <button
                key={n}
                onClick={() => onChange('niche', n)}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-semibold transition-all',
                  isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-90',
                )}
                style={{ backgroundColor: cfg.bg, color: cfg.text }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Handles">
        <div className="space-y-2">
          {(['OF', 'IG'] as const).map(platform => (
            <div
              key={platform}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <span className="text-xs text-neutral-400 font-medium flex-shrink-0">{platform}</span>
              <AtSign size={12} className="text-neutral-300 flex-shrink-0" />
              <input
                value={platform === 'OF' ? form.ofHandle : form.igHandle}
                onChange={e => onChange(
                  platform === 'OF' ? 'ofHandle' : 'igHandle',
                  e.target.value.replace(/^@/, ''),
                )}
                placeholder="handle"
                className="flex-1 text-sm text-neutral-900 bg-transparent outline-none"
              />
            </div>
          ))}
        </div>
      </Field>

      <Field label="Status">
        <div className="flex gap-2">
          {(['Active', 'Draft'] as const).map(s => {
            const isActive = (s === 'Active') === form.active;
            return (
              <button
                key={s}
                onClick={() => onChange('active', s === 'Active')}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive ? 'text-white' : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200',
                )}
                style={isActive ? { background: GRAD } : undefined}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Card Color">
        <div className="flex gap-2 flex-wrap">
          {AVATAR_COLORS.map(c => (
            <button
              key={c}
              onClick={() => onChange('avatarColor', c)}
              className={cn(
                'w-8 h-8 rounded-full transition-all',
                form.avatarColor === c && 'ring-2 ring-offset-2 ring-neutral-700 scale-110',
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </Field>

      <Field label="Style Notes" hint="Lighting, makeup, vibe, location preferences">
        <textarea
          value={form.bio}
          onChange={e => onChange('bio', e.target.value)}
          placeholder="e.g. Golden hour lighting, minimal makeup, outdoor settings..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm text-neutral-900 outline-none resize-none"
          style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)' }}
        />
      </Field>
    </div>
  );
}
