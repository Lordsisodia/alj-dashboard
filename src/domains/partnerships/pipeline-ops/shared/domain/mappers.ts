import { SubmitClientPayloadSchema, SubmitClientResponseSchema } from "./schema";
import type { SubmitClientPayload, SubmitClientResponse } from "./types";

export function mapSubmitClientPayload(input: unknown): SubmitClientPayload {
  return SubmitClientPayloadSchema.parse(input);
}

export function mapSubmitClientResponse(input: unknown): SubmitClientResponse {
  return SubmitClientResponseSchema.parse(input);
}
