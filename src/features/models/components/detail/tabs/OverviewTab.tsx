'use client';

import { ExternalLink, User, TrendingUp, Film, Zap, BarChart2, Calendar } from 'lucide-react';
import type { ModelData, DetailTab } from '../../../types';
import { PIPELINE_STEPS } from '../../../constants';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-3 flex flex-col gap-1"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <p className="text-[11px] text-neutral-400 font-medium">{label}</p>
      <p className="text-base font-bold text-neutral-900">{value}</p>
    </div>
  );
}

export function OverviewTab({ model, onTabChange }: { model: ModelData; onTabChange: (tab: DetailTab) => void }) {
  const currentIndex = PIPELINE_STEPS.indexOf(model.pipelineStep);

  return (
    <div className="p-4 space-y-4">
      {/* 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile card */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
            >
              {model.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
              <p className="text-xs text-neutral-500">{model.niche}</p>
              <span
                className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: model.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)',
                  color: model.status === 'Active' ? '#16a34a' : '#737373',
                }}
              >
                {model.status}
              </span>
            </div>
          </div>

          {model.bio && (
            <p className="text-xs text-neutral-500 leading-relaxed">{model.bio}</p>
          )}

          <div className="space-y-1.5">
            <a
              href={`https://onlyfans.com/${model.handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium hover:underline"
              style={{ color: model.color }}
            >
              <ExternalLink size={11} />
              {model.handle} (OnlyFans)
            </a>
            {model.igHandle && (
              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <User size={11} />
                {model.igHandle} (Instagram)
              </p>
            )}
            {model.manager && (
              <p className="text-xs text-neutral-500">Manager: <span className="font-medium text-neutral-700">{model.manager}</span></p>
            )}
          </div>
        </div>

        {/* Stats + quick actions */}
        <div className="space-y-3">
          {/* Stats row */}
          <div className="flex gap-2">
            <StatCard label="MRR" value={model.mrr ? `£${model.mrr.toLocaleString()}/mo` : '-'} />
            <StatCard label="Subscribers" value={model.subscribers ? model.subscribers.toLocaleString() : '-'} />
            <StatCard label="In Pipeline" value={`${model.reelsInPipeline} reels`} />
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <a
              href="/isso/content-gen"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              <Zap size={12} />
              Generate Content
            </a>
            <button
              onClick={() => onTabChange('analytics')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)', color: '#525252' }}
            >
              <BarChart2 size={12} />
              Analytics
            </button>
            <a
              href="/isso/schedule"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)', color: '#525252' }}
            >
              <Calendar size={12} />
              Schedule
            </a>
          </div>

          {/* Pipeline stepper */}
          <div
            className="rounded-xl p-3"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Current Step</p>
            <div className="flex items-center gap-0 w-full">
              {PIPELINE_STEPS.map((step, i) => {
                const isDone = i < currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={step} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: isDone || isCurrent ? model.color : 'rgba(0,0,0,0.12)',
                          boxShadow: isCurrent ? `0 0 0 3px ${model.color}25` : undefined,
                        }}
                      />
                      <span
                        className="text-[9px] font-medium mt-1 whitespace-nowrap"
                        style={{ color: isCurrent ? model.color : isDone ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' }}
                      >
                        {step}
                      </span>
                    </div>
                    {i < PIPELINE_STEPS.length - 1 && (
                      <div
                        className="h-px flex-1 mx-1 mb-4"
                        style={{ backgroundColor: i < currentIndex ? model.color : 'rgba(0,0,0,0.1)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
