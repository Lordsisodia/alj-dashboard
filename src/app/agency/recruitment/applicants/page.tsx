import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ContentPageShell } from "@/shared/layout/ContentPageShell";
import { ApplicantsTable } from "@/features/agency/recruitment/components";

export const metadata: Metadata = { title: "Applicants | Agency | ORACLE" };

export default function AgencyRecruitmentApplicantsPage() {
  return (
    <ContentPageShell
      icon={<Users size={16} />}
      title="Applicants"
      stat={{ label: "total", value: 10 }}
      searchPlaceholder="Search applicants..."
      actionLabel="Export CSV"
      accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
    >
      <ApplicantsTable />
    </ContentPageShell>
  );
}
