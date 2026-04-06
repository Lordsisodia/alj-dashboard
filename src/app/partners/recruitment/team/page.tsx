import type { Metadata } from "next";
import { RecruitmentTeamContent } from "@/domains/partnerships/recruitment/03-sales-team/ui/screens/TeamContent";
import { getRecruitmentTeamMembers } from "@/domains/partnerships/recruitment/03-sales-team/application/team-service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Recruitment Team • SISO Partners",
  description: "See who's actively selling, onboarding progress, coverage gaps, and recognition.",
};

export default async function PartnersRecruitmentTeamPage() {
  const members = await getRecruitmentTeamMembers();
  return <RecruitmentTeamContent members={members} />;
}
