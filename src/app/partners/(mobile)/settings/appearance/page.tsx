import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function SettingsAppearancePage() {
  return renderSettingsRouteBySlug("appearance");
}
