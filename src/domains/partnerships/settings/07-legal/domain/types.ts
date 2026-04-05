export type LegalDocumentId =
  | "terms"
  | "partner-agreement"
  | "commission-terms"
  | "service-level-agreement"
  | "cookie-tracking-policy"
  | "updates-changes-policy"
  | "compliance-regulatory";

export interface LegalDocumentMeta {
  id: LegalDocumentId;
  title: string;
  description: string;
  href: string;
  status: string;
  lastUpdated?: Date;
  requiresAcknowledgement?: boolean;
  version: string;
}

export interface LegalSettings {
  documents: LegalDocumentMeta[];
  highlightedIds?: LegalDocumentId[];
}
