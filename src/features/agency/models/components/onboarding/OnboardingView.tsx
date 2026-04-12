'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { MODELS, KANBAN_COLUMNS } from '../../constants';
import { ONBOARDING_PHASES } from '../../types';
import type { ModelData, OnboardingPhaseStep } from '../../types';

function KanbanCard({ model, index }: { model: ModelData; index: number }) {
  const steps = (model.onboardingSteps as OnboardingPhaseStep[] | undefined) ?? [];
  const currentSteps = steps.filter((s) => s.phase === model.onboardingPhase);
  const doneCount = currentSteps.filter((s) => s.done).length;
  const phaseInfo = ONBOARDING_PHASES[model.onboardingPhase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl p-3 cursor-pointer"
      style={{
        backgroundColor: '#fff',
        border: `1px solid rgba(0,0,0,0.07)`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
        >
          {model.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{model.name}</p>
          <p className="text-[10px] text-neutral-400 truncate">{model.niche}</p>
        </div>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: `${model.color}18`, color: model.color }}
        >
          {doneCount}/{currentSteps.length}
        </span>
      </div>

      {/* Steps mini-list */}
      <div className="space-y-1 mb-2">
        {currentSteps.map((step, si) => (
          <div key={si} className="flex items-center gap-1.5">
            {step.done
              ? <CheckCircle2 size={11} className="flex-shrink-0" style={{ color: '#22c55e' }} />
              : <Circle size={11} className="flex-shrink-0 text-neutral-300" />}
            <span className="text-[11px] truncate" style={{ color: step.done ? '#171717' : '#a3a3a3' }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Phase badge */}
      <div className="flex items-center gap-1 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${model.color}15`, color: model.color }}
        >
          Phase {model.onboardingPhase}: {phaseInfo?.label}
        </span>
        <ArrowRight size={10} className="text-neutral-300 ml-auto flex-shrink-0" />
      </div>
    </motion.div>
  );
}

export function OnboardingView() {
  const onboardingModels = MODELS.filter((m) => m.onboardingPhase < 7);

  return (
    <div className="flex gap-3 p-4 h-full overflow-x-auto">
      {KANBAN_COLUMNS.map((col) => {
        const colModels = onboardingModels.filter((m) => {
          const phase = m.onboardingPhase;
          // Phase 1 = Application, Phase 2 = Profile Setup, Phase 3 = Content Brief,
          // Phase 4 = Training, Phase 5 = Pre-Launch+Active, Phase 6 = Active
          if (col.id === 1) return phase === 1;
          if (col.id === 2) return phase === 2;
          if (col.id === 3) return phase === 3;
          if (col.id === 4) return phase === 4;
          if (col.id === 5) return phase === 5 || phase === 6 || phase === 7;
          return false;
        });

        return (
          <div key={col.id} className="flex flex-col min-w-[220px] flex-1">
            {/* Column header */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-t-xl mb-2 flex-shrink-0"
              style={{ borderBottom: `2px solid rgba(0,0,0,0.07)` }}
            >
              <span className="text-xs font-semibold text-neutral-700">{col.label}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#525252' }}
              >
                {colModels.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
              {colModels.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-[11px] text-neutral-300">No models</p>
                </div>
              ) : (
                colModels.map((model, i) => (
                  <KanbanCard key={model.id} model={model} index={i} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
