import LegalDocLayout from "@/domains/partnerships/settings/07-legal/ui/components/LegalDocLayout";
import MarkdownDoc from "@/domains/partnerships/settings/07-legal/ui/components/MarkdownDoc";

export default async function UpdatesChangesPolicyPage() {
  return (
    <LegalDocLayout
      title="Updates & Changes Policy"
      description="How we notify you about policy changes and new requirements."
    >
      <MarkdownDoc filePath="public/docs/updates-changes-policy.md" />
    </LegalDocLayout>
  );
}
