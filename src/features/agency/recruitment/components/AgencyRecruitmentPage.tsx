"use client";

import { Users } from "lucide-react";
import { ContentPageShell } from "@/shared/layout/ContentPageShell";
import { RecruitmentHub } from "./RecruitmentHub";

export default function AgencyRecruitmentPage() {
  return (
    <ContentPageShell
      icon={<Users size={16} />}
      title="Recruitment"
      stat={{ label: "total", value: 10 }}
      searchPlaceholder="Search applicants..."
      actionLabel="Post Job"
      accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
    >
      <RecruitmentHub />
    </ContentPageShell>
  );
}
