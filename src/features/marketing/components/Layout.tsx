'use client';
import { usePathname } from 'next/navigation';
import NavBar from './layout/navbar/NavBar';
import ChatBotIcon from '@/features/marketing/components/landing/ChatBotIcon';

const AUTH_ROUTES = ['/sign-up', '/sign-in', '/login'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some(r => (pathname ?? '').startsWith(r));

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <ChatBotIcon />
    </div>
  );
}
