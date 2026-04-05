import { Calendar } from "lucide-react";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { InfoButton } from "@/components/ui/info-button";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import { monthOptions, yearOptions } from "./profile-options";

interface Props {
  sisoJoinMonth: string;
  onSisoJoinMonthChange: (value: string) => void;
  sisoJoinYear: string;
  onSisoJoinYearChange: (value: string) => void;
}

export function PartnershipDetailsCallout({ sisoJoinMonth, onSisoJoinMonthChange, sisoJoinYear, onSisoJoinYearChange }: Props) {
  const calculatePartnershipDuration = () => {
    if (!sisoJoinMonth || !sisoJoinYear) return "Select join date to calculate";
    const joinDate = new Date(parseInt(sisoJoinYear), parseInt(sisoJoinMonth) - 1);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - joinDate.getFullYear();
    const months = currentDate.getMonth() - joinDate.getMonth();
    let totalYears = years;
    let totalMonths = months;
    if (totalMonths < 0) {
      totalYears--;
      totalMonths += 12;
    }
    if (totalYears === 0 && totalMonths === 0) return "Less than 1 month";
    const parts: string[] = [];
    if (totalYears > 0) parts.push(`${totalYears} year${totalYears !== 1 ? "s" : ""}`);
    if (totalMonths > 0) parts.push(`${totalMonths} month${totalMonths !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  return (
    <SettingsGroupCallout
      icon={<Calendar className="h-4 w-4" />}
      title="SISO Partnership Details"
      subtitle="Track your journey with the SISO ecosystem."
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">SISO Join Date</h3>
            <InfoButton label="About SISO join date" content="Select the month and year when you joined the SISO partnership program." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CustomDropdown options={monthOptions} value={sisoJoinMonth} onChange={onSisoJoinMonthChange} searchable={false} placeholder="Month" />
            <CustomDropdown options={yearOptions} value={sisoJoinYear} onChange={onSisoJoinYearChange} searchable={false} placeholder="Year" />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Partnership Duration</h3>
            <InfoButton label="About partnership duration" content="Automatically calculated from your join date to show your tenure as a SISO partner." />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-siso-orange" />
            <span className="text-sm text-siso-text-primary font-medium">{calculatePartnershipDuration()}</span>
          </div>
        </section>
      </div>
    </SettingsGroupCallout>
  );
}
