import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";

export default async function CookieTrackingPolicyPage() {
  return renderSettingsRouteBySlug("legal/cookie-tracking-policy");
}
