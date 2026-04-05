import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { loadHubWidgets } from "@/domains/partnerships/partnership-hub/application/aggregateDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { HUB_WIDGET_CONFIGS } from "@/domains/partnerships/partnership-hub/domain/widgets";

export async function HubOverview() {
  const result = await loadHubWidgets()
  const widgets = result.status === "ok" ? result.data : undefined

  return (
    <div className="grid gap-4">
      <WidgetCard
        title="Wallet"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "earnings")?.href}
        value={widgets?.earnings.walletSummary.balance.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—"}
        loading={!widgets}
      />

      <WidgetCard
        title="Pipeline prospects"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "pipeline")?.href}
        value={widgets?.pipeline.prospectCount?.toString()}
        loading={!widgets}
        fallback={<Skeleton className="h-5 w-12 bg-white/10" />}
      />

      <WidgetCard
        title="Workspace tasks"
        href={HUB_WIDGET_CONFIGS.find((c) => c.id === "workspace")?.href}
        value={widgets?.workspace.tasks.length ? `${widgets.workspace.tasks.length} open` : "No tasks"}
        loading={!widgets}
      />
    </div>
  )
}

function WidgetCard({
  title,
  href,
  value,
  loading,
  fallback,
}: {
  title: string;
  href?: string;
  value?: string;
  loading?: boolean;
  fallback?: React.ReactNode;
}) {
  const content = loading ? fallback ?? <Skeleton className="h-5 w-20 bg-white/10" /> : value ?? "—";
  return (
    <section className="rounded-3xl border border-white/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/70">{title}</h2>
        {href ? (
          <Link href={href} className="inline-flex items-center gap-1 text-xs text-siso-text-muted hover:text-white">
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
      <p className="mt-2 text-white/80">{content}</p>
    </section>
  );
}
