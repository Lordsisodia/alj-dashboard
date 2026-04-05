import React, { useEffect } from "react";
import { Waves } from "@/components/ui/wave-background";
import { cn } from "@/domains/shared/utils/cn";

type Props = {
  className?: string;
};

/**
 * Landing-specific animated backdrop:
 * - Radial glow offset to the upper-left for depth
 * - Gentle hue-rotate animation to keep the warm tone alive without staying static
 */
export function LandingWaveBackdrop({ className }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("landing-wave-backdrop-keyframes")) return;
    const style = document.createElement("style");
    style.id = "landing-wave-backdrop-keyframes";
    style.innerHTML = `
      @keyframes landingHueShift {
        0% { filter: hue-rotate(0deg); }
        45% { filter: hue-rotate(14deg); }
        100% { filter: hue-rotate(-10deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ zIndex: -10, animation: "landingHueShift 14s ease-in-out infinite alternate" }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 18% 28%, #20140a, #050505)",
          opacity: 0.8,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ filter: "blur(6px)", opacity: 0.68 }}
      >
        <Waves
          className="h-[115%] w-full"
          strokeColor="#ffc27d"
          backgroundColor="transparent"
          pointerSize={0.32}
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/80"
        style={{ backdropFilter: "blur(2px)" }}
      />
    </div>
  );
}
