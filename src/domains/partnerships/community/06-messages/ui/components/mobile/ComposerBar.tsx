"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SlidersHorizontal, Send } from "lucide-react";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { cn } from "@/lib/utils";

type ComposerBarProps = {
  onHeightChange?: (height: number) => void;
  bottomOffset?: number;
  maxWidthClassName?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
  sendDisabled?: boolean;
  inputDisabled?: boolean;
  topSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export function ComposerBar({
  onHeightChange,
  bottomOffset = 0,
  maxWidthClassName = "max-w-5xl w-full px-4",
  inputPlaceholder = "Message SISO",
  inputValue = "",
  onInputChange,
  onSend,
  sendDisabled = false,
  inputDisabled = false,
  topSlot,
  rightSlot,
}: ComposerBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!onHeightChange) return;
    const target = containerRef.current;
    if (!target) return;

    const emit = () => onHeightChange(target.offsetHeight);
    emit();

    const observer = new ResizeObserver(emit);
    observer.observe(target);
    return () => observer.disconnect();
  }, [onHeightChange]);

  return (
    <footer
      ref={containerRef}
      className="fixed inset-x-0 z-[75] rounded-t-2xl border border-white/10 bg-siso-bg-tertiary/90 backdrop-blur"
      style={{
        bottom: bottomOffset,
        boxShadow: "0 -18px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
    >
      <div className={cn("relative mx-auto w-full", maxWidthClassName)}>
        {topSlot ? (
          <div className="pointer-events-none absolute inset-x-0 -top-[64px] px-3.5">
            <div className="mb-3">{topSlot}</div>
          </div>
        ) : null}
        <div className="flex w-full items-center gap-3 px-3.5 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
          <div className="flex flex-1">
            <AnimatedGlowingSearchBar
              placeholder={inputPlaceholder}
              wrapperClassName="w-full"
              className="text-base font-sans"
              value={inputValue}
              onChange={(event) => onInputChange?.(event.target.value)}
              disabled={inputDisabled}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend?.();
                }
              }}
            />
          </div>
          {rightSlot}
          <button
            type="button"
            className="rounded-full bg-siso-orange px-3 py-1 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onSend}
            disabled={sendDisabled}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 hover:text-white"
            aria-label="More composer options"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
