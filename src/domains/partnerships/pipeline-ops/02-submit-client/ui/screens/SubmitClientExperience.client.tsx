// @ts-nocheck
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { submitClient } from "@/domains/partnerships/pipeline-ops/shared/application/pipelineOpsService";
import { submitPartner } from "@/domains/partnerships/recruitment/02-submit-partner/application/recruitmentIntakeService";
import { cn } from "@/lib/utils";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";
import type { ThreadOverview } from "@/domains/partnerships/community/06-messages/ui/components/mobile/DirectoryOverlay";
import { FallingPattern } from "@/domains/partnerships/_shared/ui/marketing-patterns/falling-pattern";
import { ChevronLeft, Menu, FileText, Sparkles, Upload, ArrowUpRight, Shield, X } from "lucide-react";
import { DirectoryHeader } from "@/domains/partnerships/community/06-messages/ui/components/mobile/directory/DirectoryHeader";
import { DirectorySearchBar } from "@/domains/partnerships/community/06-messages/ui/components/mobile/directory/DirectorySearchBar";
import { DirectorySections } from "@/domains/partnerships/community/06-messages/ui/components/mobile/directory/DirectorySections";
import { DirectoryPanelDialog } from "@/domains/partnerships/community/06-messages/ui/components/mobile/directory/DirectoryPanelDialog";
import { useHydrateOnView } from "@/domains/shared/hooks/useHydrateOnView";
import type { DirectoryEntry, FormState, PipelineOpsConfig, WizardPrompt } from "../../domain/types";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { ChatBubble } from "../components/ChatBubble";
import { formatNow, createPromptMessage, DEFAULT_ASSISTANT_MESSAGE, DEFAULT_SERVICE_OPTIONS, initialFormState } from "../components/intake-constants";
import type { ChatMessage } from "../components/intake-types";

type SubmitIntakeExperienceOptions = {
  experienceId?: string;
  directoryVariant?: "messages" | "client-submissions";
  threadName?: string;
  threadAvatarLabel?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  helperText?: string;
  submitVariant?: "client" | "partner";
  statusIdleLabel?: string;
  statusSubmittedLabel?: string;
  hideFloatingNavButton?: boolean;
};

type SubmitClientExperienceProps = {
  config: PipelineOpsConfig;
  experience?: SubmitIntakeExperienceOptions;
};

export default function SubmitClientExperience({ config, experience }: SubmitClientExperienceProps) {
  const containerMax = "max-w-6xl";
  const {
    wizardPrompts,
    savedDraftThreads = [],
    outgoingRequests = [],
    blockedContacts = [],
    initialAssistantMessage,
  } = config;
  const experienceSettings = {
    experienceId: "submit-client",
    directoryVariant: "client-submissions" as const,
    threadName: "Submit Client",
    threadAvatarLabel: "SC",
    headerTitle: "Submit Client Intake",
    headerSubtitle: "Chat-first submission with Instant review SLA",
    helperText: "Share whatever you know-company name, WhatsApp, needs, and optional budget. We'll keep score as you go.",
    submitVariant: "client" as const,
    statusIdleLabel: "Instant review SLA",
    statusSubmittedLabel: "Submitted · Instant review",
    hideFloatingNavButton: true,
    ...(experience ?? {}),
  } satisfies Required<SubmitIntakeExperienceOptions>;
  const submitHandler = experienceSettings.submitVariant === "partner" ? submitPartner : submitClient;
  const assistantGreeting = initialAssistantMessage ?? DEFAULT_ASSISTANT_MESSAGE;
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setFormState((prev) => {
      const exists = prev.servicesRequested.includes(service);
      return {
        ...prev,
        servicesRequested: exists ? prev.servicesRequested.filter((item) => item !== service) : [...prev.servicesRequested, service],
      };
    });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFieldChange(
      "documents",
      files.map((file) => file.name),
    );
  };

  const handleSubmit = () => {
    setResultMessage(null);
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await submitHandler({
          companyName: formState.companyName,
          contactEmail: formState.contactEmail,
          contactPhone: formState.contactPhone,
          website: formState.website,
          socialLink: formState.socialLink,
          dealSizeEstimate: Number(formState.expectedValue) || 0,
          notes: [
            formState.clientGoals ? `Business: ${formState.clientGoals}` : null,
            formState.budgetRange ? `Budget: ${formState.budgetRange}` : null,
            formState.contextNotes ? `Context: ${formState.contextNotes}` : null,
            formState.commercialNotes ? `Commercials: ${formState.commercialNotes}` : null,
            formState.specialRequirements ? `Requirements: ${formState.specialRequirements}` : null,
          ]
            .filter(Boolean)
            .join(" | "),
          vertical: formState.industry || "General",
        });
        const successCopy =
          experienceSettings.submitVariant === "partner"
            ? `Partner intake ${response.intakeId} received • Recruitment review`
            : `Intake ${response.intakeId} received • Instant review`;
        setResultMessage(successCopy);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  };

  useEffect(() => {
    if (!experienceSettings.hideFloatingNavButton) return undefined;
    const root = document.documentElement;
    const previous = root.dataset.hideFloatingNavButton;
    root.dataset.hideFloatingNavButton = "true";
    return () => {
      if (previous) {
        root.dataset.hideFloatingNavButton = previous;
      } else {
        delete root.dataset.hideFloatingNavButton;
      }
    };
  }, [experienceSettings.hideFloatingNavButton]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary text-siso-text-primary">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ filter: "blur(5px)", opacity: 0.7, WebkitMaskImage: "none", maskImage: "none" }}
      >
        <FallingPattern className="h-full w-full" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-0 pb-0 pt-0 overflow-hidden">
        <SubmitClientChat
          containerMax={containerMax}
          wizardPrompts={wizardPrompts}
          savedDraftThreads={savedDraftThreads}
          outgoingRequests={outgoingRequests}
          blockedContacts={blockedContacts}
          assistantGreeting={assistantGreeting}
          formState={formState}
          onFieldChange={handleFieldChange}
          toggleService={toggleService}
          onDocumentUpload={handleDocumentUpload}
          onSubmit={handleSubmit}
          isPending={isPending}
          resultMessage={resultMessage}
          errorMessage={errorMessage}
          experienceSettings={experienceSettings}
        />
      </div>
    </main>
  );
}

