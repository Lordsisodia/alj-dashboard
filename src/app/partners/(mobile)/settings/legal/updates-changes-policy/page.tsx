import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function UpdatesChangesPolicyPage() {
  return renderSettingsRouteBySlug("legal/updates-changes-policy");
}
