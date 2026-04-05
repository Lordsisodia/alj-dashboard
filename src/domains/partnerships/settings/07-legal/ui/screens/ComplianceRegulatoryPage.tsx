import LegalDocLayout from "@/domains/partnerships/settings/07-legal/ui/components/LegalDocLayout";
import MarkdownDoc from "@/domains/partnerships/settings/07-legal/ui/components/MarkdownDoc";

export default async function ComplianceRegulatoryPage() {
  return (
    <LegalDocLayout
      title="Compliance & Regulatory"
      description="AML/KYC, international requirements, and industry standards."
    >
      <MarkdownDoc filePath="public/docs/compliance-regulatory.md" />
    </LegalDocLayout>
  );
}
