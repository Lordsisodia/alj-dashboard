// @ts-nocheck
import { InfoButton } from "@/components/ui/info-button";
import { CustomDropdown } from "./CustomDropdown";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Palette, Moon, Sun, Smartphone } from "lucide-react";
import dynamic from "next/dynamic";
import type { GeneralSettingsState } from "../../application/useGeneralSettings";

const SkySwitch = dynamic(() => import("@/components/ui/sky-toggle"), { ssr: false });

type Props = {
  appearance: GeneralSettingsState;
  updateTheme: (value: GeneralSettingsState["currentTheme"]) => void;
  updateFontSize: (value: string) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleHapticFeedback: () => void;
};

const fontSizeOptions = [
  { value: "small", label: "Small", description: "More compact text" },
  { value: "medium", label: "Medium", description: "Default text size" },
  { value: "large", label: "Large", description: "More readable text" },
];

export function AppearancePanel({ appearance, updateTheme, updateFontSize, toggleReducedMotion, toggleHighContrast, toggleHapticFeedback }: Props) {
  return (
    <SettingsGroupCallout
      icon={<Palette className="h-4 w-4" />}
      title="Appearance & Accessibility"
      subtitle="Theme, contrast, font size, reduced motion, haptics"
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Theme</h3>
            <div className="flex gap-2">
              <button onClick={() => updateTheme("light")} className="flex items-center gap-1 text-xs text-siso-text-muted">
                <Sun className="h-4 w-4" /> Light
              </button>
              <button onClick={() => updateTheme("dark")} className="flex items-center gap-1 text-xs text-siso-text-muted">
                <Moon className="h-4 w-4" /> Dark
              </button>
              <button onClick={() => updateTheme("system")} className="flex items-center gap-1 text-xs text-siso-text-muted">
                <Smartphone className="h-4 w-4" /> System
              </button>
            </div>
          </div>
          <SkySwitch
            value={appearance.currentTheme !== "light"}
            onCheckedChange={() => updateTheme(appearance.currentTheme === "light" ? "dark" : "light")}
            ariaLabel="Toggle theme"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Font Size</h3>
            <InfoButton label="About font size" content="Choose the text size that's most comfortable to read." />
          </div>
          <CustomDropdown
            options={fontSizeOptions}
            value={appearance.fontSize}
            onChange={updateFontSize}
            placeholder="Select font size"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Motion & Contrast</h3>
            <InfoButton label="About motion" content="Reduce motion and increase contrast for accessibility preferences." />
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-siso-text-muted">
            <button className="rounded-full border border-white/10 px-3 py-1" onClick={toggleReducedMotion}>
              {appearance.reducedMotion ? "Reduced motion on" : "Enable reduced motion"}
            </button>
            <button className="rounded-full border border-white/10 px-3 py-1" onClick={toggleHighContrast}>
              {appearance.hasUnsavedAppearanceChanges ? "Contrast pending" : "High contrast"}
            </button>
            <button className="rounded-full border border-white/10 px-3 py-1" onClick={toggleHapticFeedback}>
              Haptics {appearance.reducedMotion ? "off" : "on"}
            </button>
          </div>
        </section>
      </div>
    </SettingsGroupCallout>
  );
}
