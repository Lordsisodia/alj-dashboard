import type { Metadata } from "next";
import { RecruitmentDashboardContent } from "@/domains/partnerships/recruitment/01-dashboard/ui/screens/RecruitmentDashboardScreen";

export const metadata: Metadata = {
  title: "Recruitment Dashboard • SISO Partners",
  description: "Track invites, approvals, and the partners powering recruitment.",
};

export default function PartnersRecruitmentIndexPage() {
  return <RecruitmentDashboardContent />;
}
