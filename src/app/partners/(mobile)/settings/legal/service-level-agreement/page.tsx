import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function ServiceLevelAgreementPage() {
  return renderSettingsRouteBySlug("legal/service-level-agreement");
}