type SubmitClientChatProps = {
  containerMax: string;
  wizardPrompts: WizardPrompt[];
  savedDraftThreads: ThreadOverview[];
  outgoingRequests: DirectoryEntry[];
  blockedContacts: DirectoryEntry[];
  assistantGreeting: string;
  formState: FormState;
  onFieldChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  toggleService: (service: string) => void;
  onDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isPending: boolean;
  resultMessage: string | null;
  errorMessage: string | null;
  experienceSettings: Required<SubmitIntakeExperienceOptions>;
};

function SubmitClientChat({
  containerMax,
  wizardPrompts,
  savedDraftThreads,
  outgoingRequests,
  blockedContacts,
  assistantGreeting,
  formState,
  onFieldChange,
  toggleService,
  onDocumentUpload,
  onSubmit,
  isPending,
  resultMessage,
  errorMessage,
  experienceSettings,
}: SubmitClientChatProps) {
  const transcriptRef = useRef<HTMLDivElement>(null);
  const { openDrawer } = useMobileNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const intro: ChatMessage = {
      id: "intro",
      role: "assistant",
      content: assistantGreeting,
      author: "Intake Assistant",
      timestamp: formatNow(),
    };
    const firstPrompt = wizardPrompts[0];
    return firstPrompt ? [intro, createPromptMessage(firstPrompt)] : [intro];
  });
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isDirectoryOpen, setDirectoryOpen] = useState(false);
  const [composerHeight, setComposerHeight] = useState(0);
  const [activeThreadId, setActiveThreadId] = useState(experienceSettings.experienceId);
  const { ref: composerHydrateRef, hydrated: composerInView } = useHydrateOnView<HTMLDivElement>({ rootMargin: "240px 0px" });
  const [composerRequested, setComposerRequested] = useState(false);
  const shouldRenderComposer = composerInView || composerRequested;

  useEffect(() => {
    if (!transcriptRef.current) return;
    transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages]);

  const currentPrompt = wizardPrompts[currentPromptIndex];
  const quickReplies = currentPrompt?.quickReplies ?? [];

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const goToNextPrompt = () => {
    if (currentPromptIndex >= wizardPrompts.length - 1) return;
    const nextIndex = currentPromptIndex + 1;
    setCurrentPromptIndex(nextIndex);
    pushMessage(createPromptMessage(wizardPrompts[nextIndex]));
  };

  const persistPromptValue = (prompt: WizardPrompt, value: string) => {
    if (!prompt.field) return;
    if (prompt.field === "servicesRequested" || prompt.field === "documents") return;
    if (prompt.field === "shareWithSiso") {
      onFieldChange("shareWithSiso", value !== "Keep private");
      return;
    }
    onFieldChange(prompt.field, value as FormState[typeof prompt.field]);
  };

  const completePrompt = (value: string, { skip = false, display }: { skip?: boolean; display?: string } = {}) => {
    const prompt = wizardPrompts[currentPromptIndex];
    if (!prompt) return;
    const trimmed = value.trim();
    const isSkippableType = prompt.type === "multi-select" || prompt.type === "upload";
    if (!skip && prompt.required && !trimmed && !isSkippableType) {
      return;
    }
    const content = display ?? (skip ? "Skip for now" : trimmed || "Not sure");
    pushMessage({ id: `user-${prompt.id}-${Date.now()}`, role: "user", content, author: "You", timestamp: formatNow() });
    if (!skip && !isSkippableType) {
      persistPromptValue(prompt, trimmed);
    } else if (skip && prompt.field && prompt.field !== "servicesRequested" && prompt.field !== "documents") {
      persistPromptValue(prompt, "");
    }
    setInputValue("");
    goToNextPrompt();
  };

  const handleMultiSelectConfirm = () => {
    const hasSelection = formState.servicesRequested.length > 0;
    completePrompt(formState.servicesRequested.join(", "), {
      skip: !hasSelection,
      display: hasSelection ? `Selected: ${formState.servicesRequested.join(", ")}` : "Skip for now",
    });
  };

  const handleUploadContinue = () => {
    const hasDocs = formState.documents.length > 0;
    completePrompt(hasDocs ? `${formState.documents.length} docs uploaded` : "No docs", {
      skip: !hasDocs,
      display: hasDocs ? `${formState.documents.length} docs uploaded` : "Skip for now",
    });
  };

  const isTextPrompt = currentPrompt?.type === "text" || currentPrompt?.type === "textarea";
  const composerInputDisabled = !currentPrompt || !isTextPrompt;
  const composerPlaceholder = currentPrompt?.placeholder ?? currentPrompt?.prompt ?? "Type an update";

  const handleComposerSend = () => {
    if (composerInputDisabled || !currentPrompt || inputValue.trim().length === 0) {
      return;
    }
    completePrompt(inputValue);
  };

  const renderInlineActions = () => {
    if (!currentPrompt) return null;

    const header = (
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{currentPrompt.prompt}</p>
        {currentPrompt.helper ? <p className="text-xs text-white/60">{currentPrompt.helper}</p> : null}
      </div>
    );

    const container = (children: ReactNode) => (
      <div className={cn(stackedPanelClass, "mt-4 space-y-3 p-4 text-sm text-white/80")}>{children}</div>
    );

    if (currentPrompt.type === "multi-select") {
      const hasSelection = formState.servicesRequested.length > 0;
      const services = currentPrompt.options ?? DEFAULT_SERVICE_OPTIONS;
      return container(
        <>
          {header}
          <div className="flex flex-wrap gap-2">
            {services.map((service) => {
              const selected = formState.servicesRequested.includes(service);
              return (
                <button
                  type="button"
                  key={service}
                  onClick={() => toggleService(service)}
                  className={cn(
                    "rounded-full border px-4 py-1 text-sm transition",
                    selected ? "border-siso-orange bg-siso-orange/15 text-white" : "border-white/15 text-white/70 hover:text-white",
                  )}
                >
                  {service}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={!hasSelection && currentPrompt.required} onClick={handleMultiSelectConfirm}>
              {hasSelection ? "Confirm selection" : "Skip"}
            </Button>
          </div>
        </>,
      );
    }

    if (currentPrompt.type === "chips") {
      return container(
        <>
          {header}
          <div className="flex flex-wrap gap-2">
            {(currentPrompt.options ?? []).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => completePrompt(option, { display: option })}
                className="rounded-full border border-white/15 px-4 py-1 text-sm text-white/80 hover:border-white hover:text-white"
              >
                {option}
              </button>
            ))}
          </div>
          {!currentPrompt.required && (
            <Button type="button" variant="ghost" className="text-white/70" onClick={() => completePrompt("", { skip: true })}>
              Skip
            </Button>
          )}
        </>,
      );
    }

    if ((currentPrompt.quickReplies ?? []).length > 0 && isTextPrompt) {
      return container(
        <>
          {header}
          <div className="flex flex-wrap gap-2">
            {(currentPrompt.quickReplies ?? []).map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => completePrompt(reply, { display: reply })}
                className="rounded-full border border-white/15 px-4 py-1 text-sm text-white/80 hover:border-white hover:text-white"
              >
                {reply}
              </button>
            ))}
          </div>
        </>,
      );
    }

    return null;
  };

  const renderPromptPanel = () => {
    if (!currentPrompt) return null;

    const wrap = (node: ReactNode) => (
      <div className="mx-auto mt-4 w-full max-w-5xl px-4">
        <div className={cn(stackedPanelClass, "space-y-3 p-4 text-sm text-white/85")}>{node}</div>
      </div>
    );

    if (currentPrompt.type === "multi-select" || currentPrompt.type === "chips" || ((currentPrompt.quickReplies ?? []).length > 0 && isTextPrompt)) {
      return null;
    }

    if (currentPrompt.type === "summary") {
      return wrap(
        <SummaryPrompt
          prompt={currentPrompt}
          formState={formState}
          onShareChange={(value) => onFieldChange("shareWithSiso", value)}
          onSubmit={onSubmit}
          isPending={isPending}
          resultMessage={resultMessage}
          errorMessage={errorMessage}
        />
      );
    }

    if (currentPrompt.type === "upload") {
      const hasDocs = formState.documents.length > 0;
      return wrap(
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{currentPrompt.prompt}</p>
          <p className="text-xs text-white/60">{currentPrompt.helper}</p>
          <label className={cn(nestedCardClass, "flex cursor-pointer items-center gap-2 border-dashed border-white/30 px-4 py-3 text-sm text-white/80")}>
            <Upload className="h-4 w-4" />
            <span>Upload docs / decks</span>
            <input type="file" multiple className="hidden" onChange={onDocumentUpload} />
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
            <p className="text-xs text-white/60">{currentPrompt.helper}</p>
          )}
          <div className="flex gap-2">
            <Button type="button" onClick={handleUploadContinue}>
              Continue
            </Button>
            {!hasDocs && (
              <Button type="button" variant="ghost" className="text-white/70" onClick={() => completePrompt("", { skip: true })}>
                Skip
              </Button>
            )}
          </div>
        </>,
      );
    }

    return null;
  };

  const totalStages = Math.max(wizardPrompts.length - 1, 1);
  const progressStages = Math.min(currentPromptIndex, totalStages);
  const progressPercent = Math.min(100, Math.round((progressStages / totalStages) * 100));

  const threads = useMemo<ThreadOverview[]>(() => {
    const currentPreview = resultMessage ? "Submitted • Instant review" : `Draft in progress • ${progressPercent}%`;
    return [
      {
        id: experienceSettings.experienceId,
        name: experienceSettings.threadName,
        preview: currentPreview,
        unreadCount: 0,
        badge: resultMessage ? "Submitted" : "Active",
        category: "Active Intake",
        status: resultMessage ? "submitted" : "active",
      },
      ...savedDraftThreads,
    ];
  }, [experienceSettings.experienceId, experienceSettings.threadName, progressPercent, resultMessage, savedDraftThreads]);

  const threadStatus = resultMessage ? experienceSettings.statusSubmittedLabel : experienceSettings.statusIdleLabel;
  return (
    <>
      <DirectoryOverlayLegacy
        variant={experienceSettings.directoryVariant as any}
        isOpen={isDirectoryOpen}
        threads={threads as ThreadOverview[]}
        activeThreadId={activeThreadId}
        onClose={() => setDirectoryOpen(false)}
        onSelectThread={(threadId) => {
          setActiveThreadId(threadId);
          setDirectoryOpen(false);
        }}
        outgoingRequests={outgoingRequests}
        blockedUsers={blockedContacts}
      />
      <section className="relative flex min-h-screen flex-col bg-siso-bg-primary text-siso-text-primary">
        <TierProgressBackdrop />
        <div className="relative z-10 flex flex-1 flex-col min-h-0">
          <ChatViewportLegacy
            maxWidthClassName={containerMax}
            isDirectoryOpen={isDirectoryOpen}
            onOpenDirectory={() => setDirectoryOpen(true)}
            threadName={experienceSettings.threadName}
            threadStatus={threadStatus}
            avatarLabel={experienceSettings.threadAvatarLabel}
            contentOffset={composerHeight + 120}
            showAppDrawerButton
            onOpenAppDrawer={openDrawer}
          >
            <div className="space-y-5 px-4 lg:px-6">
              <SettingsGroupCallout
                icon={<Sparkles className="h-4 w-4 text-siso-orange" />}
                title={experienceSettings.headerTitle}
                subtitle={experienceSettings.headerSubtitle}
                showChevron={false}
              >
                <div className={cn(nestedCardClass, "p-3 text-left text-xs text-white/70")}>{experienceSettings.helperText}</div>
              </SettingsGroupCallout>
              <div ref={transcriptRef} className="space-y-3 pb-4">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </div>
              {renderInlineActions()}
            </div>
          </ChatViewportLegacy>

          {!isDirectoryOpen ? renderPromptPanel() : null}
          {!isDirectoryOpen ? (
            <div className="sticky bottom-0 z-20 w-full px-0 pb-0" ref={composerHydrateRef}>
              <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-siso-bg-primary/92 backdrop-blur-xl shadow-[0_-14px_44px_rgba(0,0,0,0.65)] px-4 py-3">
                {shouldRenderComposer ? (
                  <ComposerBarLegacy
                    onHeightChange={setComposerHeight}
                    bottomOffset={0}
                    maxWidthClassName="w-full px-0"
                    showAttachmentButton={false}
                    showEmojiButton={false}
                    inputPlaceholder={composerPlaceholder}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSend={handleComposerSend}
                    sendDisabled={composerInputDisabled || (currentPrompt?.required && inputValue.trim().length === 0)}
                    inputDisabled={composerInputDisabled}
                    topSlot={
                      <div className={cn(nestedCardClass, "space-y-2 p-3 text-xs text-white/70")}>
                        <div className="flex items-center justify-between uppercase tracking-[0.35em]">
                          <span>Completion</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/15">
                          <div className="h-full rounded-full bg-gradient-to-r from-siso-orange to-orange-300" style={{ width: `${progressPercent}%` }} />
                        </div>
                      </div>
                    }
                    rightSlot={(() => {
                      const showSkipButton = Boolean(currentPrompt && !currentPrompt.required && quickReplies.length === 0 && !composerInputDisabled);
                      if (!showSkipButton) return null;
                      return (
                        <button
                          type="button"
                          className={cn(
                            secondaryActionButtonClass,
                            "rounded-full border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/85 hover:text-white",
                          )}
                          onClick={() => completePrompt("", { skip: true })}
                        >
                          Skip
                        </button>
                      );
                    })()}
                  />
                ) : (
                  <AdaptiveComposerPlaceholder
                    progressPercent={progressPercent}
                    onReveal={() => setComposerRequested(true)}
                    composerInputDisabled={composerInputDisabled}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

type AdaptiveComposerPlaceholderProps = {
  progressPercent: number;
  onReveal: () => void;
  composerInputDisabled: boolean;
};

function AdaptiveComposerPlaceholder({ progressPercent, onReveal, composerInputDisabled }: AdaptiveComposerPlaceholderProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-6">
      <div className={cn(stackedPanelClass, "space-y-3 p-4 text-center text-xs text-white/70")}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">Composer sleeping</p>
        <p className="text-white/70">
          {composerInputDisabled
            ? "Complete the current step above before the composer unlocks."
            : "Scroll here or tap below to wake the intake composer when you're ready to type."}
        </p>
        <div className="h-2 w-full rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-siso-orange to-orange-300" style={{ width: `${progressPercent}%` }} />
        </div>
        <button
          type="button"
          className={cn(
            secondaryActionButtonClass,
            "w-full rounded-full border-white/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/85 hover:text-white",
          )}
          onClick={onReveal}
        >
          Start typing
        </button>
      </div>
    </div>
  );
}

// Chat bubble moved to components/ChatBubble
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border",
          isUser ? "order-2 border-siso-orange/40 bg-siso-orange/20" : "order-1 border-siso-orange/20 bg-siso-orange/15",
        )}
      >
        {isUser ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-siso-text-primary">YOU</span>
        ) : (
          <Image src="/branding/siso-logo.svg" alt="SISO" width={20} height={20} className="h-5 w-5" priority={false} />
        )}
      </div>
      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "order-1 items-end text-right" : "order-2 items-start text-left")}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          <span className="text-white">{message.author ?? (isUser ? "You" : "Intake Assistant")}</span>
          {message.timestamp ? <span>{message.timestamp}</span> : null}
        </div>
        <div
          className={cn(
            "rounded-3xl px-4 py-2 text-sm shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
            isUser
              ? "rounded-br border border-siso-orange/40 bg-siso-orange text-[#120600]"
              : "rounded-bl border border-white/12 bg-siso-bg-tertiary text-white",
          )}
        >
          {message.content}
        </div>
        {!isUser && message.helper ? <p className="text-xs text-white/60">{message.helper}</p> : null}
      </div>
    </div>
  );
}

