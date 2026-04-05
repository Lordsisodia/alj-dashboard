'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SettingsCard } from '../controls/SettingsCard';
import { TAB_TRANSITION } from '../../constants';

const CONTENT_TYPES = ['Reel', 'Photo Set', 'Story', 'PPV'];

export function ContentDefaultsTab() {
  const [contentType, setContentType] = useState('Reel');
  const [hashtags, setHashtags] = useState('#onlyfans #creator #exclusive');
  const [scheduleTime, setScheduleTime] = useState('19:00');

  return (
    <motion.div
      key="content"
      {...TAB_TRANSITION}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-0.5">Content Defaults</h2>
        <p className="text-sm text-neutral-500">Set defaults for new posts and schedules.</p>
      </div>

      <SettingsCard>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Default Content Type</h3>
        <div className="flex gap-2 flex-wrap">
          {CONTENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: contentType === type ? 'rgba(255,0,105,0.08)' : '#fafafa',
                color:           contentType === type ? '#ff0069' : '#6b7280',
                border:          contentType === type ? '1px solid rgba(255,0,105,0.3)' : '1px solid rgba(0,0,0,0.08)',
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
