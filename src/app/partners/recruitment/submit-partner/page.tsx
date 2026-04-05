import { Suspense } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import SubmitClientExperience from "@/domains/partnerships/pipeline-ops/02-submit-client/ui/screens/SubmitClientExperience.client";
import type { PipelineOpsConfig } from "@/domains/partnerships/pipeline-ops/02-submit-client/domain/types";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";
import { cn } from "@/domains/shared/utils/cn";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const configFilePath = path.join(process.cwd(), "public/data/recruitment-submit-config.json");

const loadConfigFromDisk = async (): Promise<PipelineOpsConfig> => {
  const file = await fs.readFile(configFilePath, "utf-8");
  return JSON.parse(file) as PipelineOpsConfig;
};

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const fetchRecruitmentConfig = async (baseUrl: string): Promise<PipelineOpsConfig> => {
  if (isBuildPhase) {
    return loadConfigFromDisk();
  }
  try {
    const response = await fetch(`${baseUrl}/data/recruitment-submit-config.json`, {
      next: { revalidate: 60 * 15 },
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.warn("Failed to fetch recruitment submit config from", baseUrl, error);
  }
  return loadConfigFromDisk();
};

async function SubmitPartnerExperienceBoundary() {
  const baseUrl = await getRequestBaseUrl();
  const config = await fetchRecruitmentConfig(baseUrl);
  return (
    <SubmitClientExperience
      config={config}
      experience={{
        experienceId: "submit-partner",
        directoryVariant: "client-submissions",
        threadName: "Submit Partner",
        threadAvatarLabel: "SP",
        headerTitle: "Submit Partner Intake",
        headerSubtitle: "Chat-first submission to fast-track recruitment reviews",
        helperText: "Share the recruit's name, channel, and reach. We'll prep invites while you answer prompts.",
        submitVariant: "partner",
        statusIdleLabel: "Recruitment review SLA",
        statusSubmittedLabel: "Submitted · Recruitment review",
      }}
    />
  );
}

export default function PartnersRecruitmentSubmitPartnerPage() {
  return (
    <Suspense fallback={<SubmitPartnerFallback />}>
      <SubmitPartnerExperienceBoundary />
    </Suspense>
  );
}

function SubmitPartnerFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-siso-bg-primary px-4 py-10 text-white">
      <div className={cn(stackedPanelClass, "w-full max-w-3xl space-y-6 p-6")}>
        <div className="space-y-2">
          <div className="h-10 w-48 rounded-full bg-white/10" />
          <div className="h-4 w-64 rounded-full bg-white/5" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className={cn(nestedCardClass, "space-y-3 p-4")}>
              <div className="h-3 w-1/2 rounded-full bg-white/10" />
              <div className="h-4 w-3/4 rounded-full bg-white/15" />
              <div className="h-3 w-full rounded-full bg-white/5" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className={cn(nestedCardClass, "h-12 bg-white/5")} />
          ))}
        </div>
      </div>
    </div>
  );
}
