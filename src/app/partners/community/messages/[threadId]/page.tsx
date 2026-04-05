import { LazyMobileShell } from "@/domains/partnerships/_shared/shell/ui/LazyShell";

export default async function PartnersCommunityMessageThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  await params;
  return <LazyMobileShell initialTab="messages" initialImmersiveMode />;
}
