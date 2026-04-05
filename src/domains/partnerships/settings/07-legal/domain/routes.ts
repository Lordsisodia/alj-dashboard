export const LEGAL_ROUTES = {
  base: "/partners/settings/legal",
  terms: "/partners/settings/legal/terms-of-service",
  partnerAgreement: "/partners/settings/legal/partner-agreement",
  commissionTerms: "/partners/settings/legal/commission-terms",
  serviceLevelAgreement: "/partners/settings/legal/service-level-agreement",
  cookiePolicy: "/partners/settings/legal/cookie-tracking-policy",
  updatesChanges: "/partners/settings/legal/updates-changes-policy",
  compliance: "/partners/settings/legal/compliance-regulatory",
} as const;

export type LegalRouteKey = keyof typeof LEGAL_ROUTES;
