import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function SettingsIntegrationsPage() {
  return renderSettingsRouteBySlug("integrations");
}
