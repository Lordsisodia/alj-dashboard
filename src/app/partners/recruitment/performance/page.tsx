import type { Metadata } from "next";
import { RecruitmentPerformanceContent } from "@/domains/partnerships/recruitment/04-team-performance/ui/screens/PerformanceContent";

export const metadata: Metadata = {
  title: "Referral Performance • SISO Partners",
  description: "Monitor invite conversion, approvals, and revenue across the partner funnel.",
};

export default function PartnersRecruitmentPerformancePage() {
  return <RecruitmentPerformanceContent />;
}
