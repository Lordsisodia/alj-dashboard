import LegalDocLayout from "@/domains/partnerships/settings/07-legal/ui/components/LegalDocLayout";
import MarkdownDoc from "@/domains/partnerships/settings/07-legal/ui/components/MarkdownDoc";

export default async function CookieTrackingPolicyPage() {
  return (
    <LegalDocLayout
      title="Cookie & Tracking Policy"
      description="How we use cookies, analytics, and tracking technologies."
    >
      <MarkdownDoc filePath="public/docs/cookie-tracking-policy.md" />
    </LegalDocLayout>
  );
}
