export type HubWidgetId = "earnings" | "pipeline" | "workspace" | "community";

export interface HubWidget<TData = unknown> {
  id: HubWidgetId;
  title: string;
  description: string;
  data: TData;
  ctaHref?: string;
  ctaLabel?: string;
  analyticsEvent?: string;
}

export interface HubWidgetConfig {
  id: HubWidgetId;
  title: string;
  description: string;
  href: string;
  analyticsEvent?: string;
}

export const HUB_WIDGET_CONFIGS: HubWidgetConfig[] = [
  {
    id: "earnings",
    title: "Earnings",
    description: "Wallet balance, tier progress, challenges",
    href: "/partners/earnings",
    analyticsEvent: "hub_widget_earnings_click",
  },
  {
    id: "pipeline",
    title: "Pipeline",
    description: "Prospects and submit-client status",
    href: "/partners/pipeline-ops",
    analyticsEvent: "hub_widget_pipeline_click",
  },
  {
    id: "workspace",
    title: "Workspace",
    description: "Tasks, notes, files",
    href: "/partners/workspace",
    analyticsEvent: "hub_widget_workspace_click",
  },
  {
    id: "community",
    title: "Community",
    description: "Wins, announcements, messages",
    href: "/partners/community",
    analyticsEvent: "hub_widget_community_click",
  },
];
