// @ts-nocheck
import type { SubmitClientPayload } from "./types";

export type SubmitClientDto = {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  industry: string;
  region?: string;
  deal_size?: number;
  notes?: string;
  source?: string;
};

export function toSubmitClientDto(payload: SubmitClientPayload): SubmitClientDto {
  return {
    company_name: payload.companyName,
    contact_name: payload.contactName,
    contact_email: payload.contactEmail,
    contact_phone: payload.contactPhone,
    industry: payload.industry,
    region: payload.region,
    deal_size: payload.dealSize,
    notes: payload.notes,
    source: payload.source,
  };
}
