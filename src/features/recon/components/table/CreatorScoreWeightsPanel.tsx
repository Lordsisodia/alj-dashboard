'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import {
  CreatorScoreWeights,
  DEFAULT_WEIGHTS,
  saveWeights,
} from '@/features/recon/constants/creatorScoreWeights';

interface Props {
  open:     boolean;
  onClose:  () => void;
  weights:  CreatorScoreWeights;
  onChange: (w: CreatorScoreWeights) => void;
}

interface SliderRowProps {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step:     number;
  display:  string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, step, display, onChange }: SliderRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/60">{label}</span>
        <span className="text-[11px] font-mono text-white/80 tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500 bg-white/10"
      />
    </div>
  );
}

export function CreatorScoreWeightsPanel({ open, onClose, weights, onChange }: Props) {
  const signalTotal = weights.virality + weights.engagement + weights.audience + weights.followRatio + weights.activity;
  const totalStr    = signalTotal.toFixed(2);
  const totalInRange = Math.abs(signalTotal - 1.0) <= 0.05;

  function handleSlider(key: keyof CreatorScoreWeights, raw: number) {
    const next = { ...weights, [key]: raw };
    saveWeights(next);
    onChange(next);
  }

  function handleReset() {
    saveWeights(DEFAULT_WEIGHTS);
    onChange(DEFAULT_WEIGHTS);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="weights-panel"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0,  opacity: 1 }}
          exit={{    x: 20, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute right-4 top-16 z-50 w-80 rounded-2xl shadow-xl"
          style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-[13px] font-semibold text-white">Score Weights</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                title="Reset to defaults"
              >
                <RotateCcw size={10} />
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-6 h-6 rounded-lg transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                title="Close"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p className="px-4 pb-3 text-[11px] leading-relaxed text-white/35">
            Weights should roughly sum to 1.0 — tweak to match your priorities.
          </p>

          <div className="px-4 pb-4 flex flex-col gap-4">
            {/* Signal weights section */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Signal weights
              </span>
              <SliderRow
                label="Virality"
                value={weights.virality}
                min={0} max={1} step={0.01}
                display={weights.virality.toFixed(2)}
                onChange={(v) => handleSlider('virality', v)}
              />
              <SliderRow
                label="Engagement"
                value={weights.engagement}
                min={0} max={1} step={0.01}
                display={weights.engagement.toFixed(2)}
                onChange={(v) => handleSlider('engagement', v)}
              />
              <SliderRow
                label="Audience"
                value={weights.audience}
                min={0} max={1} step={0.01}
                display={weights.audience.toFixed(2)}
                onChange={(v) => handleSlider('audience', v)}
              />
              <SliderRow
                label="Follow ratio"
                value={weights.followRatio}
                min={0} max={1} step={0.01}
                display={weights.followRatio.toFixed(2)}
                onChange={(v) => handleSlider('followRatio', v)}
              />
              <SliderRow
                label="Activity"
                value={weights.activity}
                min={0} max={1} step={0.01}
                display={weights.activity.toFixed(2)}
                onChange={(v) => handleSlider('activity', v)}
              />
            </div>

            {/* Separator */}
            <div className="h-px bg-white/[0.06]" />

            {/* Bonus caps section */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Bonus caps
              </span>
              <SliderRow
                label="Live boost cap"
                value={weights.liveBoostMax}
                min={0} max={30} step={1}
                display={String(weights.liveBoostMax)}
                onChange={(v) => handleSlider('liveBoostMax', v)}
              />
              <SliderRow
                label="Quality flags cap"
                value={weights.qualityFlagMax}
                min={0} max={30} step={1}
                display={String(weights.qualityFlagMax)}
                onChange={(v) => handleSlider('qualityFlagMax', v)}
              />
            </div>

            {/* Separator */}
            <div className="h-px bg-white/[0.06]" />

            {/* Footer summary */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/35">Current weights total</span>
              <span
                className="text-[12px] font-mono font-semibold tabular-nums"
                style={{ color: totalInRange ? '#4ade80' : '#fbbf24' }}
              >
                {totalStr}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
