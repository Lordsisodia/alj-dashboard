import { getWalletSnapshot, getTierProgressSnapshot } from "@/domains/partnerships/earnings/01-dashboard/application/dashboard-data";
import { getPipelineOverview } from "@/domains/partnerships/pipeline-ops/shared/application/pipelineOpsService";
import { getWorkspaceTasks } from "@/domains/partnerships/workspace/application/useWorkspacePanels";
import { HubDashboardSchema, type HubDashboard } from "../domain/hub.schema";
import { HUB_WIDGET_CONFIGS } from "../domain/widgets";

const fallback: HubDashboard = {
  earnings: { walletSummary: { balance: 0, currency: "USD" }, ledgerEntries: [], complianceChecklist: [] },
  pipeline: { prospectCount: 0 },
  workspace: { tasks: [] },
  tier: { tierMeta: [], tierMetrics: [] },
}

type HubLoadResult =
  | { status: "ok"; data: HubDashboard }
  | { status: "error"; data: HubDashboard; error: string }

function safeParseDashboard(payload: unknown): HubDashboard {
  const result = HubDashboardSchema.safeParse(payload)
  return result.success ? result.data : fallback
}

export async function loadHubWidgets(): Promise<HubLoadResult> {
  try {
    const [pipelineOverview, earnings] = await Promise.all([getPipelineOverview(), Promise.resolve(getWalletSnapshot())])
    const workspace = getWorkspaceTasks()
    const tier = getTierProgressSnapshot()
    const pipeline = { prospectCount: pipelineOverview.prospects?.length ?? 0 }
    const data = safeParseDashboard({ earnings, workspace, pipeline, tier })
    return { status: "ok", data }
  } catch (error) {
    return { status: "error", data: fallback, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
