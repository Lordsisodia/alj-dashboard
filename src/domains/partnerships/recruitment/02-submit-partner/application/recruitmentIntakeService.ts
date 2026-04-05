import type { SubmitClientPayload, SubmitClientResponse } from "../../../pipeline-ops/shared/domain/types";
import { submitClient } from "../../../pipeline-ops/shared/application/pipelineOpsService";

/**
 * Temporary shim that reuses the pipeline intake endpoint for partner submissions until
 * a recruitment-specific intake API is delivered.
 */
export async function submitPartner(payload: SubmitClientPayload): Promise<SubmitClientResponse> {
  return submitClient(payload);
}

export function submitPartnerOptimistic(payload: SubmitClientPayload) {
  const optimistic: SubmitClientResponse = { intakeId: "optimistic", status: "received", estimatedSlaHrs: 4 };
  const final = submitPartner(payload).catch(() => ({ intakeId: "fallback", status: "needs_review", estimatedSlaHrs: 12 }));
  return { optimistic, final };
}
