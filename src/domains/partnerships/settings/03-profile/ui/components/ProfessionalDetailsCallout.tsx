import { Input } from "@/components/ui/input";
import { InfoButton } from "@/components/ui/info-button";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Briefcase } from "lucide-react";
import {
  businessTypeOptions,
  companySizeOptions,
  geographicOptions,
  industryOptions,
} from "./profile-options";

interface Props {
  professionalTitle: string;
  setProfessionalTitle: (value: string) => void;
  businessName: string;
  setBusinessName: (value: string) => void;
  businessType: string;
  setBusinessType: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  yearsOfExperience: string;
  setYearsOfExperience: (value: string) => void;
  companySize: string;
  setCompanySize: (value: string) => void;
  geographicAvailability: string;
  setGeographicAvailability: (value: string) => void;
}

export function ProfessionalDetailsCallout(props: Props) {
  const {
    professionalTitle,
    setProfessionalTitle,
    businessName,
    setBusinessName,
    businessType,
    setBusinessType,
    industry,
    setIndustry,
    yearsOfExperience,
    setYearsOfExperience,
    companySize,
    setCompanySize,
    geographicAvailability,
    setGeographicAvailability,
  } = props;

  return (
    <SettingsGroupCallout
      icon={<Briefcase className="h-4 w-4" />}
      title="Professional Details"
      subtitle="Help partners understand your business background."
      showChevron={false}
    >
      <div className="space-y-2">
        <CalloutField label="Professional Title" info="Your role, e.g. Marketing Consultant. If not applicable, use NA.">
          <Input
            value={professionalTitle}
            onChange={(event) => setProfessionalTitle(event.target.value)}
            placeholder="e.g., Marketing Consultant (or select Custom)"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </CalloutField>

        <CalloutField label="Business Name" info="Your company or trading name. Use NA if you operate as an individual.">
          <Input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Your company name (or select Custom)"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </CalloutField>

        <CalloutField label="Business Type" info="Select the closest match or choose Custom.">
          <CustomDropdown options={businessTypeOptions} value={businessType} onChange={setBusinessType} placeholder="Select business type" />
        </CalloutField>

        <CalloutField label="Industry" info="Your primary industry focus.">
          <CustomDropdown options={industryOptions} value={industry} onChange={setIndustry} placeholder="Select industry" />
        </CalloutField>

        <CalloutField label="Years of Experience" info="How long you’ve been in your field.">
          <Input
            value={yearsOfExperience}
            onChange={(event) => setYearsOfExperience(event.target.value)}
            placeholder="e.g., 5"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </CalloutField>

        <CalloutField label="Company Size" info="Team size helps partners contextualize your capacity.">
          <CustomDropdown options={companySizeOptions} value={companySize} onChange={setCompanySize} placeholder="Select company size" />
        </CalloutField>

        <CalloutField label="Geographic Availability" info="Where you operate or accept clients.">
          <CustomDropdown
            options={geographicOptions}
            value={geographicAvailability}
            onChange={setGeographicAvailability}
            placeholder="Select region"
          />
        </CalloutField>
      </div>
    </SettingsGroupCallout>
  );
}

function CalloutField({ label, info, children }: { label: string; info: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">{label}</h3>
        <InfoButton label={`About ${label.toLowerCase()}`} content={info} />
      </div>
      {children}
    </section>
  );
}
