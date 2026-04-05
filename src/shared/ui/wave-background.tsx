"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { WavesProps } from "./wave-background/AnimatedWaves";

const AnimatedWaves = dynamic(() => import("./wave-background/AnimatedWaves").then((mod) => mod.AnimatedWaves), {
  ssr: false,
  loading: () => null,
});

function usePrefersAnimatedBackground() {
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanAnimate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return canAnimate;
}

function GradientFallback({ className, backgroundColor }: { className?: string; backgroundColor?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `linear-gradient(135deg, ${backgroundColor ?? "rgba(8,8,8,0.95)"}, rgba(32,32,32,0.85))`,
      }}
    />
  );
}

export function Waves({ className = "", backgroundColor, strokeColor, pointerSize }: WavesProps) {
  const [mounted, setMounted] = useState(false);
  const canAnimate = usePrefersAnimatedBackground();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !canAnimate) {
    return <GradientFallback className={className} backgroundColor={backgroundColor} />;
  }

  return <AnimatedWaves className={className} backgroundColor={backgroundColor} strokeColor={strokeColor} pointerSize={pointerSize} />;
}

export { AnimatedWaves as HeroWaves } from "./wave-background/AnimatedWaves";
export type { WavesProps };
