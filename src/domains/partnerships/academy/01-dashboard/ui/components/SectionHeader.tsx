interface SectionHeaderProps {
  label: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ label, description, actionLabel = "View all", onAction }: SectionHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-semibold text-siso-text-primary">{label}</h2>
        {description && <p className="text-sm text-siso-text-muted">{description}</p>}
      </div>
      <button
        type="button"
        className="text-sm text-siso-text-muted underline underline-offset-4"
        aria-label={actionLabel}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </header>
  );
}

