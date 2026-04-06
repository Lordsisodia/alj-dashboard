import { Suspense } from "react"

export const metadata = {
  title: "Provider Diagnostics",
}

function DiagnosticsContent() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Provider Diagnostics</h1>
      <p>Query/Realtime/Auth providers are mounted.</p>
    </div>
  )
}

export default function ProviderDiagnosticsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiagnosticsContent />
    </Suspense>
  )
}
