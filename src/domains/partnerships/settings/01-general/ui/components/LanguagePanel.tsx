import { InfoButton } from "@/components/ui/info-button";
import { CustomDropdown } from "./CustomDropdown";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Globe } from "lucide-react";
import { LanguageDropdown } from "./LanguageDropdown";
import { TimezoneDropdown } from "./TimezoneDropdown";
import { currencyOptions, timeOptions } from "./general-options";

type Props = {
  language: {
    currentLanguage: string;
    currentTimezone: string;
  };
  updateLocale: (value: string) => void;
  updateTimezone: (value: string) => void;
  updateTimeFormat: (value: string) => void;
  updateCurrencyFormat: (value: string) => void;
};

export function LanguagePanel({ language, updateLocale, updateTimezone, updateTimeFormat, updateCurrencyFormat }: Props) {
  return (
    <SettingsGroupCallout
      icon={<Globe className="h-4 w-4" />}
      title="Language & Region"
      subtitle="Language, timezone, number/currency formats"
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Language</h3>
            <InfoButton label="About language" content="Choose your preferred language for the app." />
          </div>
          <LanguageDropdown value={language.currentLanguage} onChange={updateLocale} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Timezone</h3>
            <InfoButton label="About timezone" content="Set your local timezone for scheduling and timestamps." />
          </div>
          <TimezoneDropdown value={language.currentTimezone} onChange={updateTimezone} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Time format</h3>
            <InfoButton label="About time format" content="Choose 12h or 24h clock display." />
          </div>
          <CustomDropdown options={timeOptions} value={language.currentTimezone === "" ? "12h" : "12h"} onChange={updateTimeFormat} placeholder="Select time format" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Currency format</h3>
            <InfoButton label="About currency" content="Pick your preferred currency display." />
          </div>
          <CustomDropdown options={currencyOptions} value={"USD"} onChange={updateCurrencyFormat} placeholder="Select currency" />
        </section>
      </div>
    </SettingsGroupCallout>
  );
}
