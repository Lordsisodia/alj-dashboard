import type {
  DealSummary,
  PipelineOpsOverview,
  ProspectSummary,
  RecruitmentInvite,
  SubmitClientPayload,
  SubmitClientResponse,
} from "@/domains/partnerships/pipeline-ops/shared/domain/types";

const prospects: ProspectSummary[] = [
  {
    id: "prospect_brookstone",
    company: "Brookstone Labs",
    contactName: "Lena Rowe",
    contactEmail: "lena@brookstone.ai",
    nextAction: "Share wallet benchmarks",
    confidence: 0.72,
    stage: "qualified",
    status: "potential",
    owner: "Nova",
    tags: ["commerce", "ai"],
    updatedAt: "2h ago",
  },
  {
    id: "prospect_northwind",
    company: "Northwind Analytics",
    contactName: "Elias Reed",
    contactEmail: "elias@northwind.io",
    nextAction: "Book solutioning session",
    confidence: 0.58,
    stage: "prospect",
    status: "potential",
    owner: "Cam",
    tags: ["saas", "data"],
    updatedAt: "4h ago",
  },
  {
    id: "prospect_corrigan",
    company: "Corrigan Supply",
    contactName: "Piper Mills",
    contactEmail: "piper@corrigansupply.com",
    nextAction: "Send recruitment kit",
    confidence: 0.81,
    stage: "qualified",
    status: "active",
    owner: "Mara",
    tags: ["commerce", "pipeline"],
    updatedAt: "Yesterday",
  },
];

const activeDeals: DealSummary[] = [
  {
    id: "deal_aeon",
    company: "Aeon Retail",
    amount: 42000,
    stage: "proposal",
    agingDays: 9,
    lastActivityAt: "Today",
    health: "on_track",
    owner: "Nova",
  },
  {
    id: "deal_lumi",
    company: "Lumi Financial",
    amount: 68000,
    stage: "negotiation",
    agingDays: 16,
    lastActivityAt: "Yesterday",
    health: "risk",
    owner: "Cam",
  },
  {
    id: "deal_metro",
    company: "Metro Studio",
    amount: 18000,
    stage: "proposal",
    agingDays: 5,
    lastActivityAt: "Today",
    health: "on_track",
    owner: "Avi",
  },
];

const recruitment: RecruitmentInvite[] = [
  {
    id: "invite_1",
    partnerName: "Olivia Trent",
    email: "olivia@revpilot.io",
    status: "accepted",
    rewardShareBps: 200,
    sentAt: "Nov 14",
  },
  {
    id: "invite_2",
    partnerName: "Harper Lane",
    email: "harper@freelancehq.com",
    status: "pending",
    rewardShareBps: 180,
    sentAt: "Nov 18",
  },
];

const overview: PipelineOpsOverview = {
  prospects,
  activeDeals,
  recruitment,
};

export const pipelineOpsMocks = {
  prospects,
  activeDeals,
  recruitment,
};

export async function fetchPipelineOpsOverview(): Promise<PipelineOpsOverview> {
  return overview;
}

export async function submitClientIntake(payload: SubmitClientPayload): Promise<SubmitClientResponse> {
  return {
    intakeId: `intake_${Math.random().toString(36).slice(2, 8)}`,
    status: payload.dealSizeEstimate > 50000 ? "needs_review" : "received",
    estimatedSlaHrs: payload.dealSizeEstimate > 50000 ? 12 : 6,
  };
}