type DirectoryPanel = "all" | "outgoing" | "blocked" | null;
type DirectoryFilter = "all" | "unread" | "bots" | "leaders" | "drafts" | "submitted" | "needs-info";
type DirectoryVariant = "messages" | "client-submissions";

type DirectoryOverlayPropsLegacy = {
  isOpen: boolean;
  threads: ThreadOverview[];
  activeThreadId: string | null;
  onClose: () => void;
  onSelectThread: (threadId: string) => void;
  outgoingRequests: DirectoryEntry[];
  blockedUsers: DirectoryEntry[];
  variant?: DirectoryVariant;
};

function DirectoryOverlayLegacy({
  isOpen,
  threads,
  activeThreadId,
  onClose,
  onSelectThread,
  outgoingRequests,
  blockedUsers,
  variant = "messages",
}: DirectoryOverlayPropsLegacy) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<DirectoryPanel>(null);
  const [search, setSearch] = useState("");
  const [panelSearch, setPanelSearch] = useState("");
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<DirectoryFilter>("all");

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
      setActivePanel(null);
      setSearch("");
      setPanelSearch("");
      setIsFilterTrayOpen(false);
      setActiveFilter("all");
    }
  }, [isOpen]);

  const matchesFilter = (thread: ThreadOverview) => {
    if (variant === "client-submissions") {
      switch (activeFilter) {
        case "drafts":
          return thread.status === "draft";
        case "submitted":
          return thread.status === "submitted";
        case "needs-info":
          return thread.status === "needs-info";
        default:
          return true;
      }
    }
    switch (activeFilter) {
      case "unread":
        return Boolean(thread.unreadCount);
      case "bots":
        return thread.badge?.toLowerCase() === "bot";
      case "leaders":
        return Boolean(thread.badge?.toLowerCase().includes("captain"));
      default:
        return true;
    }
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredThreads = useMemo(() => {
    if (activePanel) return [];
    return threads.filter((thread) => {
      const matchesText =
        !normalizedSearch ||
        thread.name.toLowerCase().includes(normalizedSearch) ||
        (thread.preview ?? "").toLowerCase().includes(normalizedSearch);
      return matchesText && matchesFilter(thread);
    });
  }, [threads, normalizedSearch, activeFilter, activePanel]);

  const sectionOrder = useMemo(
    () => (variant === "client-submissions" ? ["Active Intake", "Saved Drafts", "Needs Attention", "Submitted"] : ["Pinned", "Recent"]),
    [variant],
  );

  const threadSections = useMemo(() => {
    if (activePanel) return [];
    const grouped = new Map<string, ThreadOverview[]>();
    filteredThreads.forEach((thread) => {
      const fallbackCategory = variant === "client-submissions" ? "Saved Drafts" : "Recent";
      const key = (thread as any).category ?? fallbackCategory;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(thread);
    });
    const ordered: Array<{ label: string; entries: ThreadOverview[] }> = [];
    sectionOrder.forEach((label) => {
      if (grouped.has(label)) {
        ordered.push({ label, entries: grouped.get(label)! });
        grouped.delete(label);
      }
    });
    grouped.forEach((entries, label) => {
      ordered.push({ label, entries });
    });
    return ordered;
  }, [filteredThreads, activePanel, sectionOrder, variant]);

  const panelData = useMemo(() => {
    switch (activePanel) {
      case "outgoing":
        return {
          title: "Outgoing Requests",
          description: "Pending requests you have sent.",
          entries: outgoingRequests,
          emptyLabel: "No pending requests",
          searchPlaceholder: "Search outgoing requests",
        };
      case "blocked":
        return {
          title: "Blocked Contacts",
          description: "Users you muted or blocked.",
          entries: blockedUsers,
          emptyLabel: "You haven't blocked anyone",
          searchPlaceholder: "Search blocked users",
        };
      case "all":
        return {
          title: "All Contacts",
          description: "Full directory of threads and connections.",
          entries: threads.map(({ id, name, preview }) => ({ id, name, note: preview })),
          emptyLabel: "No contacts available",
          searchPlaceholder: "Search contacts",
        };
      default:
        return null;
    }
  }, [activePanel, blockedUsers, outgoingRequests, threads]);

  const filterOptions =
    variant === "client-submissions"
      ? [
          { id: "all", label: "All" },
          { id: "drafts", label: "Drafts" },
          { id: "submitted", label: "Submitted" },
          { id: "needs-info", label: "Needs Info" },
        ]
      : undefined;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[95] flex">
        <aside className="relative h-full w-[90%] max-w-md overflow-y-auto border-r border-[#2a1d13] bg-[#0a0806]/95 shadow-[18px_0_50px_rgba(0,0,0,0.55)]">
          <div className="flex min-h-full flex-col gap-2.5 px-5 py-4 pr-5">
            <DirectoryHeader
              isMenuOpen={isMenuOpen}
              onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
              onSelectPanel={(panel) => {
                setIsMenuOpen(false);
                setActivePanel(panel as DirectoryPanel);
                setPanelSearch("");
              }}
              title={variant === "client-submissions" ? "Client Submissions" : "Messages & Friends"}
              color="orange"
            />

            <DirectorySearchBar
              search={search}
              onSearchChange={setSearch}
              activeFilter={activeFilter}
              onFilterChange={(value) => setActiveFilter(value as DirectoryFilter)}
              isFilterTrayOpen={isFilterTrayOpen}
              onToggleFilters={() => setIsFilterTrayOpen((prev) => !prev)}
              searchPlaceholder={variant === "client-submissions" ? "Search submissions" : "Search threads"}
              filterOptions={filterOptions as any}
            />

            {!activePanel && (
              <div className="space-y-4">
                {threadSections.map(({ label, entries }) => (
                  <div key={label} className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">{label}</p>
                    <div className="space-y-3">
                      {entries.map((thread) => {
                        const isActive = thread.id === activeThreadId;
                        return (
                          <button
                            key={thread.id}
                            type="button"
                            onClick={() => onSelectThread(thread.id)}
                            className={cn(
                              "w-full rounded-2xl border px-3 py-3 text-left transition-colors",
                              isActive
                                ? "border-siso-orange/60 bg-siso-orange/10 text-white"
                                : "border-white/10 bg-white/5 text-white/80 hover:border-white/20",
                            )}
                          >
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                              <span>{(thread as any).category ?? "Program"}</span>
                              {thread.badge ? <span className="text-[10px] text-white/70">{thread.badge}</span> : null}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-white">{thread.name}</p>
                            <p className="text-xs text-white/70">{thread.preview}</p>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                              <span>{(thread as any).timestamp ?? "Moments ago"}</span>
                              {typeof thread.unreadCount === "number" && thread.unreadCount > 0 ? (
                                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                                  {thread.unreadCount} new
                                </span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        <button type="button" aria-label="Close overlay" className="flex-1 bg-black/55" onClick={onClose} />
      </div>

      {activePanel && panelData && (
        <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-siso-bg-tertiary p-4 text-white shadow-[0_0_40px_rgba(0,0,0,0.55)]">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{panelData.title}</p>
                <p className="text-xs text-white/60">{panelData.description}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 p-2 text-white/70 hover:text-white"
                onClick={() => setActivePanel(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              value={panelSearch}
              onChange={(e) => setPanelSearch(e.target.value)}
              placeholder={panelData.searchPlaceholder}
              className="mb-3 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {panelData.entries
                .filter((e) => e.name.toLowerCase().includes(panelSearch.trim().toLowerCase()))
                .map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      {activePanel === "outgoing" ? <ArrowUpRight className="h-4 w-4 text-siso-orange" /> : null}
                      {activePanel === "blocked" ? <Shield className="h-4 w-4 text-white/50" /> : null}
                      <span className="font-semibold text-white">{entry.name}</span>
                    </div>
                    {entry.note ? <p className="text-xs text-white/60">{entry.note}</p> : null}
                  </div>
                ))}
              {panelData.entries.filter((e) => e.name.toLowerCase().includes(panelSearch.trim().toLowerCase())).length === 0 ? (
                <p className="text-center text-xs text-white/50">{panelData.emptyLabel}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type ChatViewportPropsLegacy = {
  isDirectoryOpen: boolean;
  onOpenDirectory: () => void;
  threadName?: string;
  threadStatus?: string;
  avatarLabel?: string;
  contentOffset?: number;
  onToggleThreadInfo?: () => void;
  isThreadInfoOpen?: boolean;
  onOpenAppDrawer?: () => void;
  maxWidthClassName?: string;
  showDirectoryToggle?: boolean;
  showAppDrawerButton?: boolean;
  showHeader?: boolean;
  children: ReactNode;
};

function ChatViewportLegacy({
  isDirectoryOpen,
  onOpenDirectory,
  threadName = "SISO Agency",
  threadStatus = "Active now",
  avatarLabel = "SA",
  contentOffset = 16,
  onToggleThreadInfo,
  isThreadInfoOpen,
  onOpenAppDrawer,
  maxWidthClassName = "max-w-5xl",
  showDirectoryToggle = true,
  showAppDrawerButton = true,
  showHeader = true,
  children,
}: ChatViewportPropsLegacy) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const maxWidth = maxWidthClassName ?? "max-w-5xl";

  useLayoutEffect(() => {
    if (!showHeader) {
      setHeaderHeight(0);
      return;
    }
    const node = headerRef.current;
    if (!node) return;

    const measure = () => setHeaderHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [showHeader]);

  return (
    <div
      aria-hidden={isDirectoryOpen}
      className={cn(
        "flex flex-1 flex-col font-sans transition-opacity duration-150",
        isDirectoryOpen ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {showHeader ? (
        <header
          ref={headerRef}
          className={cn(
            "sticky top-0 z-[84] flex w-full items-center gap-3 border-b border-white/10 bg-siso-bg-tertiary/95 px-3 py-2 pt-[env(safe-area-inset-top,0px)] backdrop-blur transition-opacity",
            `md:w-full ${maxWidth} md:mb-1 md:rounded-b-2xl md:border md:border-white/10 md:px-4 md:py-1.5 md:pt-0`,
            isDirectoryOpen && "pointer-events-none",
          )}
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,255,255,0.18)" }}
        >
          {showDirectoryToggle ? (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="inline-flex items-center text-siso-text-primary transition hover:text-siso-orange"
              aria-label="Open message directory"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onToggleThreadInfo?.()}
            aria-expanded={Boolean(onToggleThreadInfo && isThreadInfoOpen)}
            className={cn(
              "flex flex-1 items-center gap-2 overflow-hidden rounded-full px-2 py-1 text-left transition",
              onToggleThreadInfo ? "hover:bg-white/5" : "cursor-default",
              isThreadInfoOpen && "bg-white/5",
            )}
            disabled={!onToggleThreadInfo}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-siso-orange/20 text-[10px] font-semibold uppercase text-siso-orange">
              {avatarLabel}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold uppercase tracking-[0.35em] text-siso-text-primary">
                {threadName}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-siso-text-muted">
                {threadStatus}
              </span>
            </div>
          </button>
          {showAppDrawerButton ? (
            <button
              type="button"
              className="ml-auto inline-flex items-center text-siso-text-muted transition hover:text-siso-orange"
              aria-label="Open campus drawer"
              onClick={onOpenAppDrawer}
              disabled={!onOpenAppDrawer}
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : null}
        </header>
      ) : null}

      {showHeader ? <div style={{ height: headerHeight }} aria-hidden /> : null}

      <article className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div
          className="flex-1 space-y-2.5 overflow-y-auto pr-0"
          style={{ paddingBottom: contentOffset, paddingTop: 12, paddingLeft: 4, paddingRight: 4 }}
        >
          {children}
        </div>
      </article>
    </div>
  );
}

type ComposerBarPropsLegacy = {
  onHeightChange?: (height: number) => void;
  bottomOffset?: number;
  maxWidthClassName?: string;
  showAttachmentButton?: boolean;
  showEmojiButton?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
  sendDisabled?: boolean;
  rightSlot?: React.ReactNode;
  inputDisabled?: boolean;
  topSlot?: React.ReactNode;
};

function ComposerBarLegacy({
  onHeightChange,
  bottomOffset = 0,
  maxWidthClassName = "max-w-md",
  showAttachmentButton = true,
  showEmojiButton = true,
  inputPlaceholder = "Message SISO Agency",
  inputValue,
  onInputChange,
  onSend,
  sendDisabled,
  rightSlot,
  inputDisabled = false,
  topSlot,
}: ComposerBarPropsLegacy) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onHeightChange) return;
    const node = barRef.current;
    if (!node) return;

    const emit = () => onHeightChange(node.offsetHeight);
    emit();

    const resizeObserver = new ResizeObserver(emit);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [onHeightChange]);

  return (
    <footer
      ref={barRef}
      className="fixed inset-x-0 z-[75] rounded-t-2xl border border-white/10 bg-siso-bg-tertiary/90 backdrop-blur"
      style={{
        bottom: bottomOffset,
        boxShadow: "0 -18px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
    >
      <div className={cn("relative mx-auto w-full", maxWidthClassName)}>
        {topSlot ? (
          <div className="pointer-events-none absolute inset-x-0 -top-[64px] px-3.5">
            <div className="mb-3">{topSlot}</div>
          </div>
        ) : null}
        <div className="flex w-full items-center gap-3 px-3.5 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
          {showAttachmentButton ? (
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-siso-bg-tertiary text-siso-text-primary"
              aria-label="Add attachment"
              onClick={() => onInputChange?.(`${inputValue ?? ""} `)}
            >
              +
            </button>
          ) : null}
          <div className="flex flex-1">
            <AnimatedGlowingSearchBar
              placeholder={inputPlaceholder}
              wrapperClassName="w-full"
              className="text-base font-sans"
              value={inputValue}
              onChange={(event) => onInputChange?.(event.target.value)}
              disabled={inputDisabled}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend?.();
                }
              }}
            />
          </div>
          {rightSlot}
          {showEmojiButton ? (
            <button
              type="button"
              className="text-siso-text-muted transition hover:text-siso-orange"
              aria-label="Insert emoji"
              onClick={() => onInputChange?.(`${inputValue ?? ""} 🙂`)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 10h.01M15 10h.01" strokeLinecap="round" />
                <path d="M8.5 14c.6 1.2 2.1 2 3.5 2s2.9-.8 3.5-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          {onSend ? (
            <button
              type="button"
              className="rounded-full bg-siso-orange px-3 py-1 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onSend}
              disabled={sendDisabled}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function SummaryRow({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className={cn(nestedCardClass, "flex flex-col gap-1 border-white/20 px-4 py-3 text-white")}>
      <span className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</span>
      <span className="text-base font-semibold text-white">{value}</span>
      {helper && <span className="text-sm text-white/70">{helper}</span>}
    </div>
  );
}
