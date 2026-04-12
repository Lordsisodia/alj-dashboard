import type { Metadata } from "next";
import AgencyRecruitmentPage from "@/features/agency/recruitment/components/AgencyRecruitmentPage";

export const metadata: Metadata = { title: "Recruitment | Agency | ORACLE" };

export default function Page() {
  return <AgencyRecruitmentPage />;
}
