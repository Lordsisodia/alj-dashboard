"use client";
import { MemoryRouter } from 'react-router-dom';
import ClientLandingPage from '@/domains/client-base/landing-client/LandingPage';

export default function LandingPage2() {
  return (
    <MemoryRouter>
      <ClientLandingPage />
    </MemoryRouter>
  );
}
