import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function SettingsLanguagePage() {
  return renderSettingsRouteBySlug("language");
}
