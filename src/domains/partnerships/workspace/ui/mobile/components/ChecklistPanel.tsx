"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, TimerReset } from "lucide-react";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "complete";
  eta?: string;
};

const defaultItems: ChecklistItem[] = [
  {
    id: "profile",
    title: "Complete partner profile",
    description: "Upload logo, add two showcase industries, and lock your launch quote.",
    status: "in-progress",
    eta: "5 min",
  },
  {
    id: "academy",
    title: "Finish Academy mission",
    description: "Watch the PayPal payouts lesson + submit the recap quiz.",
    status: "pending",
    eta: "12 min",
  },
  {
    id: "wallet",
    title: "Verify wallet routing",
    description: "Connect PayPal sandbox + run the compliance checklist.",
    status: "pending",
    eta: "8 min",
  },
  {
    id: "pipeline",
    title: "Log a lead",
    description: "Add one prospect with <$25k ACV into pipeline ops.",
    status: "complete",
  },
];

const statusOrder: ChecklistItem["status"][] = ["pending", "in-progress", "complete"];

export function ChecklistPanel() {
  const [items, setItems] = useState(defaultItems);

  const progressPercent = useMemo(() => {
    const completed = items.filter((item) => item.status === "complete").length;
    return Math.round((completed / items.length) * 100);
  }, [items]);

  const nextStatus = (current: ChecklistItem["status"]): ChecklistItem["status"] => {
    const index = statusOrder.indexOf(current);
    const nextIndex = Math.min(index + 1, statusOrder.length - 1);
    return statusOrder[nextIndex];
  };

  const advanceItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus(item.status) } : item)),
    );
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/70 p-4 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Partner checklist</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">Momentum board</p>
          <span className="text-sm text-white/70">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-siso-orange to-orange-300 transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <div className="space-y-3">
        {items.map((item) => {
          const isComplete = item.status === "complete";
          const Icon = isComplete ? CheckCircle2 : Circle;
          return (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/65">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => advanceItem(item.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.3em]",
                    isComplete
                      ? "border-emerald-400/50 text-emerald-300"
                      : "border-white/20 text-white/70 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {isComplete ? "Done" : "Advance"}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/55">
                <span>{item.status.replace("-", " ")}</span>
                {item.eta ? (
                  <span className="inline-flex items-center gap-1">
                    <TimerReset className="h-3.5 w-3.5" />
                    {item.eta}
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
