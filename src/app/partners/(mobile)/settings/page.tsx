import { SettingsPanel } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsPanel";
import { SettingsPageShell } from "@/domains/partnerships/settings/shared/components/SettingsPageShell";

export default function PartnersSettingsPage() {
  return (
    <SettingsPageShell>
      <SettingsPanel />
    </SettingsPageShell>
  );
}
