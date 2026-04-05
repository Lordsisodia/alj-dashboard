import type { Metadata } from "next";
import { RecruitmentProspectsContent } from "@/domains/partnerships/recruitment/05-prospects/ui/screens/ProspectsContent";

export const metadata: Metadata = {
  title: "Recruitment Prospects • SISO Partners",
  description: "Manage the full pipeline of recruitment prospects and their next steps.",
};

export default function PartnersRecruitmentProspectsPage() {
  return <RecruitmentProspectsContent />;
}
