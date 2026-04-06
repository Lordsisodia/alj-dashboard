// @ts-nocheck
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { FormState, WizardPrompt } from "../../domain/types";
import { nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { SummaryRow } from "./SummaryRow";

type Props = {
  prompt: WizardPrompt;
  formState: FormState;
  onShareChange: (value: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
  resultMessage?: string | null;
  errorMessage?: string | null;
};

export function SummaryPrompt({ prompt, formState, onShareChange, onSubmit, isPending, resultMessage, errorMessage }: Props) {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{prompt.prompt}</p>
      <p className="text-xs text-white/60">Review the intake before submitting.</p>
      <div className={cn(nestedCardClass, "space-y-3 p-3 text-white/80")}> 
        <SummaryRow label="Company" value={formState.companyName || "-"} helper={formState.companySize || "Size unknown"} />
        <SummaryRow label="Primary contact" value={formState.contactName || "-"} helper={formState.contactEmail || formState.contactPhone || ""} />
        <SummaryRow label="Services" value={formState.servicesRequested.join(", ") || "No services selected"} helper={formState.website || formState.socialLink || ""} />
        <SummaryRow
          label="Value"
          value={formState.expectedValue ? `$${Number(formState.expectedValue).toLocaleString()}` : "Unknown"}
          helper={formState.budgetRange ? `Budget ${formState.budgetRange}` : "Budget Unknown"}
        />
        <SummaryRow label="Notes" value={formState.contextNotes || formState.clientGoals || "No additional notes"} />
      </div>
      <div className={cn(nestedCardClass, "flex items-center justify-between border-white/20 px-4 py-3 text-sm text-white")}> 
        <div>
          <p className="font-semibold">Share notes with SISO</p>
          <p className="text-white/70">Gives Partner Success visibility.</p>
        </div>
        <Switch checked={formState.shareWithSiso} onCheckedChange={onShareChange} />
      </div>
      {formState.documents.length > 0 && (
        <div className={cn(nestedCardClass, "space-y-2 border-white/20 p-3")}> 
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Docs</p>
          {formState.documents.map((doc) => (
            <div key={doc} className="flex items-center gap-2 text-sm text-white/80">
              <FileText className="h-4 w-4 text-siso-orange" />
              {doc}
            </div>
          ))}
        </div>
      )}
      {resultMessage && (
        <Alert className="border-emerald-500/60 bg-emerald-500/10 text-emerald-100">
          <AlertDescription>{resultMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert className="border-rose-500/60 bg-rose-500/10 text-rose-100">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Button
        type="button"
        disabled={isPending}
        className="w-full rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA726] py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-siso-bg-primary shadow-[0_18px_40px_rgba(0,0,0,0.45)] hover:from-[#ff6a33] hover:to-[#ffb347]"
        onClick={onSubmit}
      >
        {isPending ? "Submitting..." : "Submit to SISO"}
      </Button>
    </>
  );
}
