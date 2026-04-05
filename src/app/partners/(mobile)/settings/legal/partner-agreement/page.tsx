import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function PartnerAgreementPage() {
  return renderSettingsRouteBySlug("legal/partner-agreement");
}
