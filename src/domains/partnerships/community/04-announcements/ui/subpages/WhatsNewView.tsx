"use client";

import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Megaphone, Zap, Palette } from "lucide-react";

const updates = [
  {
    title: "Earnings tabs stream in 1.4s",
    detail: "Wallet + missions now stream server-first, keeping PayPal routes warm.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Academy lessons pin progress",
    detail: "Resume where you left off across devices and share progress with managers.",
    icon: <Palette className="h-4 w-4" />,
  },
];

export function WhatsNewView() {
  return (
    <div className="space-y-4">
      <SettingsGroupCallout
        icon={<Megaphone className="h-4 w-4" />}
        title="Product drops"
        subtitle="Latest partner updates and launches"
        showChevron={false}
      >
        <div className="space-y-3">
          {updates.map((update) => (
            <div key={update.title} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
              <div className="mb-1 inline-flex items-center gap-2 text-white">
                <span className="text-siso-orange">{update.icon}</span>
                <p className="font-semibold">{update.title}</p>
              </div>
              <p>{update.detail}</p>
            </div>
          ))}
        </div>
      </SettingsGroupCallout>
    </div>
  );
}
