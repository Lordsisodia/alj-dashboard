import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function ComplianceRegulatoryPage() {
  return renderSettingsRouteBySlug("legal/compliance-regulatory");
}
