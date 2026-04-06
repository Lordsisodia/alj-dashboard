import PlatformComingSoon from '@/features/instagram/components/PlatformComingSoon';

function TikTokIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

export default function TikTokPage() {
  return (
    <PlatformComingSoon
      name="TikTok"
      icon={<TikTokIcon />}
      gradient="linear-gradient(135deg, #010101, #69C9D0)"
      description="Connect TikTok accounts, schedule short-form videos, and track views, shares, and follower growth - all from the ISSO dashboard."
    />
  );
}
