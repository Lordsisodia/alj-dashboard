"use client";

import React from "react";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
};

export function Slider({ min = 0, max = 100, step = 1, value, onValueChange, className }: SliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    onValueChange?.([next]);
  };

  return (
    <input
      type="range"
      className={className}
      min={min}
      max={max}
      step={step}
      value={value[0] ?? min}
      onChange={handleChange}
    />
  );
}
