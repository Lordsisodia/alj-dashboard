import Loader from "@/domains/partnerships/settings/shared/ui/shared/loader-15";

export default function SettingsRouteLoading() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center px-4 py-10"
      role="status"
      aria-live="polite"
      aria-label="Loading settings"
    >
      <Loader />
    </div>
  );
}
