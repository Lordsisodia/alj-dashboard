import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function TermsOfServicePage() {
  return renderSettingsRouteBySlug("legal/terms-of-service");
}
