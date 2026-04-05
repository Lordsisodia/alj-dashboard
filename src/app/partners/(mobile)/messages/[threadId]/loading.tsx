import Loader from "@/domains/partnerships/settings/shared/ui/shared/loader-15";

export default function MessageThreadLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <Loader />
    </div>
  );
}

