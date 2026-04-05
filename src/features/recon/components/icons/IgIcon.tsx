'use client';

interface IgIconProps {
  size?: number;
}

export function IgIcon({ size = 13 }: IgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-recon" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f09433" />
          <stop offset="25%"  stopColor="#e6683c" />
          <stop offset="50%"  stopColor="#dc2743" />
          <stop offset="75%"  stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-recon)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="url(#ig-recon)" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-recon)" />
    </svg>
  );
}
