"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BadgeTagProps {
  /** Content rendered inside the inner callout card (left side) */
  tag: React.ReactNode;
  /** Content rendered as plain text (right side) */
  label: React.ReactNode;
  className?: string;
  tagClassName?: string;
  labelClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A two-part pill: an inner callout card on the left and plain text on the right.
 *
 * Usage:
 *   <BadgeTag tag="Version 7.8" label="New feature is ready to use" />
 *   <BadgeTag tag={<><PackageIcon /> Your Order</>} label="Track your order" />
 */
export function BadgeTag({ tag, label, className, tagClassName, labelClassName }: BadgeTagProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 border border-gray-500/20 rounded-full bg-gray-500/[0.06] p-1 text-sm",
        className
      )}
    >
      {/* Inner callout card */}
      <div
        className={cn(
          "bg-white border border-gray-500/20 rounded-2xl px-2.5 py-0.5 flex items-center gap-1.5 flex-shrink-0",
          tagClassName
        )}
      >
        {tag}
      </div>
      {/* Right label */}
      <span className={cn("pr-2.5 text-[11px] text-neutral-600 whitespace-nowrap tabular-nums", labelClassName)}>
        {label}
      </span>
    </div>
  );
}
