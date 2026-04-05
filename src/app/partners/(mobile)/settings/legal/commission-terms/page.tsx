import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function CommissionTermsPage() {
  return renderSettingsRouteBySlug("legal/commission-terms");
}
