import { Suspense } from "react";
import { renderSettingsRouteBySlug } from "@/domains/partnerships/settings/shared/route-renderers";


type SettingsDynamicParams = { slug?: string[] };

async function SettingsRouteRenderer({ slug }: { slug: string }) {
  return renderSettingsRouteBySlug(slug);
}

export default async function SettingsDynamicPage({ params }: { params: Promise<SettingsDynamicParams> }) {
  const resolved = await params;
  return (
    <Suspense fallback={null}>
      {/* Route-level loading uses loading.tsx with shared Loader */}
      <SettingsRouteRenderer slug={(resolved.slug ?? []).join("/")} />
    </Suspense>
  );
}
