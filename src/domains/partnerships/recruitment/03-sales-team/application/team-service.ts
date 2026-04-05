import { cache } from "react";
import path from "node:path";
import { promises as fs } from "node:fs";
import type { TeamMember } from "@/domains/partnerships/recruitment/03-sales-team/data/team/members";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";

const TEAM_MEMBERS_ENDPOINT = "/data/recruitment/team-members.json";
const DISK_PATH = path.join(process.cwd(), "public", "data", "recruitment", "team-members.json");
const REVALIDATE_SECONDS = 60 * 30;
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

async function readFromDisk(): Promise<TeamMember[]> {
  const file = await fs.readFile(DISK_PATH, "utf-8");
  return JSON.parse(file) as TeamMember[];
}

const loadTeamMembers = cache(async (): Promise<TeamMember[]> => {
  if (isBuildPhase) {
    return readFromDisk();
  }

  try {
    const baseUrl = await getRequestBaseUrl();
    const response = await fetch(`${baseUrl}${TEAM_MEMBERS_ENDPOINT}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (response.ok) {
      return (await response.json()) as TeamMember[];
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Falling back to disk for recruitment team data", error);
    }
  }

  return readFromDisk();
});

export async function getRecruitmentTeamMembers(): Promise<TeamMember[]> {
  return loadTeamMembers();
}

export async function getRecruitmentTeamMember(id: string): Promise<TeamMember | null> {
  const members = await loadTeamMembers();
  return members.find((member) => member.id === id) ?? null;
}
