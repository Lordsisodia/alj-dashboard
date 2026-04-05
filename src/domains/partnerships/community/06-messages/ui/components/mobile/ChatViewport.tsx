"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatViewportProps = {
  children: ReactNode;
  threadName: string;
  threadStatus?: string;
  avatarLabel?: string;
  contentOffset?: number;
  maxWidthClassName?: string;
  isDirectoryOpen?: boolean;
  onOpenDirectory?: () => void;
  showAppDrawerButton?: boolean;
  onOpenAppDrawer?: () => void;
  showHeader?: boolean;
  showDirectoryToggle?: boolean;
  showBurger?: boolean;
};

export function ChatViewport({
  children,
  threadName,
  threadStatus,
  avatarLabel = "GC",
  contentOffset = 120,
  maxWidthClassName = "mx-auto w-full max-w-5xl px-4",
  isDirectoryOpen = false,
  onOpenDirectory,
  showAppDrawerButton = false,
  onOpenAppDrawer,
  showHeader = true,
  showDirectoryToggle = true,
  showBurger = true,
}: ChatViewportProps) {
  const paddingBottom = Math.max(contentOffset, 88);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (!showHeader) {
      setHeaderHeight(0);
      return;
    }
    const node = headerRef.current;
    if (!node) return;
    const measure = () => setHeaderHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [showHeader]);

  return (
    <section className="relative flex flex-1 flex-col font-sans">
      {showHeader ? (
        <header
          ref={headerRef}
          className={cn(
            "fixed left-1/2 top-0 z-[84] mb-1 flex w-full -translate-x-1/2 items-center gap-3 rounded-b-2xl border border-white/10 bg-gradient-to-b from-[#1a120c]/95 via-[#110c08]/92 to-[#0c0b0a]/90 px-3 py-1.5 backdrop-blur transition-opacity",
            maxWidthClassName,
            isDirectoryOpen && "pointer-events-none",
          )}
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,255,255,0.18)" }}
        >
          {showDirectoryToggle ? (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="inline-flex items-center text-siso-text-primary transition hover:text-siso-orange"
              aria-label="Open message directory"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}

          <button
            type="button"
            className="flex flex-1 items-center gap-2 overflow-hidden rounded-full px-2 py-1 text-left transition hover:bg-white/5"
            disabled
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-siso-orange/20 text-[10px] font-semibold uppercase text-siso-orange">
              {avatarLabel}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold uppercase tracking-[0.35em] text-siso-text-primary">
                {threadName}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-siso-text-muted">
                {threadStatus}
              </span>
            </div>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {showBurger ? (
              <button
                type="button"
                onClick={onOpenAppDrawer}
                className="inline-flex items-center text-siso-text-muted transition hover:text-siso-orange"
                aria-label="Open app drawer"
              >
                <Menu className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </header>
      ) : null}

      {showHeader ? <div style={{ height: headerHeight }} aria-hidden /> : null}

      <div className={cn("relative flex-1 overflow-x-hidden overflow-y-auto", maxWidthClassName)}>
        <div className="space-y-4 pb-6" style={{ paddingBottom, paddingTop: 6 }}>
          {children}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
    </section>
  );
}
