'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, Upload, Wand2, UserPlus, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { MODELS } from '../../constants';
import { ONBOARDING_PHASES } from '../../types';
import type { OnboardingPhaseStep } from '../../types';

function hoursAgo(isoString: string): number {
  return (Date.now() - new Date(isoString).getTime()) / 3600000;
}

function formatHours(h: number): string {
  if (h < 1) return '<1hr';
  return `${Math.floor(h)}hr${Math.floor(h) !== 1 ? 's' : ''}`;
}

// Models actively in onboarding (phases 1-6 only)
function getOnboardingModels() {
  return MODELS.filter((m) => m.onboardingPhase < 7);
}

function getUrgencyRemaining(contractSignedAt?: string): number | null {
  if (!contractSignedAt) return null;
  const elapsed = hoursAgo(contractSignedAt);
  const remaining = 72 - elapsed;
  return remaining > 0 ? remaining : null;
}

function getFirstBlocker(steps: OnboardingPhaseStep[], phase: number): string | null {
  const current = steps.filter((s) => s.phase === phase);
  const blocker = current.find((s) => !s.done);
  return blocker?.label ?? null;
}

// Phase 6 - Live monitoring card (different treatment)
function LiveMonitoringCard({ model, index }: { model: (typeof MODELS)[0]; index: number }) {
  const router = useRouter();
  const steps = (model.onboardingSteps as OnboardingPhaseStep[] | undefined) ?? [];
  const currentSteps = steps.filter((s) => s.phase === model.onboardingPhase);
  const doneCount = currentSteps.filter((s) => s.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: '#fff', border: `1px solid ${model.color}30`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onClick={() => router.push(`/isso/models/${model.id}`)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${model.color}18`, color: model.color }}>
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{model.niche}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-neutral-400">Launch tasks</p>
            <p className="text-sm font-bold" style={{ color: model.color }}>{doneCount}/{currentSteps.length}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {currentSteps.map((step, si) => (
            <div key={si} className="flex items-center gap-2">
              {step.done
                ? <CheckCircle2 size={13} className="flex-shrink-0" style={{ color: '#22c55e' }} />
                : <Circle size={13} className="flex-shrink-0 text-neutral-300" />}
              <span className="text-xs" style={{ color: step.done ? '#171717' : '#a3a3a3' }}>{step.label}</span>
            </div>
          ))}
        </div>

        <button
          className="mt-3 w-full text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          style={{ backgroundColor: `${model.color}12`, color: model.color }}
          onClick={(e) => { e.stopPropagation(); router.push(`/isso/models/${model.id}`); }}
        >
          View model <ArrowRight size={11} />
        </button>
      </div>
    </motion.div>
  );
}

// Regular onboarding card (phases 1-5)
function OnboardingCard({ model, index }: { model: (typeof MODELS)[0]; index: number }) {
  const router = useRouter();
  const steps = (model.onboardingSteps as OnboardingPhaseStep[] | undefined) ?? [];
  const currentSteps = steps.filter((s) => s.phase === model.onboardingPhase);
  const phaseInfo = ONBOARDING_PHASES[model.onboardingPhase];
  const blockerLabel = getFirstBlocker(steps, model.onboardingPhase);
  const urgencyRemaining = getUrgencyRemaining(model.contractSignedAt);

  const isPhase4 = model.onboardingPhase === 4;
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl overflow-hidden cursor-pointer relative"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onClick={() => router.push(`/isso/models/${model.id}`)}
    >
      {/* Urgency stripe */}
      {urgencyRemaining !== null && (
        <div className="h-0.5 w-full" style={{ backgroundColor: '#f59e0b' }} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}aa)` }}
          >
            {model.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: `${model.color}18`, color: model.color }}
              >
                Phase {model.onboardingPhase}: {phaseInfo?.label}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{model.niche}</p>
          </div>
        </div>

        {/* Urgency signal */}
        {urgencyRemaining !== null && (
          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#f59e0b' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
            <span className="text-[11px] font-medium" style={{ color: '#92400e' }}>
              Launch window closes in {formatHours(urgencyRemaining)}
            </span>
          </div>
        )}

        {/* Phase 4 AI content progress */}
        {isPhase4 && (
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">AI Content Progress</span>
              <span className="text-[10px] font-bold" style={{ color: model.color }}>{model.contentReceived} / 50 approved</span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: model.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((model.contentReceived / 50) * 100, 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Blocker callout */}
        {blockerLabel && (
          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <AlertTriangle size={11} className="flex-shrink-0 text-neutral-400" />
            <span className="text-[11px] text-neutral-500">Blocked on: <span className="font-medium text-neutral-700">{blockerLabel}</span></span>
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-1.5 mb-3">
          {currentSteps.map((step, si) => {
            const isBlocker = !step.done && step.label === blockerLabel;
            return (
              <div key={si} className="flex items-center gap-2">
                {step.done
                  ? <CheckCircle2 size={13} className="flex-shrink-0" style={{ color: '#22c55e' }} />
                  : <Circle size={13} className={`flex-shrink-0 ${isBlocker ? 'text-amber-400' : 'text-neutral-300'}`} />}
                <span className={`text-xs ${step.done ? 'text-neutral-700' : isBlocker ? 'font-medium text-neutral-600' : 'text-neutral-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        {isPhase4 && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex-1 text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#525252' }}
              onClick={() => showToast('Opening References tab...')}
            >
              <Upload size={11} /> Upload References
            </button>
            <button
              className="flex-1 text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
              style={{ backgroundColor: `${model.color}15`, color: model.color }}
              onClick={() => showToast('Opening Content Gen...')}
            >
              <Wand2 size={11} /> Generate Batch
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none"
            style={{ backgroundColor: '#171717', color: '#fff', whiteSpace: 'nowrap' }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function OnboardingView() {
  const router = useRouter();
  const onboardingModels = getOnboardingModels();

  // Urgency banner - first model with open launch window
  const urgentModel = onboardingModels.find((m) => getUrgencyRemaining(m.contractSignedAt) !== null);

  if (onboardingModels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <CheckCircle2 size={32} className="text-green-400 mb-3" />
        <p className="text-sm font-semibold text-neutral-700 mb-1">All models active</p>
        <p className="text-xs text-neutral-400 mb-4">Nothing in onboarding right now</p>
        <button
          className="text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5"
          style={{ backgroundColor: '#ff006915', color: '#ff0069' }}
          onClick={() => {}}
        >
          <UserPlus size={12} /> Add new model
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {/* Top urgency banner */}
      {urgentModel && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
          style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}
          onClick={() => router.push(`/isso/models/${urgentModel.id}`)}
        >
          <Zap size={12} style={{ color: '#d97706' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#92400e' }}>
            {urgentModel.name} - launch window closes in {formatHours(getUrgencyRemaining(urgentModel.contractSignedAt)!)}
          </span>
          <ArrowRight size={11} style={{ color: '#d97706' }} className="ml-auto" />
        </motion.div>
      )}

      {/* Model cards */}
      {onboardingModels.map((model, i) =>
        model.onboardingPhase === 6
          ? <LiveMonitoringCard key={model.id} model={model} index={i} />
          : <OnboardingCard key={model.id} model={model} index={i} />
      )}
    </div>
  );
}
