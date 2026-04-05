import React from "react";
import { Waves } from "@/components/ui/wave-background";
import { cn } from "@/domains/shared/utils/cn";

type PartnershipsWaveBackdropProps = {
  className?: string;
  position?: "absolute" | "fixed";
  style?: React.CSSProperties;
  /** Hex/rgb for wave stroke */
  strokeColor?: string;
  /** Background under the waves (default transparent so gradients show through) */
  waveBackgroundColor?: string;
  /** Tailwind classes for the Waves canvas sizing */
  wavesClassName?: string;
  /** Opacity for the waves layer (0-1) */
  waveOpacity?: number;
  /** Pointer size for wave field */
  pointerSize?: number;
  /** Top/inner colors for the radial wash */
  radialTop?: string;
  radialBase?: string;
  /** Gradient overlay tailwind classes */
  overlayClassName?: string;
  /** Blur radius (px) applied to waves layer */
  waveBlurPx?: number;
  /** Blur radius (px) applied to the overlay; set 0 to disable */
  overlayBlurPx?: number;
};

/**
 * Shared animated backdrop used on Tier Progress and other partnership screens.
 * Combines a warm radial wash, blurred animated waves, and a dark vignette.
 */
export function PartnershipsWaveBackdrop({
  className,
  position = "absolute",
  strokeColor = "#f8a75c",
  waveBackgroundColor = "transparent",
  wavesClassName = "h-[110%] w-full",
  waveOpacity = 0.55,
  pointerSize = 0.32,
  radialTop = "#20140a",
  radialBase = "#050505",
  overlayClassName = "bg-gradient-to-b from-black/35 via-black/55 to-black/80",
  waveBlurPx = 6,
  overlayBlurPx = 2,
  style,
}: PartnershipsWaveBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none inset-0 overflow-hidden",
        position === "fixed" ? "fixed" : "absolute",
        className,
      )}
      style={{ zIndex: style?.zIndex ?? 0, ...style }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top, ${radialTop}, ${radialBase})`,
          opacity: 0.8,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ filter: `blur(${waveBlurPx}px)`, opacity: waveOpacity }}
      >
        <Waves
          className={wavesClassName}
          strokeColor={strokeColor}
          backgroundColor={waveBackgroundColor}
          pointerSize={pointerSize}
        />
      </div>

      <div
        className={cn("absolute inset-0", overlayClassName)}
        style={
          overlayBlurPx && overlayBlurPx > 0
            ? { backdropFilter: `blur(${overlayBlurPx}px)` }
            : undefined
        }
      />
    </div>
  );
}
