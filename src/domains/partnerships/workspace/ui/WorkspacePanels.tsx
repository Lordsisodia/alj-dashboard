import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WorkspaceDashboard } from "./WorkspaceDashboard"

const quickTools = [
  { href: "/partners/workspace/tasks", label: "Tasks" },
  { href: "/partners/workspace/notes/my-notes", label: "My Notes" },
  { href: "/partners/workspace/files", label: "Files" },
]

export function WorkspacePanels() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 p-4">
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/70">Quick tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTools.map((tool) => (
            <Button key={tool.href} asChild size="sm" variant="secondary" className="rounded-full">
              <Link href={tool.href}>{tool.label}</Link>
            </Button>
          ))}
        </div>
      </div>
      <WorkspaceDashboard />
    </div>
  )
}
