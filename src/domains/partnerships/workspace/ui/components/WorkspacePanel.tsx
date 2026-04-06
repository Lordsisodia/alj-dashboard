import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspacePanelProps {
  title: string;
  state: "loading" | "empty" | "error" | "ready";
  children?: ReactNode;
  description?: string;
  errorMessage?: string;
  className?: string;
}

export function WorkspacePanel({ title, state, children, description, errorMessage, className }: WorkspacePanelProps) {
  return (
    <section className={cn("space-y-3 rounded-3xl border border-white/10 p-4", className)} aria-label={title}>
      <div>
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/70">{title}</h2>
        {description ? <p className="text-xs text-siso-text-muted">{description}</p> : null}
      </div>
      {state === "loading" && <p className="text-sm text-white/60">Loading...</p>}
      {state === "error" && <p className="text-sm text-red-300">{errorMessage ?? "Something went wrong."}</p>}
      {state === "empty" && <p className="text-sm text-white/60">Nothing here yet.</p>}
      {state === "ready" ? children : null}
    </section>
  );
}
