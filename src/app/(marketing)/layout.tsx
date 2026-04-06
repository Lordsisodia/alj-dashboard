'use client';
import { usePathname } from 'next/navigation';
import { MarketingNavBar } from '@/features/marketing/components/layout/navbar/NavBar';
import ChatBotIcon from '@/features/marketing/components/landing/ChatBotIcon';

const AUTH_ROUTES = ['/sign-in', '/sign-up', '/login'];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isAuth) return <>{children}</>;

  return (
    // Solid black background + z-index blocks the root layout's wave animation from bleeding through
    <div style={{ background: '#000', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Load Webflow-generated foreplay.css — contains sprite, button, and layout classes used by pricing/FAQ/navbar */}
      <link rel="stylesheet" href="/marketing-css/foreplay.css" />
      <MarketingNavBar />
      <main>{children}</main>
      <ChatBotIcon />
    </div>
  );
}
