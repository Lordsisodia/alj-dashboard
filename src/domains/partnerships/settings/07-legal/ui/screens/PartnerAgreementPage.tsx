import LegalDocLayout from "@/domains/partnerships/settings/07-legal/ui/components/LegalDocLayout";
import MarkdownDoc from "@/domains/partnerships/settings/07-legal/ui/components/MarkdownDoc";

export default async function PartnerAgreementPage() {
  return (
    <LegalDocLayout
      title="Partner Agreement"
      description="Partnership obligations, commissions, and mutual commitments."
    >
      <MarkdownDoc filePath="public/docs/partner-agreement.md" />
    </LegalDocLayout>
  );
}
