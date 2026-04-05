type HubEvent =
  | { name: "widget_click"; widgetId: string }
  | { name: "feedback_submit"; topic: string };

export function trackHubEvent(event: HubEvent) {
  if (typeof window === "undefined") return;
  // placeholder analytics; swap when provider is chosen
  console.debug("[hub:event]", event);
}
