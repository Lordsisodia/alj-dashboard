import type { ProspectSummary } from "@/domains/partnerships/pipeline-ops/shared/domain/types";
import { ProspectDetailBoard } from "./ProspectDetailBoard.client";

export function ProspectDetailWorkspace({ prospect }: { prospect: ProspectSummary }) {
  return <ProspectDetailBoard prospect={prospect} />;
}
