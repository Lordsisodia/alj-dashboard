'use client';

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({ children, className = '' }: SettingsCardProps) {
  return (
    <div
      className={`rounded-xl bg-white p-5 ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {children}
    </div>
  );
}
