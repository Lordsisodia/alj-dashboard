export interface PrivacySettings {
  profileVisibility: "public" | "partners-only" | "private";
  showEmail: boolean;
  showPhone: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  consentAudit?: ConsentAuditEntry[];
}

export interface ConsentAuditEntry {
  action: "consent-granted" | "consent-revoked" | "export-requested" | "data-deleted";
  actor: string;
  at: Date;
  notes?: string;
}
