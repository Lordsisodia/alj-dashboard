import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

/**
 * Sticky page header that sits at the top of every content page.
 * Lives in the content area - NOT in the sidebar.
 *
 * Usage:
 *   <PageHeader title="Schedule" description="Plan your content." actions={<Button>+ Post</Button>} />
 */
export function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-4 px-8 h-14 border-b border-black/[0.06] flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
      {icon && (
        <span className="text-neutral-400 flex-shrink-0">{icon}</span>
      )}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-sm font-semibold text-neutral-900 leading-tight truncate">{title}</h1>
        {description && (
          <p className="text-xs text-neutral-400 leading-tight truncate">{description}</p>
        )}
      </div>
      {actions && (
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
