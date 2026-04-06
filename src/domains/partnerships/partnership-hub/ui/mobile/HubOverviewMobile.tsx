"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { loadHubWidgets } from "@/domains/partnerships/partnership-hub/application/aggregateDashboard";
import { HUB_WIDGET_CONFIGS } from "@/domains/partnerships/partnership-hub/domain/widgets";

type WidgetCardProps = {
  title: string;
  href?: string;
  value?: string;
  loading?: boolean;
};

const WidgetCard = ({ title, href, value, loading }: WidgetCardProps) => (
  <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-sm uppercase tracking-[0.25em] text-white/70">{title}</h2>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-1 text-xs text-siso-text-muted hover:text-white">
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
    <p className="mt-2 text-white/80">
      {loading ? <Skeleton className="h-5 w-20 bg-white/10" /> : value ?? "-"}
    </p>
  </section>
);

export function HubOverviewMobile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | undefined>();
  const [pipeline, setPipeline] = useState<string | undefined>();
  const [tasks, setTasks] = useState<string | undefined>();

  useEffect(() => {
    loadHubWidgets()
      .then((res) => {
        if (res.status === "error") {
          setError("Hub data unavailable");
          return;
        }
        setWallet(
          res.data.earnings.walletSummary.balance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
        );
        setPipeline(res.data.pipeline.prospectCount?.toString());
        setTasks(res.data.workspace.tasks.length ? `${res.data.workspace.tasks.length} open` : "No tasks");
      })
      .catch(() => setError("Hub data unavailable"))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
        <p className="text-sm font-semibold">Hub data is unavailable right now.</p>
        <p className="text-xs opacity-80">We'll show cached stats once the service recovers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <WidgetCard
        title="Wallet"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "earnings")?.href}
        value={wallet}
        loading={loading}
      />
      <WidgetCard
        title="Pipeline prospects"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "pipeline")?.href}
        value={pipeline}
        loading={loading}
      />
      <WidgetCard
        title="Workspace tasks"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "workspace")?.href}
        value={tasks}
        loading={loading}
      />
    </div>
  );
}

export default HubOverviewMobile;
