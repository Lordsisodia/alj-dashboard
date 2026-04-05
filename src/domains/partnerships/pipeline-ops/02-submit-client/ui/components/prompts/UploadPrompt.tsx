// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { WizardPrompt, FormState } from "../../domain/types";

type Props = {
  prompt: WizardPrompt;
  formState: FormState;
  onUpload: (files: FileList | null) => void;
  onContinue: () => void;
  onSkip: () => void;
  errorMessage?: string | null;
};

export function UploadPrompt({ prompt, formState, onUpload, onContinue, onSkip, errorMessage }: Props) {
  const hasDocs = formState.documents.length > 0;
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{prompt.prompt}</p>
      <p className="text-xs text-white/60">{prompt.helper}</p>
      <label className={cn(nestedCardClass, "flex cursor-pointer items-center gap-2 border-dashed border-white/30 px-4 py-3 text-sm text-white/80")}>
        <Upload className="h-4 w-4" />
        <span>Upload docs / decks</span>
        <input type="file" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
      </label>
      {hasDocs ? (
        <ul className="space-y-2 text-sm text-white/80">
          {formState.documents.map((doc) => (
            <li key={doc} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-siso-orange" />
              {doc}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-white/60">{prompt.helper}</p>
      )}
      <div className="flex gap-2">
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
        {!hasDocs && (
          <Button type="button" variant="ghost" className="text-white/70" onClick={onSkip}>
            Skip
          </Button>
        )}
      </div>
      {errorMessage && (
        <Alert className="border-rose-500/60 bg-rose-500/10 text-rose-100 mt-2">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
