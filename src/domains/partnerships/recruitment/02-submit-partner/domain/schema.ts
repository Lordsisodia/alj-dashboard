import { SubmitClientPayloadSchema, SubmitClientResponseSchema } from "../../../pipeline-ops/shared/domain/schema";
import type { SubmitClientPayload, SubmitClientResponse } from "../../../pipeline-ops/shared/domain/types";

// Recruitment reuses pipeline intake for now; these helpers keep validation colocated.
export function parseSubmitPartnerPayload(data: unknown): SubmitClientPayload {
  return SubmitClientPayloadSchema.parse(data);
}

export function parseSubmitPartnerResponse(data: unknown): SubmitClientResponse {
  return SubmitClientResponseSchema.parse(data);
}
