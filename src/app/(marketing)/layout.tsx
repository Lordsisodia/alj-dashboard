'use client';
import { usePathname } from 'next/navigation';
import { MarketingNavBar } from '@/features/marketing/components/navbar/NavBar';
import ChatBotIcon from '@/features/marketing/components/landing/ChatBotIcon';

const AUTH_ROUTES = ['/sign-in', '/sign-up', '/login'];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isAuth) return <>{children}</>;

  return (
    <div>
      <MarketingNavBar />
      <main>{children}</main>
      <ChatBotIcon />
    </div>
  );
}
