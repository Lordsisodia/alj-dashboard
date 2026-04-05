import LegalDocLayout from "@/domains/partnerships/settings/07-legal/ui/components/LegalDocLayout";
import MarkdownDoc from "@/domains/partnerships/settings/07-legal/ui/components/MarkdownDoc";

export default async function CommissionTermsPage() {
  return (
    <LegalDocLayout
      title="Commission & Payment Terms"
      description="Commission tiers, payout schedules, and tax responsibilities."
    >
      <MarkdownDoc filePath="public/docs/commission-payment-terms.md" />
    </LegalDocLayout>
  );
}
